require("dotenv").config();
const express = require("express");
const {
  signup,
  login,
  verifyEmail,
  logout,
  getUser,
  getAccessToken,
} = require("../controllers/authController");
const { connectDB } = require("../config/db");
const authenticate = require("../middleware/authMiddleware");

const app = express();
app.use(express.json());

connectDB();

app.post("/api/auth/signup", async (req, res) => {
  await signup(req, res);
});

app.post("/api/auth/login", async (req, res) => {
  await login(req, res);
});

app.get("/api/auth/verify-email", async (req, res) => {
  await verifyEmail(req, res);
});

app.post("/api/auth/logout", authenticate, async (req, res) => {
  await logout(req, res);
});

app.get("/api/auth/me", authenticate, async (req, res) => {
  await getUser(req, res);
});

app.post("/api/auth/token", async (req, res) => {
  await getAccessToken(req, res);
});

module.exports = app;
