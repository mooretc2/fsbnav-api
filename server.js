'use strict';
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),  
  fs = require('fs'),
  win = require('winston'),
  port = process.env.PORT || 3000;

app.use(bodyParser.json());
require('./api/routes/routes')(app);

app.listen(port);

console.log('fsbnav server started on port: ' + port);
