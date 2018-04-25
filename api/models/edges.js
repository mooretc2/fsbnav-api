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
