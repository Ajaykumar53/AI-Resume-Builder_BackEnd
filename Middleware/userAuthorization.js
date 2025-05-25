const { GetUserCookie } = require("./userAuthentication");

exports.isUserAuthorized = (req, res) => {
  
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  const user = GetUserCookie(token);
  if (!user) {
    return res.status(401).send("Unauthorized");
  }
  res.status(200).json({ message: "Authorized", user }); // 👈 send user data
};


