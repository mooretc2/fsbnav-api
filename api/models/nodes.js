var db = require('../../db.js');

exports.getAllNodeIDs = function (done) {
    db.get().query('SELECT nodeID FROM node', function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

exports.getNumNodes = function () {
    db.get().query('SELECT COUNT(nodeID) FROM node', function (err, rows) {
        if (err) return err;
        return rows[0]["COUNT(nodeID)"];
    });
}
