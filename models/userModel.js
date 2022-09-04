
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const UserAccount = mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

UserAccount.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model('UserAccount', UserAccount);