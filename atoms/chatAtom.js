/** @format */

import { atom } from "recoil";

export const handleChatState = atom({
  key: "handlePostState",
  default: false,
});

export const getChatState = atom({
  key: "getPostState",
  default: {},
});

export const useSSRChatsState = atom({
  key: "useSSRPostsState",
  default: true,
});
