const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model.js");

router.get("/", (req, res) => {
  res.send("Owner");
});

router.post("/create", async (req, res) => {
  try {
    // Check if an owner already exists
    const existingOwner = await ownerModel.findOne();
    
    if (existingOwner) {
      return res.status(400).json({ message: "Owner already exists" });
    }
    const newOwner = new ownerModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await newOwner.save();
    return res.status(201).json(newOwner);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;
