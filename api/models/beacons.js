var db = require('../../db.js');

exports.getRoomByBeaconMinor = function (minor) {
	return new Promise(function (resolve, reject) {
		db.get().query('SELECT roomNumber FROM beacon WHERE beaconMinor = ?', minor, function (err, rows) {
				if (err) reject(err);
				else if(rows[0]) resolve(rows[0].roomNumber);
				else reject("Beacon with minor "+minor+" does not exist");
			});
	});
}
