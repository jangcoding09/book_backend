const express = require("express");
const router = express.Router();
const { getCount } = require("../controllers/statisticController");

router.get("/count", getCount);

module.exports = router;
