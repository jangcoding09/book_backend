const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  verifyEmail,
  getUser,
  logout,
  getAccessToken,
} = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.get("/me", authenticate, getUser);
router.post("/logout", authenticate, logout);
router.post("/token", getAccessToken);
module.exports = router;
