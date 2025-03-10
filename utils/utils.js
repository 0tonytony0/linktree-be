const bcrypt = require("bcryptjs");

const comparePassword = async function (enteredPassword, oldPassword) {
  console.log({ enteredPassword, oldPassword });
  return await bcrypt.compare(enteredPassword, oldPassword);
};

module.exports = { comparePassword };
