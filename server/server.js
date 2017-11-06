var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var config = require('./config');
var dbHelper = require('./utils/dbHelper');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://10.1.222.76');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});




http.createServer(app).listen(config.httpPort, config.httpHost);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/api/job', require('./api/job'));
app.use('/api/testcase', require('./api/testcase'));
app.use('/api/vm', require('./api/vm'));
console.log("Server started at " +config.httpPort);

dbHelper.resetVMTable();
dbHelper.resetExpiredVMs();
dbHelper.resetTestCaseTable();
