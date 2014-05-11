var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var User = require('../app/models/user');

var signup = function (req, email, password, done) {
  User.findOne({ 'email' :  email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      console.log("User already exists")
      return done(null, false)
    } else {
      console.log("Creating new user")
      var newUser = new User({email: email, password: password, firstname: "Dominic", lastname: "Bou-Samra" });
      newUser.save(function(err) {
        if (err) {
          throw err;
        }
        return done(null, newUser);
      });
    }
  });
};

var login = function(req, email, password, done) {
  User.findOne({ 'email' :  email }, function(err, user) {
    if (err) {
      return done(err);
    }
    // if no user is found, return the message
    if (!user) {
      console.log("No user found")
      return done(null, false);
    }
    user.validPassword(password, function(err, isMatch) {
      if (!isMatch) {
        // if the user is found but the password is wrong
        console.log("Password doesn't match")
        return done(null, false);
      } else {
        console.log("Password matches")
        // user is found and password matches
        return done(null, user);
      }
    });
  });
};

var strategyOptions = {
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}

passport.use('local-signup', new LocalStrategy(strategyOptions, signup));
passport.use('local-login', new LocalStrategy(strategyOptions, login));
  
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;