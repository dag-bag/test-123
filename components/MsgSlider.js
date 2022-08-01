/** @format */

// import { useSelect } from "@mui/base";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { isLastMessage, isSameSender, isSameUser } from "../libs/chatLogic";
import io from "socket.io-client";
import { selectedChatState } from "../atoms/chatAtom";
import { useRecoilState } from "recoil";

function MsgSlider({ messages }) {
  const [socketConnected, setsocketConnected] = useState(false);
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const socketInitializer = async () => {
    await fetch("/api/socket");
    var socket = io();

    socket.on("connect", () => {
      // console.log("connected");
    });
    socket.on("connection", () => {
      setsocketConnected(true);
    });
    socket.emit("setup", session.user.id);
    socket.emit("message", "heelo");
  };
  useEffect(() => {
    socketInitializer();
  }, [messages]);

  // console.log(Messages);
  const { data: session } = useSession();
  return (
    messages &&
    messages.map((m, i) => (
      <div
        className={`flex ${
          m.sender._id === session.user.id ? "justify-end" : "justify-start"
        }`}
        key={m._id}
      >
        {(isSameSender(messages, m, i, session.user.id) ||
          isLastMessage(messages, i, session.user.id)) && (
          <div>
            <img
              className="mt-2 mr-1 text-sm cursor-pointer h-10 w-10 rounded-full"
              alt={m.sender.name}
              src={m.sender.pic}
            />
          </div>
        )}
        <span
          className={`${
            m.sender._id === session.user.id ? "bg-[#BEE3F8]" : "bg-[#B9F5D0]"
          }
         

             mt-${isSameSender(messages, m, i, session.user.id)}
             mr-${isSameUser(messages, m, i, session.user.id) ? 3 : 10}
             rounded-full
             py-1 px-3
             text-center
             max-w-6xl
             mt-2 
          `}
        >
          {m.content}
        </span>
      </div>
    ))
  );
}

export default MsgSlider;
