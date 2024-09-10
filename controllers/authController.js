const userModel = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken.js");

// Register User Function
module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, name, contact, picture } = req.body;

    // Basic validation for required fields
    if (!name || !email || !password) {
      req.flash("error", "All fields should be filled");
      return res.redirect("/");
    }

    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists");
      return res.redirect("/");
    }

    // Hash the password and save the user
    const salt = await bcrypt.genSalt(10); // Use await for bcrypt.genSalt
    const hashedPassword = await bcrypt.hash(password, salt); // Use await for bcrypt.hash

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      contact: contact || null,
      picture: picture || null,
      cart: [],
      orders: [],
    });

    await user.save(); // Save the user to the database

    // Set cookie using JWT
    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });

    // Redirect to shop after successful registration
    req.flash("success", "User created successfully");
    return res.redirect("/shop");
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: error.message });
  }
};

// Login User Function
module.exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Email or Password incorrect");
      return res.redirect("/");
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Email or Password incorrect");
      return res.redirect("/");
    }

    // Set cookie using JWT
    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });

    // Redirect to shop after successful login
    req.flash("success", "Login successful");
    return res.redirect("/shop");
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: error.message });
  }
};

module.exports.logoutUser = async function (req, res) {
  try {
    res.clearCookie("token"); // Clear the cookie
    req.flash("error", "Logout successful");
    return res.redirect("/");
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: error.message });
  }
};
