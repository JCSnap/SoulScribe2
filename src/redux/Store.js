import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from "./Profile"; 
import ChatbotReducer from "./Chatbot"; 

export default configureStore({
  reducer: {
    profile: ProfileReducer, 
    chatbot: ChatbotReducer, 
  },
});
