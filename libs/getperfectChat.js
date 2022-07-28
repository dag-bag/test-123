/** @format */

import React from "react";

function getperfectChat(loggedUser, users) {
  if (users[0]._id.toString() === loggedUser.toString()) {
    return users[1];
  } else {
    return users[0];
  }
}

export default getperfectChat;
