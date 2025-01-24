const express = require("express");
const { getCategories } = require("../controllers/categoryController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getCategories);

module.exports = router;
