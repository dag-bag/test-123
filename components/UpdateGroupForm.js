/** @format */

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { modalState } from "../atoms/modelAtoms";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { handleChatState } from "../atoms/chatAtom";
import {
  handleChatState,
  isSelectState,
  selectedChatState,
  useSSRChatsState,
} from "../atoms/chatAtom";
import Loader from "./Loader";
import UserAvtar from "./UserAvtar";

function UpdateForm() {
  const { data: session } = useSession();

  const [useSSRChats, setUseSSRChats] = useRecoilState(useSSRChatsState);
  const [Search, setSearch] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Users, setUsers] = useState([]);
  const [Result, setResult] = useState(false);
  const [handleChat, setHandleChat] = useRecoilState(handleChatState);
  const setModalOpen = useSetRecoilState(modalState);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [TextArea, setTextArea] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [isSelect, setIsSelect] = useRecoilState(isSelectState);
  const handleRename = async (e, chatId) => {
    e.preventDefault();
    if (TextArea.length < 3) {
      toast.error("Name Should be atleast 3 characters");
    }
    if (TextArea.length > 3) {
      const response = await fetch("/api/group", {
        method: "PUT",
        body: JSON.stringify({
          name: TextArea,
          chatId: chatId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      setSelectedChat(responseData);
      setUseSSRChats(false);
      setHandleChat(true);
    }
  };
  const handleRemove = async (e, chatId, userId) => {
    if (selectedChat.groupAdmin._id !== session.user.id) {
      toast.error("Only admins can add someone!", {
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    e.preventDefault();
    const response = await fetch("/api/group/user", {
      method: "DELETE",
      body: JSON.stringify({
        chatId: chatId,
        userId: userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    setSelectedChat(responseData);
    setUseSSRChats(false);
    setHandleChat(true);
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (Search.length > 2) {
      setLoading(true);
      const search = await fetch("/api/user/?search=" + query);
      const data = await search.json();

      setUsers(data);
      setResult(true);
      setLoading(false);
    }
  };

  const handleAddUser = async (chatId, userId) => {
    if (selectedChat.users.find((u) => u._id === userId)) {
      toast.error("User Already in group!", {
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== session.user.id) {
      toast.error("Only admins can add someone!", {
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const response = await fetch("/api/group/user", {
      method: "PUT",
      body: JSON.stringify({
        chatId: chatId,
        userId: userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    setSelectedChat(responseData);
    setUseSSRChats(false);
    setHandleChat(true);
    setResult(false);
  };
  return (
    <div className="bg-white rounded-full p-6 relative">
      <span
        className="absolute top-4 right-4 font-bold text-2xl cursor-pointer font-mono"
        onClick={() => {
          setModalOpen(false);
        }}
      >
        X
      </span>
      <form className="space-y-6">
        <h1 className="text-center text-3xl">{selectedChat.chatName}</h1>
        <div className="flex justify-center items-center flex-wrap space-x-3 text-white">
          {selectedChat?.users.map((i) => {
            return (
              <div
                key={i._id}
                className="bg-blue-500 hover:bg-red-500  rounded-full py-1 px-2 flex items-center space-x-2 cursor-pointer"
                onClick={(e) => {
                  handleRemove(e, selectedChat._id, i._id);
                }}
              >
                <h4 className="">{i.name}</h4>
                <span>x</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center items-center space-x-4">
          <input
            id="text"
            name="text"
            type="text"
            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-400 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Update Group Name"
            onChange={(e) => setTextArea(e.target.value)}
            value={TextArea}
          />
          <button
            className="bg-red-500 py-2 px-3 rounded-full text-white text-sm "
            onClick={(e) => {
              handleRename(e, selectedChat._id);
            }}
          >
            Update Name
          </button>
        </div>
        <div>
          <input
            id="text"
            name="text"
            type="text"
            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-400 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Add New User"
            onChange={(e) => handleSearch(e.target.value)}
            value={Search}
          />
          {Loading ? (
            <div className="absolute top-10  left-0 w-full z-50">
              <Loader />
            </div>
          ) : (
            Users.map((user) => {
              return Result ? (
                <div
                  key={user.id}
                  onClick={() => {
                    handleAddUser(selectedChat._id, user._id);
                  }}
                >
                  <UserAvtar user={user} />
                </div>
              ) : (
                ""
              );
            })
          )}
        </div>
        <button
          className="bg-red-500 py-2 px-3 rounded-full text-white text-sm w-8/12 m-auto"
          onClick={(e) => {
            handleRemove(e, selectedChat._id, session.user.id);
            setModalOpen(false);
            setIsSelect(false);
          }}
        >
          Leave Group
        </button>
      </form>
    </div>
  );
}

export default UpdateForm;
