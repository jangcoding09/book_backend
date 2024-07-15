const express = require("express");
const {
  deletebook,
  getbook,
  getbooks,
  incrementClicks,
  patchbook,
  postbook,
} = require("../controllers/bookController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", async (req, res) => {
  await getbook(req, res);
});

router.get("/", async (req, res) => {
  await getbooks(req, res);
});

router.post("/", authenticate, async (req, res) => {
  await postbook(req, res);
});

router.delete("/:id", authenticate, async (req, res) => {
  await deletebook(req, res);
});

router.patch("/:id", authenticate, async (req, res) => {
  await patchbook(req, res);
});

router.patch("/increment-clicks/:id", authenticate, async (req, res) => {
  await incrementClicks(req, res);
});

module.exports = router;
