const jwt = require("jsonwebtoken");

const generateToken = async (user, expiresIn = "1h") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = generateToken;
