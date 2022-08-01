/** @format */

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { handleChatState, useSSRChatsState } from "../atoms/chatAtom";
import Loader from "./Loader";
import UserAvtar from "./UserAvtar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Search() {
  const { data: session } = useSession();
  // const [RealTimeChat, setRealTimeChat] = useState([]);
  const [handleChat, setHandleChat] = useRecoilState(handleChatState);
  const [useSSRChats, setUseSSRChats] = useRecoilState(useSSRChatsState);
  const [Search, setSearch] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Users, setUsers] = useState([]);
  const [Result, setResult] = useState(false);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (Search.length <= 0) {
      toast.warn("Please enter a query !", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (Search.length > 0) {
      setLoading(true);
      const search = await fetch("/api/user/?search=" + Search);
      const data = await search.json();
      setUsers(data);
      setResult(true);
      setLoading(false);
    }
  };
  const accessChat = async (id) => {
    if (id === session.user.id) {
      toast.error("You Can't Access chat with you!", {
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messeger: session.user.id,
        receiver: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const respData = await response.json();
    setHandleChat(true);
    setUseSSRChats(false);
    setResult(false);
  };
  return (
    <form onSubmit={handleSearch} className="relative">
      <ToastContainer />
      <input
        type="search"
        className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
        name="search"
        placeholder="Search"
        value={Search}
        onChange={(e) => setSearch(e.target.value)}
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
                accessChat(user._id);
              }}
            >
              <UserAvtar user={user} />
            </div>
          ) : (
            ""
          );
        })
      )}
    </form>
  );
}

export default Search;
