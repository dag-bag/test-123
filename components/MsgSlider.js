/** @format */

// import { useSelect } from "@mui/base";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { isLastMessage, isSameSender, isSameUser } from "../libs/chatLogic";
import io from "socket.io-client";
import { messgeAtomState, selectedChatState } from "../atoms/chatAtom";
import { useRecoilState } from "recoil";
import Image from "next/image";
let socket;
function MsgSlider() {
  const [socketConnected, setsocketConnected] = useState(false);
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [messages, setMessages] = useRecoilState(messgeAtomState);
  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("connection", () => {
      setsocketConnected(true);
    });
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("New MSG", newMessageRecieved);
      console.log(newMessageRecieved);
      setMessages([...messages, newMessageRecieved]);
    });
    socket.emit("setup", session.user.id);
  };

  // useEffect(() => {
  //   socketInitializer();
  // }, [messages]);
  // useEffect(() => {
  //   socket = io();
  //
  // }, [messages]);

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
            <Image
              className="object-cover w-10 h-10 rounded-full"
              src={m.sender.pic}
              alt="username"
              width={40}
              height={40}
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
