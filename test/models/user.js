var utils   = require('../utils');
var should  = require('should');
var User    = require('../../app/models/user')

describe('User model', function() {  
  it('should be able to create a new user', function(done) {
    var user = new User({username: "Dom", password: "password"});
    User.create(user, function (err, createdUser) {
      should.not.exist(err);
      createdUser.username.should.equal('Dom');
      done();
    });
  });

  it("should not store the password in plain text", function(done) {
    var user = new User({username: "Dom", password: "password"});
    User.create(user, function (err, createdUser) {
      should.not.exist(err);
      createdUser.password.should.not.equal('password');
      done();
    });
  })

  it("should verify the password correctly", function(done) {
    var user = new User({username: "Dom", password: "password"});
    User.create(user, function (err, createdUser) {
      createdUser.validPassword("password", function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.be.true;
        done();
      });
    });
  });
});