console.log('Loading Server');
var fs = require('fs');
var express = require('express');

//modules below are express middleware
var bodyParser = require('body-parser');
var logger = require('morgan');
var compression = require('compression');
var favicon = require('serve-favicon');

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(bodyParser.json());

app.use(logger('dev'))

app.use(compression());

app.use(allowCrossDomain);

var apiPath = '/api/v1';
// mongo is primary, so publish it under 2 paths
// this way we can acces and demonstrate the different DAOs with Postman
var mongoDao = require('./DAO/mongoDao');
app.use(apiPath + '/', mongoDao);
app.use(apiPath + '/mongo', mongoDao);
app.use(apiPath + '/mysql', require('./DAO/mysqlDao'));


//traditional webserver stuff for serving static files
var WEB = __dirname + '/web';
app.use(favicon(WEB + '/favicon.ico'));
app.use(express.static(WEB, {maxAge: '12h'}));
app.get('*', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(404).sendFile(WEB + '/github404.png');
});

//var config = JSON.parse(fs.readFileSync("/dev/nodejs/resumeServer.json"));
var port = process.env.port || 8080;
var server = app.listen(port);

console.log(`Listening on port ${port}`);