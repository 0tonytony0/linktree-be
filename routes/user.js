const express = require("express");
const User = require("../models/User");

const {
  userRegister,
  userLogin,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { updateUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Register New User
router.post("/register", userRegister);
router.post("/login", userLogin);
router.put("/", authMiddleware, updateUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// User Profile

module.exports = router;
