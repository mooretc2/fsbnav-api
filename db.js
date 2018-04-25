var mysql = require('mysql'),
	async = require('async'),
	config = require('./config');

var state = {
  pool: null,
  mode: null,
};

exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: config.config.host,
    user: config.config.user,
    password: config.config.password,
    database: config.config.database
  });

  state.mode = mode;
  done();
};

exports.get = function() {
  return state.pool;
};
