var logger = require('../../log/logger'),
    accessLog = logger.accessLog,
    errorLog = logger.errorLog,
    nodes = require('../models/nodes'),
    edges = require('../models/edges'),
    rooms = require('../models/rooms'),
    cells = require('../models/cells'),
    beacons = require('../models/beacons');

//current algorithm does not make use of searching through database nodes, getting edges, or checking for stair/elevator preferences
//origin and destination must be ints (primary key of node)
//preference must be a tinyint (0 or 1)
async function router(originR, destinationR, preference) {

    //Change rooms to nodes FUNCTION
    try {
        origin = await rooms.getNodeIDByRoomID(originR);
        destination = await rooms.getNodeIDByRoomID(destinationR);

        //number of nodes (must be pulled from database... and stored in web services globally)
        var numOfNodes = await nodes.getNumNodes();
    } catch (error) {
        errorLog.error("getNodeIDByRoomID: " + error);
        res.status(500).send("Error getting data from the database");
    };

    //boolean arrays to store visited node primary keys
    var originVisited = new Array(numOfNodes).fill(false);
    var destVisited = new Array(numOfNodes).fill(false);

    //int arrays to track node parents
    var originParent = new Array(numOfNodes);
    var destParent = new Array(numOfNodes);

    //int queue for front and back searches
    var originQueue = [];
    var destQueue = [];

    //track intersect node: must be an int to work properly
    intersectNode = -1;

    originQueue.push(origin);
    originVisited[origin] = true;
    originParent[origin] = -1;

    destQueue.push(destination);
    destVisited[destination] = true;
    destParent[destination] = -1;

    while (originQueue.length != 0 && destQueue.length != 0) {

        //BFS for forward
        current = originQueue.shift();
        var adjacentList;

        try {
            adjacentList = await edges.getAdjacentNode(current, preference);
        } catch (error) {
            errorLog.error("getAdjacentNode: " + error);
            res.status(500).send("Error getting data from the database");
        };


        for (i = 0; i < adjacentList.length; i++) {
            if (!originVisited[adjacentList[i]]) {
                originParent[adjacentList[i]] = current;
                originVisited[adjacentList[i]] = true;
                originQueue.push(adjacentList[i]);
            }
        }

        //BFS for backward
        current = destQueue.shift();
        try {
            adjacentList = await edges.getAdjacentNode(current, preference);
        } catch (error) {
            errorLog.error("getAdjacentNode: " + error);
            res.status(500).send("Error getting data from the database");
        };

        for (i = 0; i < adjacentList.length; i++) {
            if (!destVisited[adjacentList[i]]) {
                destParent[adjacentList[i]] = current;
                destVisited[adjacentList[i]] = true;
                destQueue.push(adjacentList[i]);
            }
        }

        //check for intersection
        intersectNode = isIntersecting(numOfNodes, originVisited, destVisited);

        //if intersecting vertex is found, there is a path
        if (intersectNode != -1) {
            var path = [];
            path.push(intersectNode);
            i = intersectNode;
            while (i != origin) {
                path.unshift(originParent[i]);
                i = originParent[i];
            }
            i = intersectNode;
            while (i != destination) {
                path.push(destParent[i]);
                i = destParent[i];
            }

            var retPath = [];
            var cellInfo;

            //CONVERSION node to cells
            try {
                for (i = 0; i < path.length; i++) {
                    cellInfo = await cells.getCellByNodeID(path[i]);
                    retPath.push(cellInfo[0]);
                }
            } catch (error) {
                errorLog.error("getCellIDByNodeID: " + error);
                res.status(500).send("Error getting data from the database");
            };

            return new Promise(function (resolve) {
                resolve(retPath);
            });
        }
    }
    return new Promise(function (reject) {
        reject(err);
    });
}

//check for intersection between BFS. used by router
function isIntersecting(numOfNodes, originVisited, destVisited) {
    for (i = 0; i < numOfNodes; i++) {
        if (originVisited[i] && destVisited[i]) //I don't get errors with this line, so why does this work?
            return i;
    }
    return -1;
}



exports.getRoute = async function (req, res) {
    var path;
    accessLog.info('getRoute: ' + JSON.stringify(req.body) + ' params: ' + JSON.stringify(req.params));

    if (!req.body || (req.body.constructor === Object && Object.keys(req.body).length === 0)) {
        errorLog.warn("getRoute Bad Request: " + JSON.stringify(req.body));
        res.status(400).send("Request must not be empty");
    } else if (req.body.method && req.body.method == "room to room") {
        try {
            path = await router(req.body.origin, req.body.destination, req.body.stairs);
        } catch (err) {
            errorLog.error("getRoute[153]: " + err);
            res.status(500).send("Something went wrong");
        }
    } else if(req.body.method && req.body.method === "bluetooth") {
        if (req.body.stairs === "true"){
            try {
		origin = await beacons.getRoomByBeaconMinor(parseInt(req.body.sensors[0].minor));
                path = await router(origin, parseInt(req.body.destination), 1);
            } catch (err) {
                errorLog.error("getRoute[162]: " + err);
                res.status(500).send("Something went wrong: "+err);
            }
        } else if(req.body.stairs === "false") {
            try {
		origin = await beacons.getRoomByBeaconMinor(parseInt(req.body.sensors[0].minor));
		path = await router(origin, req.body.destination, 0);
            } catch (err) {
                errorLog.error("getRoute[170]: " + err);
                res.status(500).send("Something went wrong: "+err);
            }
        }
    } else {
	errorLog.error("getRoute: Bad Request: " + JSON.stringify(req.body));
	res.status(400).send("Bad request: " + JSON.stringify(req.body));
    }
    res.json(path);
};

exports.getRooms = async function (req, res) {
    accessLog.info('getRooms:  params: ' + JSON.stringify(req.params));
    var data;
    try {
        data = await rooms.getAll();
    } catch (err) {
        res.status(500).send("error getting data from the database");
        errorLog.error("getRooms: " + err);
    }
    res.json(data);
};


exports.getRoomsByID = async function (req, res) {
    accessLog.info('getRoomsById:  params: ' + JSON.stringify(req.params));
    var data;
    try {
        data = await rooms.getAllStartingWith(parseInt(req.params.roomID));
    } catch (err) {
        res.status(500).send("error getting data from the database");
        errorLog.error("getRoomsById : " + err);
    }
    res.json(data);
};

exports.testFunction = async function (req, res) {
    data = await router(1038, 2000, 0);
    res.json(data);
};
