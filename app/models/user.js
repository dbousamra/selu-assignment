var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

var userSchema = mongoose.Schema({
  email:     { type: String, required: true, index: { unique: true } },
  password:  { type: String, required: true },
  firstname: { type: String, required: true },
  lastname:  { type: String, required: true }
});

userSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(this.password, bcrypt.genSaltSync(8),function(err, hash){
    user.password = hash;
    next();
  });
});

userSchema.methods.validPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);