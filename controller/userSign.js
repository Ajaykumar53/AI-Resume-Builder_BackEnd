
const signInUser_Model = require('../models/userSignIn-Model')
const User = require('../models/userSignUp-Model')

exports.userSignUp = async (req, res, next) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    // Validate input
    if (!userName || !userEmail || !userPassword) {
      return res.status(400).json({ message: 'All fields (userName, userEmail, userPassword) are required' });
    }

    // Create new user
    const user = new User({ userName, userEmail, userPassword });

    // Save user to database
    await user.save();

    // Success response
    return res.status(201).json({ message: 'User signed up successfully' });
  } catch (err) {
    console.error('Error in userSignUp:', err.message);

    // Handle duplicate key error (E11000)
    if (err.code === 11000 && err.keyPattern.userEmail) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Handle other errors (e.g., validation errors)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }

    // Generic server error
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.userSignIn = async (req,res,next) => {
  const {userEmail,userPassword} = req.body
  console.log("user SignIn")
  const user = await signInUser_Model(userEmail, userPassword)
  if(user === "no user found") {
    return res.status(401).send("User not found")
  }else if(user === "credentials are not matching"){
    return res.status(401).send("Credentials are not matching")
  }
res.cookie("token", user, {
  httpOnly: true,
  secure: true,       
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
});
res.send(user)
}



exports.userSignOut = (req, res, next) => {
  res.clearCookie('token')
  res.status(200).send('Cookie cleared and user logged out.');
};
