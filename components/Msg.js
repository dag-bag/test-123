/** @format */

import { ResetTvRounded } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  getRightChatState,
  isSelectState,
  messgeAtomState,
  selectedChatState,
} from "../atoms/chatAtom";
import { modalState, modalTypeState } from "../atoms/modelAtoms";

import MsgSlider from "./MsgSlider";
// import io from "socket.io-client";
import Image from "next/image";
// let socket;
import GroupWorkIcon from "@mui/icons-material/GroupWork";
let selectedChatCompare;
function Msg() {
  const { data: session } = useSession();
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [isSelect, setIsSelect] = useRecoilState(isSelectState);
  const [rightUser, setRightUser] = useState([]);
  const [RightChatState, setRightChatState] = useRecoilState(getRightChatState);
  const [msg, setMsg] = useState("");
  // const [Messages, setMessages] = useState([]);
  const [Messages, setMessages] = useRecoilState(messgeAtomState);

  const fetchMessages = async () => {
    const response = await fetch("/api/message/?chatId=" + selectedChat._id);
    const respData = await response.json();

    setMessages(respData);
    // socket = io();
    // socket.emit("join chat", selectedChat._id);
  };
  useEffect(() => {
    if (isSelect) {
      fetchMessages();
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  const sendMsg = async (e) => {
    e.preventDefault();

    // let chatId = await selectedChat._id;
    const response = await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: session.user.id,
        content: msg,
        chatId: selectedChat._id,
      }),
    });
    const respData = await response.json();

    setMessages([...Messages, respData]);
    // socket.emit("new msg", respData);
    setMsg("");
  };

  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);

  return (
    <>
      {!isSelect && (
        <>
          <div className="w-full flex justify-center items-center m-auto">
            Please Select a Chat
          </div>
        </>
      )}
      {isSelect && !selectedChat.isGroupChat && (
        <div className="hidden lg:col-span-2 lg:block">
          <div className="w-full">
            <div className="relative flex items-center p-3 border-b border-gray-300">
              <Image
                className="object-cover w-10 h-10 rounded-full"
                src={RightChatState?.pic}
                alt="username"
                width={40}
                height={40}
              />

              <span className="block ml-2 font-bold text-gray-600">
                {RightChatState?.name}
              </span>
              <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
            </div>
            <div className="relative w-full p-6 overflow-y-auto h-[30rem]">
              <MsgSlider messages={Messages} />
            </div>
            <form
              onSubmit={(e) => {
                sendMsg(e);
              }}
            >
              <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Message"
                  className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                  name="message"
                  required
                  onChange={(e) => {
                    setMsg(e.target.value);
                  }}
                  value={msg}
                />
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
                <button type="submit">
                  <svg
                    className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isSelect && selectedChat.isGroupChat && (
        <div className="hidden lg:col-span-2 lg:block">
          <div className="w-full">
            <div className="relative flex items-center justify-between p-3 border-b border-gray-300">
              <div className="flex items-center">
                <GroupWorkIcon className="!h-20 !w-20 " />
                <span className="block ml-2 font-bold text-gray-600 uppercase">
                  {selectedChat.chatName}
                </span>
                <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3 mx-3"
                onClick={() => {
                  setModalOpen(true);
                  setModalType("gifYouUp");
                }}
              >
                Edit Group
              </button>
            </div>
            <div className="relative w-full p-6 overflow-y-scroll h-[30rem]">
              <MsgSlider />
            </div>
            <form
              onSubmit={(e) => {
                sendMsg(e);
              }}
            >
              <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Message"
                  className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                  name="message"
                  required
                  onChange={(e) => {
                    setMsg(e.target.value);
                  }}
                  value={msg}
                />
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
                <button type="submit">
                  <svg
                    className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Msg;
