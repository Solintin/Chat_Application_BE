const e = require("express");
const express = require("express");
const User = require("../Models/user");
const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const user = await new User(req.body);
    await user.save();
    res
      .status(201)
      .json({ status: 201, message: "User created successfully", user: user });
  } catch (error) {
    console.log(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: 400,
      message: "Invalid Credentials",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(400).json({
      status: 400,
      message: "Invalid Credentials",
    });
  }
  res.status(200).json({
    status: 201,
    message: "User retrived successfully",
    user: user,
  });
});

module.exports = router;
