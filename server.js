'use strict';
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),  
  fs = require('fs'),
  win = require('winston'),
  port = process.env.PORT || 3000;

require('./api/routes/routes')(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
