'use strict';
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  win = require('winston'),
  db = require('./db'),
  port = process.env.PORT || 3000;

app.use(bodyParser.json());
require('./api/routes/routes')(app);

db.connect(db.MODE_PRODUCTION, function (err) {
  if (err) {
    console.log('Unable to connect to MySQL.');
    process.exit(1);
  } else {
    app.listen(3000, function () {
      console.log('Listening on port 3000...');
    });
  }
});
