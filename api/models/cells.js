var db = require('../../db.js');

exports.getCellByNodeID = function (nodeID, done) {
	return new Promise(function (resolve, reject) {
		db.get().query('SELECT cell.floorID, cell.longitude, cell.latitude FROM cell '
			+ 'LEFT JOIN node ON cell.cellID = node.cellID WHERE node.nodeID = ?', nodeID, function (err, rows) {
				if (err) reject(err);
				else resolve(rows);
			});
	});
}
