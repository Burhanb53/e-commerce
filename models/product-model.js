const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image: {
    type: Buffer, // Store image as binary data (Buffer)
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  bgcolor: {
    type: String,
    default: "#ffffff",
  },
  panelcolor: {
    type: String,
    default: "#333333",
  },
  textcolor: {
    type: String,
    default: "#ffffff",
  },
});

module.exports = mongoose.model("Product", productSchema);
