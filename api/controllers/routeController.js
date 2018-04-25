var logger = require('../../log/logger'),
    accessLog = logger.accessLog,
    errorLog = logger.errorLog,
    nodes = require('../models/nodes'),
    edges = require('../models/edges'),
    rooms = require('../models/rooms');

//current algorithm does not make use of searching through database nodes, getting edges, or checking for stair/elevator preferences
//origin and destination must be ints (primary key of node)
//preference must be a tinyint (0 or 1)
function router(origin, destination, preference){
	
    //number of nodes (must be pulled from database... and stored in web services globally)
    var numOfNodes = 70;

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
        //BFS for both
        BFS(originQueue, originVisited, originParent);
        BFS(destQueue, destVisited, destParent);

        //check for intersection
        intersectNode = isIntersecting(numOfNodes, originVisited, destVisited);

        //if intersecting vertex is found, there is a path
        if (intersectNode != -1) {
            //return path. still needs to be done
        }
    }
    //Failure. not sure what to put here if failure occurs
}

//Breadth First Search function. used by router
function BFS(queue, visited, parent) {
    //BFS code... can't seem to get array or queue functions
    
}

//check for intersection between BFS. used by router
function isIntersecting(numOfNodes, originVisited, destVisited) {
    for (i = 0; i < numOfNodes; i++) {
        if (originVisited[i] && destVisited[i]) //I don't get errors with this line, so why does this work?
            return i;
    }
    return -1;
}

exports.getRoute = function(req, res){
	accessLog.info('/route: ' + JSON.stringify(req.body) + ' params: ' + JSON.stringify(req.params));

	if(!req.body || (req.body.constructor === Object && Object.keys(req.body).length === 0) || req.body.sensors.length < 3){
		errorLog.warn("Bad request: " + JSON.stringify(req.body));
		res.status(400).send({msg: "Request must include data from at least 3 sensors"});
	} else if(req.body.method && req.body.method == "room to room") {
		//path = router(begin, end, stairs);
		var waypoints = [
			{x: "0", y: "10"},
			{x: "10", y: "10"},
			{x: "10", y: "0"},
			{x: "0", y: "0"}
		];
	} else {
		if(req.body.stairs){ 
			if(req.body.stairs != "true" || req.body.stairs != "false"){
				//path = router(begin, end, stairs);
			}
		}
		var waypoints = [
			{x: "0", y: "10"},
			{x: "10", y: "10"},
			{x: "10", y: "0"},
			{x: "0", y: "0"}
		];
	}
	res.json(waypoints);
};

exports.getRooms = function(req, res){
	accessLog.info('/rooms:  params: ' + req.params);
	rooms.getAll(function(err, data){
		console.log(err);
		console.log(JSON.stringify(data));
		res.json(data);
	});
	//res.json(rooms);
};
