const express = require("express");
const {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:bookId", async (req, res) => {
  await getComments(req, res);
});

router.post("/:bookId", authenticate, async (req, res) => {
  await addComment(req, res);
});

router.patch("/:bookId/:commentId", authenticate, async (req, res) => {
  await updateComment(req, res);
});

router.delete("/:bookId/:commentId", authenticate, async (req, res) => {
  await deleteComment(req, res);
});

module.exports = router;
