const jwt = require('jsonwebtoken')
require('dotenv').config()

const SECRET="3e5fe2b13dd2b4ecb9e2d8945a3fc1842a635b7e2398136d5151eac54aefc6f9"

exports.setUserCookie = (user) =>{
  return jwt.sign(
    {
      userName: user.userName,
      userId: user._id
    },SECRET,  { expiresIn: '1d' })
}
exports.GetUserCookie = (token) =>{
  if(!token) return null
  const data = jwt.verify(token,SECRET)
  return data
}

exports.authenticateUser = (req, res, next) => {

   const token = req.cookies.token; 
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, SECRET); 
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};