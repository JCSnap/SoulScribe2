import { createSlice } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";

export const chatbotSlice = createSlice({
    name: "chatbot",
    initialState: {
      chatOpen: false,
      x: Dimensions.get("window").width - 60,
      y: 10,
      queryOpen: false, 
      queryBackgroundOpen: false,
      queryX: Dimensions.get("window").width - 60,
    },
    reducers: {
      toggleChat: (state) => {
        state.chatOpen = !state.chatOpen;
      },
      changeX: (state, action) => {
        state.x = action.payload
      }, 
      changeY: (state, action) => {
        state.y = action.payload
      }, 
      toggleQueryChat: (state) => {
        state.queryOpen = !state.queryOpen;
      },
      changeQueryX: (state, action) => {
        state.queryX = action.payload
      }, 
      toggleBackgroundQueryBot: (state) => {
        state.queryBackgroundOpen = !state.queryBackgroundOpen;
      },
    }
  });
  
  // Action creators are generated for each case reducer function
  export const { 
    toggleChat,
    changeX,
    changeY,
    toggleQueryChat,
    changeQueryX, 
    toggleBackgroundQueryBot } = chatbotSlice.actions;
  
  export default chatbotSlice.reducer;