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
  
  describe('Logging in as a user', function() {

    beforeEach(function (done) {
      var user = new User({ email: 'dom@gmail.com', password: 'dom', firstname: "Dominic", lastname: "Bou-Samra"});
      user.save(function(err, user){
        done();
      })

    });

    it('should return an access token when user provides correct details', function(done) {
      var userDetails = { email: "dom@gmail.com", password: "dom" }
      request(app)
      .post('/user/login')
      .send(userDetails)
      .expect(200)
      .end(function(error, res) {
        should.not.exist(error);
        should.exist(res.body.access_token)
        done();
      });
    })

    it('should return an error message and a 401 unauthorized code, when a user provides incorrect password', function(done) {
      var userDetails = { email: "dom@gmail.com", password: "invalidpassword" }
      request(app)
      .post('/user/login')
      .send(userDetails)
      .expect(401)
      .expect(function(error) {
        error.text.should.match(/Incorrect password/)
      })
      .end(done)
    })

    it('should return an error message and a 401 unauthorized code, when a user provides incorrect email', function(done) {
      var userDetails = { email: "incorrect@gmail.com", password: "dom" }
      request(app)
      .post('/user/login')
      .send(userDetails)
      .expect(401)
      .expect(function(error) {
        error.text.should.match(/Incorrect email/)
      })
      .end(done)
    })

    it('should return an error message and a 401 unauthorized code, when a user doesnt provide any password', function(done) {
      var userDetails = { email: "dom@gmail.com" }
      request(app)
      .post('/user/login')
      .send(userDetails)
      .expect(401)
      .expect(function(error) {
        error.text.should.match(/Missing credentials/)
      })
      .end(done)
    })

    it('should return an error message and a 401 unauthorized code, when a user doesnt provide any email', function(done) {
      var userDetails = { password: "dom" }
      request(app)
      .post('/user/login')
      .send(userDetails)
      .expect(401)
      .expect(function(error) {
        error.text.should.match(/Missing credentials/)
      })
      .end(done)
    })
  })
  
});