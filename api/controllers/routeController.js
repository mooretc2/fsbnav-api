var logger = require('../../log/logger'),
    accessLog = logger.accessLog,
    errorLog = logger.errorLog;

function router(begin, end, stairs){
	//TODO: search algorithm
}

exports.getRoute = function(req, res){
	accessLog.info('/route: ' + JSON.stringify(req.body) + ' params: ' + JSON.stringify(req.params));

	if(!req.body || (req.body.constructor === Object && Object.keys(req.body).length === 0) || req.body.sensors.length < 3){
		errorLog.warn("Bad request: " + JSON.stringify(req.body));
		res.status(400).send({msg: "Request must include data from at least 3 sensors"});
	} else if(req.body.method && req.body.method == "room to room") {
		//path = router(begin, end, stairs);
		var waypoints = [
			{floor:1,x:5,y:26},
			{floor:1,x:7,y:26},
			{floor:1,x:7,y:13},
			{floor:1,x:21,y:13},
			{floor:1,x:21,y:15},
			{floor:1,x:30,y:15},
			{floor:1,x:30,y:13},
			{floor:1,x:33,y:13},
			{floor:1,x:33,y:14},
			{floor:2,x:32,y:12},
			{floor:2,x:33,y:12},
			{floor:2,x:33,y:11},
			{floor:2,x:30,y:11},
			{floor:2,x:30,y:8},
			{floor:2,x:25,y:8}
		];
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

exports.getRooms = function(req, res){
	accessLog.info('/rooms:  params: ' + req.params);
	var rooms = [
		{roomNum: "1000", popular: "true"},
		{roomNum: "1001", popular: "false"},
		{roomNum: "1002", popular: "false"},
		{roomNum: "1003", popular: "true"}
	];
	res.json(rooms);
};
