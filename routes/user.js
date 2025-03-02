const express = require("express");
const User = require("../models/User");

const { userRegister, userLogin } = require("../controllres/userController");

const router = express.Router();

// 🔹 Register New User
router.post("/register", userRegister);
router.post("/login", userLogin);


// User Profile 

module.exports = router;
