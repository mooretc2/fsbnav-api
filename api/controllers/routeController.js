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


/**
 * Routes the user from their origin to their destination
 * @param {Object}   req HTTP request coming in to the server.
 * @param {Object}   req.body Body of the HTTP request coming in to the server.
 * @param {string}   req.body.method Method of navigation, either "bluetooth" or "room to room".
 * @param {Object[]} [req.body.sensors] Array of sensors to be used for bluetooth routing. Required when method="bluetooth".
 * @param {number}   [req.body.sensors[].minor] Minor ID of the nearest bluetooth sensor.
 * @param {number}   [req.body.origin] Room number of origin room. Required when method="room to room".
 * @param {number}   req.body.destination Room number of destination room.
 * @param {string}   req.body.stairs Preference of stairs vs. elevator. "true" if stairs is preference, "false" if elevator is preference.
 * @param {Object}   res HTTP response to be sent back.
 * @param {Object[]} res.body Body of the HTTP response. Contains a list of coordinates that represents the route from the origin to the destination.
 * @param {number}   res.body[].floorID Floor number the coordinate maps to.
 * @param {number}   res.body[].x X coordinate.
 * @param {number}   res.body[].y Y coordinate.
 */
exports.getRoute = async function (req, res) {
    var path;
    accessLog.info('getRoute: ' + JSON.stringify(req.body) + ' params: ' + JSON.stringify(req.params));

    if (!req.body || (req.body.constructor === Object && Object.keys(req.body).length === 0)) {
        errorLog.warn("getRoute[147]: Bad Request: " + JSON.stringify(req.body));
        res.status(400).send("Request must not be empty");
    } else if (req.body.method && req.body.method == "room to room") {
        try {
            path = await router(req.body.origin, req.body.destination, req.body.stairs);
        } catch (err) {
            errorLog.error("getRoute[153]: " + err);
            res.status(500).send("Something went wrong");
        }
    } else if (req.body.method && req.body.method === "bluetooth") {
        if (req.body.stairs === "true") {
            try {
		origin = await beacons.getRoomByBeaconMinor(parseInt(req.body.sensors[0].minor));
                path = await router(origin, parseInt(req.body.destination), 1);
            } catch (err) {
                errorLog.error("getRoute[162]: " + err);
                res.status(500).send("Something went wrong: " + err);
            }
        } else if (req.body.stairs === "false") {
            try {
                origin = await beacons.getRoomByBeaconMinor(parseInt(req.body.sensors[0].minor));
                path = await router(origin, req.body.destination, 0);
            } catch (err) {
                errorLog.error("getRoute[170]: " + err);
                res.status(500).send("Something went wrong: " + err);
            }
        }
    } else {
        errorLog.error("getRoute[175]: Bad Request: " + JSON.stringify(req.body));
        res.status(400).send("Bad request: " + JSON.stringify(req.body));
    }
    res.json(path);
};

/**
 * Returns a list of all the rooms in the database.
 * @param {Object}   req HTTP request coming in to the server.
 * @param {Object}   res HTTP response to be sent back.
 * @param {Object[]} res.body Body of the HTTP response. Contains a list of rooms.
 * @param {string}   res.body[].roomName Name of the room, eg. "Taylor Auditorium".
 * @param {number}   res.body[].roomNumber Number of the room, eg. 1000.
 * @param {number}   res.body[].isPopular 1 if the room is considered "popular", 0 if it is not.
 */
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

/**
 * Returns a list of all the rooms in the database with a room number that contains roomID.
 * @param {Object}   req HTTP request coming in to the server.
 * @param {Object}   req.params Parameters in the URL of the HTTP request.
 * @param {number}   req.params.roomID ID to compare the room numbers to.
 * @param {Object}   res HTTP response to be sent back.
 * @param {Object[]} res.body Body of the HTTP response. Contains a list of rooms.
 * @param {string}   res.body[].roomName Name of the room, eg. "Taylor Auditorium".
 * @param {number}   res.body[].roomNumber Number of the room, eg. 1000.
 * @param {number}   res.body[].isPopular 1 if the room is considered "popular", 0 if it is not.
 */
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
