var utils   = require('../utils');
var should  = require('should');
var User    = require('../../app/models/user');

describe('User model', function() {  
  var user = new User({email: "dom@dom.com", password: "password", firstname: "Dominic", lastname: "Bou-Samra" });
  it('should be able to create a new user', function(done) {
    User.create(user, function (err, createdUser) {
      should.not.exist(err);
      createdUser.email.should.equal('dom@dom.com');
      done();
    });
  });

  it("should not store the password in plain text", function(done) {
    User.create(user, function (err, createdUser) {
      should.not.exist(err);
      createdUser.password.should.not.equal('password');
      done();
    });
  });

  it("should verify the password correctly", function(done) {
    User.create(user, function (err, createdUser) {
      createdUser.validPassword("password", function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.be.true;
        done();
      });
    });
  });
});