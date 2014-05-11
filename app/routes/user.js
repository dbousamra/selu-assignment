var express = require('express');
var passport = require('passport');
var router  = express.Router();

var isLoggedIn = function(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.send("Not verified");
}

router.get('/user', function(req, res) {
  res.send("User root");
});

router.post('/user', passport.authenticate('local-signup', {
  successRedirect : '/user',
  failureRedirect : '/',
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/user',
  failureRedirect : '/'
}));

router.get('/user/profile', isLoggedIn,  function(req, res) {
  res.send("Verified");
});

module.exports = router;

