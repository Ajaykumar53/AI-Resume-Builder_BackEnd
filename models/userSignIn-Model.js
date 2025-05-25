const bcrypt = require('bcryptjs');
const {setUserToken, setUserCookie} = require('../Middleware/userAuthentication')
const User = require('../models/userSignUp-Model');


async function signInUser_Model(userEmail, userPassword) {
  try {
    const user = await User.findOne({ userEmail });


    if (!user) {
      return "no user found";
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);

    if (!isMatch) {
      return "credentials are not matching";
    }

    const session = setUserCookie(user);
    return session;

  } catch (error) {
    return "internal server error";
  }
}

module.exports = signInUser_Model;
