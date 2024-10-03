const mongoose = require('mongoose');
const { Schema } = mongoose;  // Destructure Schema from mongoose

// Define the User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'customer'], // Allowed roles
    default: 'customer', // Default role
  },
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
