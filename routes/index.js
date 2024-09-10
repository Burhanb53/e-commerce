const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

// Home route
router.get("/", (req, res) => {
  let error = req.flash("error");
  res.render("index", { error });
});

// Shop route - Fetch products and display them
router.get("/shop", async (req, res) => {
  try {
    const products = await productModel.find();
    res.render("shop", { products });
  } catch (error) {
    req.flash("error", "Failed to load products");
    res.redirect("/");
  }
});

// Add to Cart Route - Extract token from cookies
router.get("/add-to-cart/:productId", async (req, res) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token; // Assuming the token is stored as 'token' in cookies
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is required" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, "bohra");
    const userId = decoded.id; // Extract user ID from the decoded token
    const productId = req.params.productId;

    // Find the user and add the product ID to their cart
    await User.findByIdAndUpdate(userId, {
      $addToSet: { cart: productId }, // Add product ID to the cart array without duplicates
    });

    // Redirect to the cart page after adding the product
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
});
// Cart route - Display user's cart
router.get("/cart", async (req, res) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is required" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, "bohra");
    const userId = decoded.id; // Extract user ID from the decoded token

    // Fetch the user by ID
    const user = await User.findById(userId);

    // Check if the user's cart is empty
    if (!user.cart || user.cart.length === 0) {
      return res.render("cart", {
        cartItems: [],
        message: "Your cart is empty",
      });
    }

    // Fetch products from the cart (using the product IDs stored in user's cart array)
    const cartProducts = await productModel.find({ _id: { $in: user.cart } });

    // Render the cart page and pass the cart items
    res.render("cart", { cartProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load cart items" });
  }
});
module.exports = router;
