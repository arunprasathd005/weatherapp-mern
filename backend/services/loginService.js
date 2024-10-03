const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateToken } = require("../utils/jwtUtils");

async function login(email, password) {
  try {
    // Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Validate the password, using await
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }
    // Log user object to check if _id is present
    console.log("User object:", existingUser);

    // Generate token after successful login
    const token = generateToken(existingUser);
    return token;
  } catch (error) {
    console.log("login error:", error.message);
    throw new Error("Invalid credentials");
  }
}

module.exports = { login };
