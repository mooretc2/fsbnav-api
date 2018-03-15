var logger = require('../../log/logger'),
    accessLog = logger.accessLog,
    errorLog = logger.errorLog;

exports.getRoute = function(req, res){
	accessLog.info('/route: ' + req.body + ' params: ' + req.params);
	if(!req.body || (req.body.constructor === Object && Object.keys(req.body).length === 0) || req.body.sensors.length < 3){
		errorLog.warn("Bad request: " + req.body);
		res.status(400).send('Request must include data from at least 3 sensors');
	} else if(!req.body.stairs || req.body.stairs != "true" || req.body.stairs != "false"){
		errorLog.warn("Bad request: " + req.body);
		res.status(400).send('Request must contain a "stairs" value that is either "true" or "false"');
	} else {
		var waypoints = [
			["10", "0", "0"],
			["0", "10", "0"],
			["0", "0", "10"],
			["0", "0", "0"]
		];
	}
	res.json(waypoints);
};
