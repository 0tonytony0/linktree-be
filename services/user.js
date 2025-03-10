const User = require("../models/User");

// 🔹 Find user by ID
const findUserById = async (userId) => {
  return await User.findById(userId).select("-password");
};

// 🔹 Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// 🔹 Create a new user
const createUser = async (userData) => {
  return await User.create(userData);
};

// 🔹 Update user details
const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

// 🔹 Delete user
const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
