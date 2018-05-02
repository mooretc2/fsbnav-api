var db = require('../../db.js');

exports.getAll = function (done) {
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT roomName, isPopular FROM room', function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

exports.getAllStartingWith = function (roomID, done) {
    return new Promise(function (resolve, reject) {
        db.get().query("SELECT roomName FROM room WHERE roomNumber LIKE ?", roomID + '%', function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

exports.getNodeIDByRoomID = function (roomID, done) {
    return new Promise(function (resolve, reject) {
        db.get().query("SELECT nodeID FROM room WHERE roomID = ?", roomID, function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}
