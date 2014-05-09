var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
// var User          = require('../app/models/user');

passport.dom = "Dominic";

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
  done();
});

module.exports = passport;