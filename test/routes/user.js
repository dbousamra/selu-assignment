var utils   = require('../utils');
var app     = require('../../server');
var request = require('supertest');
var should  = require('should');
var User    = require('../../app/models/user')

describe('User API', function() {  
  describe('Creating a new user /', function() {
    
    it('should return the new users ID', function(done) {
      var user = { email: 'dom@gmail.com', password: 'dom', firstname: "Dominic", lastname: "Bou-Samra"};
      request(app)
      .post('/user')
      .send(user)
      .expect(201)
      .end(function(error, res) {
        should.not.exist(error);
        User.findOne({ 'email' :  'dom@gmail.com' }, function(err, user) {
          res.body.id.should.equal(user.id);
          done();
        });
      });
    });

    it('should not allow creating a user with an email of a user who already exists', function(done) {
      var existingUser = new User({ email: 'existing@gmail.com', password: 'existing', firstname: "Already", lastname: "Existing"});
      existingUser.save(function(err, user) {
        var user = { email: 'existing@gmail.com', password: 'dom', firstname: "Dominic", lastname: "Bou-Samra"};
        request(app)
        .post('/user')
        .send(user)
        .expect(409)
        .expect(function(err) {
          err.text.should.match(/exists/)
        })
        .end(done);
      });  
    });
  });

  it('should return an error when user created without first name', function(done) {
    var user = { email: 'dom@gmail.com', password: 'dom', lastname: "Bou-Samra"};
    request(app)
    .post('/user')
    .send(user)
    .expect(400)
    .expect(function(err) {
      err.text.should.match(/firstname` is required/)
    })
    .end(done)
  });

  it('should return an error when user created without last name', function(done) {
    var user = { email: 'dom@gmail.com', password: 'dom', firstname: "Dominic"};
    request(app)
    .post('/user')
    .send(user)
    .expect(400)
    .expect(function(err) {
      err.text.should.match(/lastname` is required/)
    })
    .end(done)
  });
});