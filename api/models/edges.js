var db = require('../../db.js');

exports.getAll = function (done) {
    db.get().query('SELECT * FROM edge', function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

exports.getNumEdges = function (done) {
    db.get().query('SELECT COUNT(edgeID) FROM edge', function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

exports.getAdjacentNode = function(nodeID, edgeID, stairs, done) {
    db.get().query('SELECT node1ID, node2ID, transition FROM edge WHERE edgeID = ?', edgeID, function (err, rows) {
        if (err) return done(err);
        if (rows[0].transition != 'NULL' && rows[0].transition != stairs){
            done(null, null);
        } else if (rows[0].node1ID == nodeID){
            done(null, rows[0].node2ID);
        } else if (rows[0].node2ID == nodeID){
            done(null, rows[0].node1ID);
        }
    });
}
