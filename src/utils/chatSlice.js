import { createSlice } from "@reduxjs/toolkit";
import { messageges } from "./constants";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [
      {
        user: "pc",
        assistant:
          "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      },
      {
        id: 2,
        user: "pc",
        assistant:
          "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      },
      {
        user: "pc",
        assistant:
          "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      },
      {
        user: "pc",
        assistant:
          "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      },
      {
        user: "pc",
        assistant:
          "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      },
      {
        user: "pc",
        assistant:
          "Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume Lorem ipsume ",
      },
    ],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
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
  },
});

export const { addMessage, addAnswer } = chatSlice.actions;

export default chatSlice.reducer;
