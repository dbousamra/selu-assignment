var express  = require('express');
var passport = require('passport')
var jwt      = require('jwt-simple');
var User     = require('../models/user')
var router   = express.Router();


router.put('/user', passport.authenticate('bearer', { session: false }), function(req, res, next){
  next();
})

router.post('/user/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    // throw an invalid credentials code
    if (info) { res.status(401); res.send(info) }
    // throw an internal server error code
    if (!user) { return next(user) }
    //user has authenticated correctly thus we create a JWT token from user's email
    var token = jwt.encode({ email: user.email }, passport.tokenSecret);
    res.json({ access_token : token });
  })(req, res, next);
})

// create a user
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