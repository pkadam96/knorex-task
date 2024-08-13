const express = require("express");
const { userModel } = require("../models/userSchema");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { email, first_name, last_name, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: true, message: "Passwords do not match" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: true, message: "Email is already registered" });
    }

    const newUser = new userModel({ email, first_name, last_name, password });
    await newUser.save();

    return res.status(201).json({ error: false, message: "User registered successfully", user: newUser });

  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: error.message });
  }
});

userRouter.get("/users", async (req, res) => {
  try {
    const users = await userModel.find(); // Retrieve all users
    return res.status(200).json({ error: false, users });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

userRouter.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    return res.status(200).json({ error: false, message: "User deleted successfully" });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

module.exports = { userRouter };
