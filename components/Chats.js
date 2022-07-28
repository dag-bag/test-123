/** @format */

import { useSession } from "next-auth/react";
import { createKey } from "next/dist/shared/lib/router/router";
import React, { useState } from "react";
import getperfectChat from "../libs/getperfectChat";
// import getperfectChat from "../lib/getperfectChat";

function Chats({ chat }) {
  const { data: session } = useSession();
  let data = getperfectChat(session.user.id, chat.users);
  // let c = chat.users[0];
  // console.log(c);

  // let data = chat.users[1];

  //   let previousChat = chat.users[0];
  return (
    <>
      <a
        className={`flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none `}
        // onClick={() => {
        //   setSelectedChat(true);
        // }}
      >
        <img
          className="object-cover w-10 h-10 rounded-full"
          src={data?.pic}
          alt="username"
        />
        <div className="w-full pb-2">
          <div className="flex justify-between">
            <span className="block ml-2 font-semibold text-gray-600">
              {data?.name}
            </span>
            <span className="block ml-2 text-sm text-gray-600">25 minutes</span>
          </div>
          <span className="block ml-2 text-sm text-gray-600">bye</span>
        </div>
      </a>
    </>
  );
}

export default Chats;
