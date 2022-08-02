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
export const selectedChatState = atom({
  key: "selctedChatPostState",
  default: {},
});

export const useSSRChatsState = atom({
  key: "useSSRPostsState",
  default: true,
});
export const isSelectState = atom({
  key: "isSelectState",
  default: false,
});

export const getRightChatState = atom({
  key: "getRightChatState",
  default: {},
});

export const messgeAtomState = atom({
  key: "messgeAtomState",
  default: [],
});
