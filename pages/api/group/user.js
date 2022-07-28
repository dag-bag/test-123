/** @format */

import connectDb from "../../../lib/mongodb";
import User from "../../../models/User";
var bcrypt = require("bcryptjs");
import Chat from "../../../models/Chat";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const handler = async (req, res) => {
  if (req.method === "GET") {
  }

  if (req.method === "PUT") {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  }
  if (req.method === "DELETE") {
    try {
      const { chatId, userId } = req.body;

      // check if the requester is admin

      const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
      } else {
        res.json(removed);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
export default connectDb(handler);
