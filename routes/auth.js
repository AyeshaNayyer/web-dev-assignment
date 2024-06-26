const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');


router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName , role} = req.body;
    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      throw new Error("Password must be at least 8 characters long and include both numbers and alphabets.");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Invalid email format.");
    }
    if (firstName.length < 3) {
      throw new Error("First name must be at least 3 characters long.");
    }
    if (lastName.length < 3) {
      throw new Error("Last name must be at least 3 characters long.");
    }
    let user = await Users.findOne({ email });
    if (user) return res.json({ msg: "USER EXISTS" });
    await Users.create({
      ...req.body,
      password: await bcrypt.hash(password, 5),
    });
    console.log("USER CREATED")
    return res.json({ msg: "CREATED" });
  
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.json({ msg: "USER NOT FOUND" });
      // Check password
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) return res.json({ msg: "WRONG PASSWORD" });
      const token = jwt.sign(
          {
              id: user._id,
              email,
              role: user.role
          },
          "MY_SECRET",
          { expiresIn: "1d" }
      );
      console.log("LOGGED IN")
      res.json({
          msg: "LOGGED IN",
          token,
          user: {
              id: user._id,
              email: user.email,
              role: user.role
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
  }
});



function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}


module.exports = router;
