var db = require('../../db.js');

exports.getAll = function (done) {
    db.get().query('SELECT roomName, isPopular FROM room', function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

exports.getAllStartingWith = function (roomID, done) {
    db.get().query("SELECT roomName FROM room WHERE roomNumber LIKE ?", roomID+'%', function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

exports.getNodeIDByRoomID = function (roomID, done) {
    db.get().query("SELECT nodeID FROM room WHERE roomID = ?", roomID, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}
