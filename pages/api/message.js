/** @format */

import connectDb from "../../lib/mongodb";
import Message from "../../models/Message";
import User from "../../models/User";
import Chat from "../../models/Chat";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      console.log("Chatid" + req.query.chatId);
      const messages = await Message.find({ chat: req.query.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
  if (req.method === "POST") {
    try {
      const { sender, content, chatId } = req.body;
      console.log(sender, content, chatId);

      if (!sender || !content || !chatId) {
        return res.status(400).json({
          error: "Please provide Sender, Content and ChatId",
          success: false,
          msg: "Please provide Sender, Content and ChatId",
        });
      }
      var newMessage = {
        sender: sender,
        content: content,
        chat: chatId,
      };

      var message = await Message.create(newMessage);

      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });

      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  }
};
export default connectDb(handler);
