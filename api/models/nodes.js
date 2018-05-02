var db = require('../../db.js');

exports.getAllNodeIDs = function () {
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT nodeID FROM node', function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

exports.getNumNodes = function () {
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT COUNT(nodeID) FROM node', function (err, rows) {
            if (err) reject(err);
            else resolve(rows[0]["COUNT(nodeID)"]);
        });
    });
}
