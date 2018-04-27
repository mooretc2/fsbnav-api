var db = require('../../db.js');

exports.getAllNodeIDs = function (done) {
    db.get().query('SELECT nodeID FROM node', function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

exports.getNumNodes = function (done) {
    db.get().query('SELECT COUNT(nodeID) FROM node', function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

exports.getCellByNodeID = function (nodeID, done){
    db.get().query('SELECT cell.floorID, cell.longitude, cell.latitude FROM cell '
            + 'LEFT JOIN node ON cell.cellID = node.cellID WHERE node.nodeID = ?', nodeID, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}