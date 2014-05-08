var express     = require('express');
var path        = require('path');
var logger      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');

var config      = require('./config')
var app         = express();

app.set('dbUrl', config.db[app.settings.env]);
mongoose.connect(app.get('dbUrl'));


app.use(logger('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.send('hello world');
});

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// listen (start app with node server.js) 
app.listen(8080);
console.log("App listening on port 8080");

module.exports = app;
