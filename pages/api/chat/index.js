/** @format */

import connectDb from "../../../lib/mongodb";
import User from "../../../models/User";
import Chat from "../../../models/Chat";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const handler = async (req, res) => {
  if (req.method === "GET") {
    const chat = await Chat.find({
      users: { $elemMatch: { $eq: req.query.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  }

  if (req.method === "POST") {
    const { messeger, receiver } = req.body;
    console.log(messeger, receiver);
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: messeger } } },
        { users: { $elemMatch: { $eq: receiver } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [messeger, receiver],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
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
