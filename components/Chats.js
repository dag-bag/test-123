/** @format */

import { useSession } from "next-auth/react";
import { createKey } from "next/dist/shared/lib/router/router";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  getRightChatState,
  isSelectState,
  selectedChatState,
} from "../atoms/chatAtom";
import getperfectChat from "../libs/getperfectChat";

function Chats({ chat }) {
  const { data: session } = useSession();
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [Message, setMessage] = useState([]);

  const [RightChatState, setRightChatState] = useRecoilState(getRightChatState);

  let data = getperfectChat(session.user.id, chat.users);
  const isGroup = chat.isGroupChat;

  const [isSelect, setIsSelect] = useRecoilState(isSelectState);

  // const getChats = async () => {
  //   // console.log(selectedChat._id);
  //   // const response = await fetch("/api/message/?chatId=" + selectedChat._id);
  //   // const respData = await response.json();
  //   // setMessage(respData);
  //   // setAllChats(respData);
  //   // setHandleChat(false);
  //   // setUseSSRChats(false);
  // };
  // console.log(Message);

  // let c = chat.users[0];
  // console.log(c);

  // let data = chat.users[1];

  //   let previousChat = chat.users[0];
  return (
    <>
      {!isGroup && (
        <a
          className={`flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none `}
          onClick={() => {
            setSelectedChat(chat);
            setIsSelect(true);
            setRightChatState(getperfectChat(session.user.id, chat.users));
            // socket.emit("setup", session.user.id);
          }}
        >
          <div>
            <Image
              className="object-cover w-10 h-10 rounded-full"
              src={data?.pic}
              alt="username"
              width={40}
              height={40}
            />
          </div>
          <div className="w-full pb-2">
            <div className="flex justify-between">
              <span className="block ml-2 font-semibold text-gray-600">
                {data?.name}
              </span>
              <span className="block ml-2 text-sm text-gray-600">
                25 minutes
              </span>
            </div>
            <span className="block ml-2 text-sm text-gray-600">bye</span>
          </div>
        </a>
      )}
      {isGroup && (
        <a
          className={`flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none `}
          onClick={() => {
            setSelectedChat(chat);
            setIsSelect(true);
          }}
        >
          <Image
            className="object-cover w-10 h-10 rounded-full"
            src={data?.pic}
            alt="username"
            width={40}
            height={40}
          />
          <div className="w-full pb-2">
            <div className="flex justify-between">
              <span className="block ml-2 font-semibold text-gray-600">
                {chat?.chatName}
              </span>
              <span className="block ml-2 text-sm text-gray-600">
                25 minutes
              </span>
            </div>
            <span className="block ml-2 text-sm text-gray-600">bye</span>
          </div>
        </a>
      )}
    </>
  );
}

export default Chats;
