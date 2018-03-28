var logger = require('../../log/logger'),
    accessLog = logger.accessLog,
    errorLog = logger.errorLog;

exports.getRoute = function(req, res){
	accessLog.info('/route: ' + req.body + ' params: ' + req.params);
	if(!req.body || (req.body.constructor === Object && Object.keys(req.body).length === 0) || req.body.sensors.length < 3){
		errorLog.warn("Bad request: " + JSON.stringify(req.body));
		res.status(400).send('Request must include data from at least 3 sensors');
	} else {
		if(req.body.stairs){ 
			if(req.body.stairs != "true" || req.body.stairs != "false"){
				
			}
		}
		var waypoints = [
			["10", "0", "0"],
			["0", "10", "0"],
			["0", "0", "10"],
			["0", "0", "0"]
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
