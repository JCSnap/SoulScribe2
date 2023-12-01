import React from "react";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import Entry from "../components/Entry";
import Navbar from "../components/navbar/Navbar";
import { DefaultView } from "../components/View";
import DraggableChatBot from "../components/ChatBot";
import ChatInterface from "../components/ChatInterface";
import { useSelector } from "react-redux";

/**
 * Write screen where user writes his/her journal entries.
 */
const WriteScreen = ({ navigation }) => {
  const { user } = useAuthentication();

  const chatOpen = useSelector((state) => state.chatbot.chatOpen);

  return (
    <DefaultView>
      <Entry navigation={navigation} />
      <Navbar navigation={navigation} />
      {!chatOpen && <DraggableChatBot />}
      {chatOpen && <ChatInterface />}
    </DefaultView>
  );
};

export default WriteScreen;
