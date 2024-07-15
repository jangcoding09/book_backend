const express = require("express");
const {
  signup,
  login,
  verifyEmail,
  logout,
  getUser,
  getAccessToken,
} = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
  await signup(req, res);
});

router.post("/login", async (req, res) => {
  await login(req, res);
});

router.get("/verify-email", async (req, res) => {
  await verifyEmail(req, res);
});

router.post("/logout", authenticate, async (req, res) => {
  await logout(req, res);
});

router.get("/me", authenticate, async (req, res) => {
  await getUser(req, res);
});

router.post("/token", async (req, res) => {
  await getAccessToken(req, res);
});

module.exports = router;
