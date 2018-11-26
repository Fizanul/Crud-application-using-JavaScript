var express = require('express');

var app = module.exports = express(); //now app.js can be required to bring app into any file

// Server Config
var port = 3000;

// Server DocumentRoot
app.use(express.static(__dirname = 'public'));

// Program
var program = require('./app.js');

// Listen port and Start server
app.listen(port);
console.log('Server running at ' + port);
