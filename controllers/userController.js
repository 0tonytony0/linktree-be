const User = require("../models/User");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sentResetMail } = require("../services/mail");
const { comparePassword } = require("../utils/utils");
const { generateToken } = require("../services/auth");
const apiResponse = require("../utils/apiResponse");
const catchAsyncErrors = require("../utils/catchAsyncErrors");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const userRegister = catchAsyncErrors(async (req, res, next) => {
  const { f_name, l_name, email, password, username, category } = req.body;

  if (!f_name || !email || !password) {
    return apiResponse(res, 400, false, "First name, email and password are required");
  }

  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });
  if (existingUser) {
    const field = existingUser.email === email ? "Email" : "Username";
    return apiResponse(res, 400, false, `${field} already in use`);
  }

  const newUser = await User.create({
    email,
    password,
    f_name,
    l_name,
    username,
    category,
  });

  // Automatically create a blank profile for the new user
  await Profile.create({
    user: newUser._id,
    title: username || f_name, // Default title as username or first name
    bio: "",
    links: [],
    shops: [],
    appreance: {
      layout: "stack",
      buttonStyle: "fill-square",
      buttonColor: "#28A263",
      buttonFontColor: "#ffffff",
      font: "Poppins",
      fontColor: "#000000",
      theme: "Air Snow",
      backgroundColor: "#ffffff",
    }
  });

  const newUserObj = newUser.toObject();
  const { password: _, __v, ...userWithoutPassword } = newUserObj;

  const token = generateToken(newUser._id);
  return apiResponse(res, 201, true, "User created successfully", { user: userWithoutPassword, token });
});

/**
 * @desc    Log in a user
 * @route   POST /api/auth/login
 * @access  Public
 */
const userLogin = catchAsyncErrors(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: username }, { username: username }]
  }).lean();

  if (!user || !(await comparePassword(password, user.password))) {
    return apiResponse(res, 400, false, "Invalid credentials");
  }

  const token = generateToken(user._id);
  const { password: _, ...userWithoutPassword } = user;

  return res
    .cookie("token", token, { httpOnly: true })
    .status(200)
    .json({
      success: true,
      message: "Login successful",
      data: { user: userWithoutPassword, token }
    });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update
 * @access  Private
 */
const updateUser = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  const { f_name, l_name, email, password, confirmPassword } = req.body;

  if (password && password !== confirmPassword) {
    return apiResponse(res, 400, false, "Passwords do not match");
  }

  const updateFields = { f_name, l_name, email };
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateFields.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedUser) {
    return apiResponse(res, 404, false, "User not found");
  }

  return apiResponse(res, 200, true, "User updated successfully", { user: updatedUser });
});

/**
 * @desc    Forgot Password - Send reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return apiResponse(res, 404, false, "User not found");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  await sentResetMail(email, token);
  return apiResponse(res, 200, true, "Password reset link sent to your email");
});

/**
 * @desc    Reset Password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = catchAsyncErrors(async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return apiResponse(res, 400, false, "Invalid or expired token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return apiResponse(res, 404, false, "User not found");
  }

  user.password = password;
  await user.save();

  return apiResponse(res, 200, true, "Password reset successfully");
});

module.exports = {
  userRegister,
  userLogin,
  updateUser,
  forgotPassword,
  resetPassword,
};
