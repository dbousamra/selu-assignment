var passport       = require('passport');
var User           = require('../app/models/user');
var jwt            = require('jwt-simple');
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalStrategy  = require('passport-local').Strategy;

passport.tokenSecret = "selu"

var strategyOptions = {
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : false
}

passport.use('local', new LocalStrategy(
  strategyOptions, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
      if (err) { 
        return done(err); 
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      user.validPassword(password, function(err, isMatch) {
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        } else {
          return done(null, user);
        }
      });
    });
  }
));

module.exports = passport;
