/** @format */

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalState } from "../atoms/modelAtoms";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { handleChatState } from "../atoms/chatAtom";
import { handleChatState, useSSRChatsState } from "../atoms/chatAtom";
import Loader from "./Loader";
import UserAvtar from "./UserAvtar";
function Form() {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length < 2) {
      toast.error("Group At Least 2 Members");
    }
    if (selectedUsers.length >= 2) {
      const response = await fetch("/api/group", {
        method: "POST",
        body: JSON.stringify({
          name: TextArea,
          users: selectedUsers,
          user: session.user.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // const responseData = await response.json();

      setUseSSRChats(false);
      setHandleChat(true);
      toast.success("Group created successfully");
    }
  };
  const hasSelected = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast.error("User Already in Added", {
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    if (userToAdd._id === session.user.id) {
      toast.error("Admin Already Exist in this list", {
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
    setResult(false);

    // if (selectedUsers.includes(userToAdd)) {

    // }
  };
  console.log(selectedUsers);
  const handleSearch = async (query) => {
    setSearch(query);
    if (Search.length > 0) {
      setLoading(true);
      const search = await fetch("/api/user/?search=" + query);
      const data = await search.json();

      setUsers(data);
      setResult(true);
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col relative space-y-2 pb-10"
      onSubmit={handleSubmit}
    >
      <ToastContainer />
      <textarea
        name=""
        id=""
        rows="1"
        placeholder="Group Name"
        className="bg-white text-black border-2 border-gray-600 rounded-lg p-2"
        value={TextArea}
        onChange={(e) => setTextArea(e.target.value)}
      />
      <div className="flex items-center space-x-4">
        {selectedUsers?.map((user) => {
          return (
            <div
              key={user?._id}
              className="flex justify-center items-center bg-blue-500 text-white rounded-full px-2 py-1 space-x-2
              hover:bg-red-500 cursor-pointer"
            >
              <h1 className="">{user?.name}</h1>
              <span clsssName="mb-2">x</span>
            </div>
          );
        })}
      </div>
      <input
        type="text"
        placeholder="Search for people, pages, or groups"
        className="bg-white   text-black border-2 border-gray-600 rounded-lg p-2"
        value={Search}
        onChange={(e) => handleSearch(e.target.value)}
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
                hasSelected(user);
              }}
            >
              <UserAvtar user={user} />
            </div>
          ) : (
            ""
          );
        })
      )}
      <button
        className="absolute -bottom-2 right-0 font-medium bg-blue-400 hover:bg-blue-500 disabled:text-black/40 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-full px-3.5 py-1"
        type="submit"
        disabled={!TextArea.trim() && !photoUrl.trim()}
        onClick={() => {
          setModalOpen(false);
        }}
      >
        Create Group
      </button>
    </form>
  );
}

export default Form;
