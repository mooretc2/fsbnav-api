var db = require('../../db.js');

exports.getAll = function (done) {
    db.get().query('SELECT * FROM room', function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

exports.getAllStartingWith = function (roomID, done) {
    db.get().query("SELECT * FROM room WHERE roomID LIKE '?%'", roomID, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}