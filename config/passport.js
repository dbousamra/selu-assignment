var passport       = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalStrategy  = require('passport-local').Strategy;
var jwt            = require('jwt-simple');
var User           = require('../app/models/user');

passport.tokenSecret = "selu";
passport.ensureAuthenticated = passport.authenticate('bearer', { session: false });

var strategyOptions = {
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : false
};

passport.use('local', new LocalStrategy(
  strategyOptions, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Incorrect email.' }); }
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

passport.use('bearer', new BearerStrategy(
  function(token, done) {
    try {
      var decoded = jwt.decode(token, passport.tokenSecret);
      User.findOne({ email: decoded.email }, function(err, user) {
        if (err){
          return done(err);
        } else if (!user) {
          return done(null, false, { message: 'No user with email: ' + decoded.email + ' found.'});
        } else {
          return done(null, user);
        }
      });
    } catch(decodeError) {
      return done(null, false, { message: 'Unable to decode token'});
    }
  }
));

module.exports = passport;