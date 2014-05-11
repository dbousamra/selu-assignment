var express  = require('express');
var passport = require('passport');
var User     = require('../models/user')
var router   = express.Router();

// var isLoggedIn = function(req, res, next) {
//   // if user is authenticated in the session, carry on 
//   if (req.isAuthenticated())
//     return next();
//   // if they aren't redirect them to the home page
//   res.send("Not verified");
// }

// router.post('/user', passport.authenticate('local-signup', {
//   successRedirect : '/user',
//   failureRedirect : '/',
// }));

// router.post('/login', passport.authenticate('local-login', {
//   successRedirect : '/user',
//   failureRedirect : '/'
// }));

// router.get('/user/profile', isLoggedIn,  function(req, res) {
//   res.send("Verified");
// });


router.post('/user', function(req, res) {
  var user = new User(req.body);
  User.findOne({ email: req.body.email }, function(error, foundUser) {
    if(foundUser) {
      res.send("Error: User with email " + foundUser.email + " already exists.", 409);
    } else {
      User.create(user, function(err, createdUser) {
        if (err) {
          res.send(err, 400);
        } else {
          res.json({ id: createdUser.id }, 201);
        }
      })    
    }
  });  
})


module.exports = router;

