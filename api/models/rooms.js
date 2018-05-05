var db = require('../../db.js');

exports.getAll = function () {
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT roomName, isPopular FROM room', function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

exports.getAllStartingWith = function (roomID) {
    return new Promise(function (resolve, reject) {
        db.get().query("SELECT roomName FROM room WHERE roomNumber LIKE ?", roomID + '%', function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

exports.getNodeIDByRoomID = function (roomID) {
    return new Promise(function (resolve, reject) {
        db.get().query("SELECT nodeID FROM room WHERE roomNumber = ?", roomID, function (err, rows) {
            if (err) reject(err);
            else if (rows[0]){
                resolve(rows[0].nodeID);
            } else {
                reject("Room "+roomID+" does not exist");
            }
        });
    });
}
