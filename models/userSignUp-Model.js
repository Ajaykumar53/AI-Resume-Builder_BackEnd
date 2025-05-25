const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


const userSignUpSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  userPassword: {
    type: String,
    required: true
  }
});


async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Then in pre save
userSignUpSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('userPassword') && !this.isNew) {
      return next();
    }

    this.userPassword = await hashPassword(this.userPassword);
    next();
    
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSignUpSchema);