/** @format */

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
            <img
              src={user?.pic}
              alt=""
              className="h-10 w-10 object-cover rounded-full"
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
