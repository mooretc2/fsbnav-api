'use strict';

var env = process.env.NODE_ENV || 'dev';
var config = require('./${env}');

module.exports = config;
