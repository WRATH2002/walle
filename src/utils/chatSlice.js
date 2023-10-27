import { createSlice } from "@reduxjs/toolkit";
import { messageges } from "./constants";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [
      // {
      //   user: "pc",
      //   assistant:
      //     "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      // },
      // {
      //   id: 2,
      //   user: "pc",
      //   assistant:
      //     "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      // },
      // {
      //   user: "pc",
      //   assistant:
      //     "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      // },
      // {
      //   user: "pc",
      //   assistant:
      //     "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      // },
      // {
      //   user: "pc",
      //   assistant:
      //     "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      // },
      // {
      //   user: "pc",
      //   assistant:
      //     "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      // },
    ],
    chatSegment: [{ chatId: "hello" }],
    signingMode: 1,
    darkMode: 1,
  },
  reducers: {
    addChatSegment: (state, action) => {
      state.chatSegment.push(action.payload);
      console.log(state.chatSegment);
    },
    clearChatSegment: (state, action) => {
      state.chatSegment = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      // console.log(state.messages);
    },
    addMessageNew: (state, action) => {
      state.messages = [];
    },
    addAnswer: (state, action) => {
      const temp = action.payload;
      console.log(temp);
      const idToInsert = temp.id;
      const message = temp.result;
      // state.messages.find((product) => product.id === idToChange);
      state.messages.forEach((info) => {
        if (info.id === idToInsert) {
          info.assistant = message;
        }
      });

      // state.messages[idToInsert].assistant = message;
      // state.messages[0].assistant = action.payload;
    },
    toggleStateMode: (state, action) => {
      state.signingMode = action.payload;
      console.log(state.signingMode);
    },
    toggleDarkMode: (state, action) => {
      state.darkMode = action.payload;
      console.log("slice");
      console.log(state.darkMode);
    },
  },
});

export const {
  addChatSegment,
  addMessage,
  addMessageNew,
  addAnswer,
  toggleStateMode,
  toggleDarkMode,
  clearChatSegment,
} = chatSlice.actions;

export default chatSlice.reducer;
