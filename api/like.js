require("dotenv").config();
const express = require("express");
const {
  addLike,
  getBookLike,
  removeLike,
} = require("../controllers/likeController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:bookId/:id", async (req, res) => {
  await getBookLike(req, res);
});

router.patch("/add/:bookId/:id", authenticate, async (req, res) => {
  await addLike(req, res);
});

router.patch("/remove/:bookId/:id", authenticate, async (req, res) => {
  await removeLike(req, res);
});

module.exports = router;
