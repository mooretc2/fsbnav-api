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

exports.getAdjacentNode = function(nodeID, stairs, done) {
    db.get().query('(SELECT node1ID AS node FROM edge WHERE (node2ID = ? AND (transition = ? OR transition IS NULL))) UNION' +
        ' (SELECT node2ID AS node FROM edge WHERE (node1ID = ? AND (transition = ? OR transition IS NULL)))', [nodeID, stairs, nodeID, stairs], function (err, rows) {
            if (err) return done(err);
            else {
                var data = [];
                for (x in rows){
                    data.push(rows[x].node);
                }
                done(null, data);
            }
    });
}
