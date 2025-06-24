const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // ✅ Add this field for vault passphrase check
  vaultValidation: {
    type: String,
    default: null,  // not set initially
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
