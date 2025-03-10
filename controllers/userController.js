const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sentResetMail } = require("../services/mail");
const { comparePassword } = require("../utils/utils");
const { generateToken } = require("../services/auth");

// Register a new user
const userRegister = async (req, res, next) => {
  try {
    const { f_name, l_name, email, password, username } = req.body;
    console.log("first");
    if (!f_name || !l_name || !email || !password) {
      return next({ statusCode: 400, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next({ statusCode: 400, message: "Email already in use" });
    }
    console.log("user check done");
    const newUser = await User.create({
      email,
      password,
      f_name,
      l_name,
      username,
    });
    console.log({ newUser });
    const token = generateToken(newUser._id);

    res.status(201).json({ message: "User created", userData: newUser, token });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Error", error: err });
  }
};

// Log in a user (using email)
const userLogin = async (req, res) => {
  try {
    console.log("inside login api");
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    console.log("comparing password");

    const token = generateToken(user._id);
    const userWithoutPassword = { ...user, password };
    console.log("password comparison done");
    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Login successful", user: userWithoutPassword, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an existing user
const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const { f_name, l_name, email, password, confirmPassword } = req.body;

    // If password is provided, ensure confirmPassword matches
    if (password && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Prepare the update object
    const updateFields = { f_name, l_name, email };

    // If password is provided, hash it and add to updateFields
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    // Assuming user id is passed as a URL parameter (req.params.id)

    console.log({ updateFields });
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;
    // 1. Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 2. Find the user associated with the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Hash the new password
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);
    user.password = password;

    // 4. Save the updated password
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Send email
    console.log("calling sentResetmail");
    await sentResetMail(email, token);

    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("erorr in forgot password", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  updateUser,
  forgotPassword,
  resetPassword,
};
