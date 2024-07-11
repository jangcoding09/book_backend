const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) {
      console.log("User not found");
      return res.sendStatus(403);
    }
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    console.error("Error during token verification:", error);
    res.sendStatus(403);
  }
};

module.exports = authenticate;
