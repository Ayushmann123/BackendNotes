const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
// const `${process.env.JWT_SECRET}` = "ShriRamJankiBaithehaimereSeeneme";
var fetchUser = require('../middleware/fetchUser')
require("dotenv").config();
// Create a USer POst, NO LOGIN REQUIRED HERE

// ROUTE 1 CREATE A USER
router.post(
  "/createUser",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid e-mail").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
   let success =false


    //If there are errors return bad request and error

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      // check if already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry a user with same email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //CREATE USER FOR THE FIRST TIME
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const Data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(Data, `${process.env.JWT_SECRET}`); // , token me id bhej di+`${process.env.JWT_SECRET}`
      console.log(req.body);

      console.log(authToken);
      success = true
      res.json({success,authToken});
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some Error Occured");
    }
  }
);

// ROUTE 2
//AUTHENTICATE A USER , NO LOGIN REQUIRED
router.post(
  "/loginUser",
  [
    body("email", "Enter a valid e-mail").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        success =false
        return res
          .status(400)
          .json({ errors: "try to login with different credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, errors: "try to login with different credentials" });
      }
      const data = {
        user: {
          id: user._id,
        },
      };

      const authToken = jwt.sign(data, `${process.env.JWT_SECRET}`);
      success =true
      res.json({success, authToken });


    } catch (error) {
      console.log(error.message);
      res.status(500).send(" Internal server Error Occured");
    }
  }
);

// ROUTE 3 : GET LOGGED IN USER DETAILS
router.post(
  "/getUser", fetchUser,
  
  async (req, res) => {
    try {
        userId = req.user.id
        // console.log(userId)
      const user = await User.findById(userId).select("-password");
      res.send(user)
    } catch (error) {
      console.log(error.message);
      res.status(500).send(" Internal server Error Occured");
    } 
  }
);
module.exports = router;
