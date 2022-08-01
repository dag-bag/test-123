/** @format */

import mongoose from "mongoose";
const { Schema } = mongoose;
import Message from "./Message";
const chatSchema = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },

  { timestamps: true }
);
mongoose.models = {};
module.exports = mongoose.model("Chat", chatSchema);
