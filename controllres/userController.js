const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res, next) => {
  try {
    const { f_name, l_name, email, password } = req.body;
    console.log("first");
    if (!f_name || !l_name || !email || !password) {
      return next({ statusCode: 400, message: "All fields are required" });
    }
    console.log("checking existing user");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next({ statusCode: 400, message: "Email already in use" });
    }
    console.log("user check done");
    const newUser = await User.create({ email, password, f_name, l_name });
    console.log({ newUser });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User created", userData: newUser, token });
  } catch (err) {
    console.log(err); // Pass errors to middleware
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .cookie("token", token, { httpOnly: true })
    .json({ message: "Login successful", token });
};

module.exports = {
  userRegister,
  userLogin,
};
