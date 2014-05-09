var utils   = require('../utils');
var request = require('supertest');
var should  = require('should');
var app     = require('../../server');

describe('Base API', function() {  
  describe('GET /', function() {
    it('should return the string hello world ', function(done) {
      request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        res.text.should.equal("Hello world");
        done();
      });
    });
  });
});