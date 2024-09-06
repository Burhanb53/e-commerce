const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  image: String,
  name: String,
  price: Number,
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

module.exports = mongoose.model("product", productSchema);
