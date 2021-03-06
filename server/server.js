// Dependencies
var express = require('express'),
    bodyParser = require('body-parser'),
    nodemon = require('nodemon'),
    path = require('path'),
    config = require('./config/main'),
    logger = require('morgan');

// App
var app = new express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.query());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS from client-side
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Routes
app.use('/api', require('./routes/api'));
app.use('*', function(req, res) {
    res.sendFile( __dirname + '/public/dist/index.html');
});

// Start server
app.listen(config.port);
console.log('App Started on Port ' + config.port);

// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan
