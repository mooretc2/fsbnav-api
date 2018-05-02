var logger = require('../../log/logger'),
    accessLog = logger.accessLog,
    errorLog = logger.errorLog,
    nodes = require('../models/nodes'),
    edges = require('../models/edges'),
    rooms = require('../models/rooms'),
    cells = require('../models/cells');



//current algorithm does not make use of searching through database nodes, getting edges, or checking for stair/elevator preferences
//origin and destination must be ints (primary key of node)
//preference must be a tinyint (0 or 1)
async function router(originR, destinationR, preference){

    //Change rooms to nodes FUNCTION
    try{
        origin = await rooms.getNodeIDByRoomID(originR);
        destination = await rooms.getNodeIDByRoomID(destinationR);

        //number of nodes (must be pulled from database... and stored in web services globally)
        var numOfNodes = await nodes.getNumNodes();
    }catch(error){};

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

        try{
            adjacentList = await edges.getAdjacentNode(current, preference);
        }catch(error){};
        
        
        for(i = 0; i < adjacentList.length; i++)   {
            if(!originVisited[i])   {
                originParent[i] = current;
                originVisited[i] = true;
                originQueue.push(i);
            }
        }

        //BFS for backward
        current = destQueue.shift();
        try{
            adjacentList = await edges.getAdjacentNode(current, preference);
        }catch(error){};

        for(i = 0; i < adjacentList.length; i++)   {
            if(!destVisited[i]) {
                destParent[i] = current;
                destVisited[i] = true;
                destQueue.push(i);
        }
        }

            //check for intersection
        intersectNode = isIntersecting(numOfNodes, originVisited, destVisited);

            //if intersecting vertex is found, there is a path
        if (intersectNode != -1) {
            var path = [];
            path.push(intersectNode);
            i = intersectNode;
            while(i != origin) {
                path.unshift(originParent[i]);
                i = originParent[i];
            }
            i = intersectNode;
            while(i != destination) {
                path.push(destinationParent[i]);
                i = destinationParent[i];
            }

            var retPath = [];
            cellInfo;

            //CONVERSION node to cells
            try{
                for(i = 0; i < path.length; i++) {
                    cellInfo = await cells.getCellByNodeID(path[i]);
                    retPath.push(cellInfo);
                }
            }catch(error){};

            return new Promise(function(resolve){
                resolve(retPath);
            });
        }
    }
    return new Promise(function(reject){
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



exports.getRoute = async function(req, res){
	accessLog.info('getRoute: ' + JSON.stringify(req.body) + ' params: ' + JSON.stringify(req.params));

    if(!req.body || (req.body.constructor === Object && Object.keys(req.body).length === 0)){
        errorLog.warn("getRoute Bad Request: " + JSON.stringify(req.body));
        res.status(400).send("Request must not be empty");
    } else if(req.body.method && req.body.method === "room to room") {
        try{
            path = router(req.body.origin, req.body.destination, req.body.stairs);
        } catch (err) {
            errorLog.error("getRoute: " + err);
            res.status(500).send("Something went wrong");
        }
	} else if(req.body.sensors.length < 3){
		errorLog.warn("getRoute Bad request: " + JSON.stringify(req.body));
		res.status(400).send("Request must include data from at least 3 sensors");
	} else {
		if(req.body.stairs){ 
			if(req.body.stairs != "true" || req.body.stairs != "false"){
				//path = router(begin, end, stairs);
			}
		}
		var waypoints = [
			{floor:1,x:5,y:26},
			{floor:1,x:7,y:26},
			{floor:1,x:7,y:12},
			{floor:2,x:6,y:10},
			{floor:2,x:6,y:11},
			{floor:2,x:21,y:11},
			{floor:2,x:21,y:9},
			{floor:2,x:25,y:9}
		];
	}
	res.json(waypoints);
};

exports.getRooms = async function(req, res){
	accessLog.info('getRooms:  params: ' + JSON.stringify(req.params));
    var data;
    try{
        data = await rooms.getAll();
    } catch (err) {
        res.status(500).send("error getting data from the database");
        errorLog.error("getRooms: " + err);
    }
	res.json(data);
};


exports.getRoomsByID = async function(req, res){
    accessLog.info('getRoomsById:  params: ' + JSON.stringify(req.params));
    var data;
    try{
        data = await rooms.getAllStartingWith(parseInt(req.params.roomID));
    } catch(err){
        res.status(500).send("error getting data from the database");
        errorLog.error("getRoomsById : " + err);
    }
	res.json(data);
};

exports.testFunction = async function(req, res){
	data = await router(5, 35, 1);
	res.json(data);
};
