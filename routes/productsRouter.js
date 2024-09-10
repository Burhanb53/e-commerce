const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model.js");
const multer = require("multer");

// Set up memory storage using Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to create a new product (uploads image and product details)
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    // Create a new product with the image stored in memory as a buffer
    const newProduct = new productModel({
      image: req.file.buffer, // Storing image in memory
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount || 0,
      bgcolor: req.body.bgcolor || "#ffffff",
      panelcolor: req.body.panelcolor || "#333333",
      textcolor: req.body.textcolor || "#ffffff",
    });

    await newProduct.save(); // Save the product to MongoDB

    // Flash a success message and redirect to the create products page
    req.flash("success", "Product uploaded successfully");
    res.redirect("/owners/createproducts"); // Redirect to prevent resubmission
  } catch (error) {
    req.flash("success", "Failed to create product");
    res.redirect("/owners/createproducts"); // Redirect to the form even if there's an error
  }
});

// Route to access the product image by its ID
router.get("/:id/image", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id); // Change `Product` to `productModel`

    if (!product || !product.image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Set the content type (e.g., image/jpeg) and return the image buffer
    res.set("Content-Type", "image/jpeg"); // Adjust content type if necessary
    res.send(product.image); // Send the image buffer to the client
  } catch (error) {
    res.status(500).json({ message: "Error fetching image", error });
  }
});

module.exports = router;
