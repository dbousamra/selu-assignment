var express      = require('express');
var bodyParser   = require('body-parser');
var path         = require('path');
var logger       = require('morgan');
var mongoose     = require('mongoose');

var passport     = require('./config/passport');
var config       = require('./config/db');
var user         = require('./app/routes/user');
var app          = express();

app.set('dbUrl', config.db[app.settings.env]);
mongoose.connect(app.get('dbUrl'));

if ("test" !== app.settings.env) {
  app.use(logger('short'));
}
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded());

// required for passport
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

app.use(user);

app.use(function(req, res, next){
    res.status(404);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.send({ error: err.message });
    return;
});

// listen (start app with node server.js) 
var port = process.env.PORT || 8080;
app.listen(port);
console.log("App listening on port " + port);

module.exports = app;
