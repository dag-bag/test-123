/** @format */

import Image from "next/image";
import React from "react";

function UserAvtar({ user }) {
  return (
    <>
      <div
        role="status"
        className="p-2 bg-white space-y-4 max-w-md rounded border border-gray-200 divide-y divide-gray-200 shadow dark:divide-gray-700 md:p-2 dark:border-gray-700 hover:bg-blue-100 dark-hover:bg-blue-700 cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center space-x-4">
            <Image
              className="object-cover w-10 h-10 rounded-full"
              src={user.image}
              alt="username"
              width={40}
              height={40}
            />
            <h1 className="font-bold">{user?.name}</h1>
            <div className="font-semibold ">{user?.email}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserAvtar;
