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
		"1000", "1001", "1002", "1003"
	];
	res.json(rooms);
};