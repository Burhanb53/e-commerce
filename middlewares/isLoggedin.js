const userModel = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "you need to loggin first");
    return res.redirect("/");
  }
  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    const user = await userModel
      .findOne({
        email: decoded.email,
        id: decoded.id,
      })
      .select("-password");
    req.user = user;
    next();
  } catch (error) {
    req.flash("error", "Something went wrong");
    return res.redirect("/");
  }
};
