/** @format */

import connectDb from "../../lib/mongodb";
import User from "../../models/User";
var bcrypt = require("bcryptjs");
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const keywords = req.query.search
        ? {
            $or: [
              { name: { $regex: req.query.search, $options: "i" } },
              { email: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};

      const users = await User.find(keywords).find({
        _id: { $ne: req.query.id },
      });

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  if (req.method === "POST") {
    try {
      const { name, email, password, pic } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Please provide name, email and password",
          success: false,
          msg: "Please provide name, email and password",
        });
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({
          error: "User already exists",
          success: false,
          msg: "User already exists",
        });
      }
      let salt = bcrypt.genSaltSync(10);

      const secPassword = bcrypt.hashSync(password, salt);
      const user = await User.create({
        name,
        email,
        password: secPassword,
        pic,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          pic: user.pic,
          success: true,
          msg: "User created successfully",
          //   token: generateToken(user._id),
        });
      } else {
        return res.status(400).json({
          error: "User not created",
          success: false,
          msg: "User not created",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  }
  //   if (req.method === "PUT") {
  //     try {
  //       const post = await Post.findByIdAndUpdate(req.body._id, req.body);

  //       res.status(200).json(post);
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }

  //   }
  //   if (req.method === "DELETE") {
  //     try {
  //       const post = await Post.findByIdAndDelete(req.body._id);

  //       res.status(200).json(post);
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   }
};
export default connectDb(handler);
