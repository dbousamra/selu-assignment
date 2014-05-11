var express      = require('express');
var session      = require('express-session');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var path         = require('path');
var logger       = require('morgan');
var mongoose     = require('mongoose');

var passport     = require('./config/passport')
var config       = require('./config/db')
var base         = require('./app/routes/base');
var user         = require('./app/routes/user');
var app          = express();

app.set('dbUrl', config.db[app.settings.env]);
mongoose.connect(app.get('dbUrl'));

app.use(logger('short'));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded());

// required for passport
app.use(cookieParser());
app.use(session({ secret: 'dbousamra' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(express.static(path.join(__dirname, 'public')));

app.use(base);
app.use(user);

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

// listen (start app with node server.js) 
var port = process.env.PORT || 8080
app.listen(port);
console.log("App listening on port " + port);

module.exports = app;
