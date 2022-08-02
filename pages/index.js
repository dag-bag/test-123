/** @format */

import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Chat from "../models/Chat";
import User from "../models/User";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import UserAvtar from "../components/UserAvtar";
import Chats from "../components/Chats";

import mongoose from "mongoose";
import Search from "../components/Search";
import { useRecoilState } from "recoil";
import { handleChatState, useSSRChatsState } from "../atoms/chatAtom";
import { AnimatePresence } from "framer-motion";
import Modal from "../components/Model";
import { modalState, modalTypeState } from "../atoms/modelAtoms";

import Msg from "../components/Msg";

export default function Home({ chats }) {
  const { data: session } = useSession();

  const [handleChat, setHandleChat] = useRecoilState(handleChatState);

  const [useSSRChats, setUseSSRChats] = useRecoilState(useSSRChatsState);

  const [AllChats, setAllChats] = useState([]);

  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  // Socket connection

  useEffect(() => {
    const getChats = async () => {
      const response = await fetch("/api/chat/?id=" + session.user.id);
      const respData = await response.json();
      setAllChats(respData);
      setHandleChat(false);
      // setUseSSRChats(false);
    };
    if (handleChat) {
      getChats();
    }
    // getperfectChat(session.user.id, AllChats.users);
  }, [handleChat, useSSRChats]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <ToastContainer />
      <div className="container mx-auto">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3 mx-3"
          onClick={() => {
            setModalOpen(true);
            setModalType("dropIn");
          }}
        >
          Create a Group
        </button>
        <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
          <div className="border-r border-gray-300 lg:col-span-1">
            <div className="mx-3 my-3">
              <div className="relative text-gray-600">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-gray-300"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
                <Search />
              </div>
            </div>

            <ul className="overflow-auto h-[32rem]">
              <h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
              <li>
                {useSSRChats
                  ? chats.map((chat) => {
                      return <Chats key={chat._id} chat={chat} />;
                    })
                  : AllChats.map((chat) => {
                      return <Chats key={chat._id} chat={chat} />;
                    })}
              </li>
            </ul>
          </div>
          <Msg />
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <Modal handleClose={() => setModalOpen(false)} type={modalType} />
        )}
      </AnimatePresence>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: session.user.id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  return {
    props: { session, chats: JSON.parse(JSON.stringify(chats)) },
  };
}
