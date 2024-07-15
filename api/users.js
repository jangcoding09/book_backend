require("dotenv").config();
const express = require("express");
const { patchUser, getUsers } = require("../controllers/usersController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  await getUsers(req, res);
});

router.patch("/update", authenticate, async (req, res) => {
  await patchUser(req, res);
});

module.exports = router;
