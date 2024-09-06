const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");
mongoose.set("debug", true);

mongoose
  .connect(`${config.get("MONGODB_URI")}/e-commerce`)
  .then(function () {
    console.log("Connected to MongoDB");
  })
  .catch(function (err) {
    console.error("Error connecting to MongoDB", err);
  });

module.exports = mongoose.connection;
