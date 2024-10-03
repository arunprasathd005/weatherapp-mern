const User = require("../models/user");  // Ensure this imports your User model correctly
const bcrypt = require("bcrypt");

async function createUser(userData) {
    const { name, email, password } = userData;
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the hashed password
    const newUser = new User({
        name,
        email,
        password: hashPassword, // Correct property name
        role: "customer",
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Return the saved user object
    return { user: savedUser, message: "User created successfully" };
}

module.exports = { createUser };
