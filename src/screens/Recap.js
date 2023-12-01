/**
 * Recap Screen: Displays the user's summaries and weekly arts.
 */

import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import WeeklyArtsAndSummaries from "../components/WeeklyArtsAndSummaries";
import MonthlyArtsAndSummaries from "../components/MontlyArtsAndSummaries";
import { DefaultView } from "../components/View";
import DraggableChatBot from "../components/ChatBot";
import DraggableQueryPastBot from "../components/QueryPastBot";
import { Button, Modal } from "react-native";
import { useSelector } from "react-redux";
import ChatInterface from "../components/ChatInterface";
import QueryPastInterface from "../components/QueryPastInterface";

const RecapScreen = ({ navigation }) => {
  const [isVisibleDraggableQueryPastBot, setIsVisibleDraggableQueryPastBot] =
    useState(false);
  const [isVisibleWeeklyRecap, setIsVisibleWeeklyRecap] = useState(true);
  const [isActiveWeeklyRecap, setIsActiveWeeklyRecap] = useState(false);
  const [isVisibleMonthlyRecap, setIsVisibleMonthlyRecap] = useState(true);
  const [isActiveMonthlyRecap, setIsActiveMonthlyRecap] = useState(false);

  const chatOpen = useSelector((state) => state.chatbot.chatOpen);
  const queryOpen = useSelector((state) => state.chatbot.queryOpen);
  const queryBackgroundOpen = useSelector((state) => state.chatbot.queryBackgroundOpen);

  const toggleDraggableQueryPastBot = () => {
    setIsVisibleDraggableQueryPastBot(!isVisibleDraggableQueryPastBot);
  };

  const toggleWeeklyRecap = () => {
    setIsVisibleMonthlyRecap(false);
    setIsActiveWeeklyRecap(true);
  };

  const toggleMonthlyRecap = () => {
    setIsVisibleWeeklyRecap(false);
    setIsActiveMonthlyRecap(true);
  };

  const backToDefault = () => {
    setIsVisibleWeeklyRecap(true);
    setIsActiveWeeklyRecap(false);
    setIsVisibleMonthlyRecap(true);
    setIsActiveMonthlyRecap(false);
  };

  return (
    <DefaultView>
      {!chatOpen && <DraggableChatBot />}
      {chatOpen && <ChatInterface />}
      {!queryBackgroundOpen && isVisibleDraggableQueryPastBot && <DraggableQueryPastBot />}
      {queryOpen && <QueryPastInterface />}
      <Button title="Query Your Past" onPress={toggleDraggableQueryPastBot} />
      {!isActiveWeeklyRecap && !isActiveMonthlyRecap && (
        <Button title="Weekly Recap" onPress={toggleWeeklyRecap} />
      )}
      {isVisibleWeeklyRecap && (
        <WeeklyArtsAndSummaries
          isActiveWeeklyRecap={isActiveWeeklyRecap}
          backToDefault={backToDefault}
        />
      )}
      {!isActiveMonthlyRecap && !isActiveWeeklyRecap && (
        <Button title="Monthly Recap" onPress={toggleMonthlyRecap} />
      )}
      {isVisibleMonthlyRecap && (
        <MonthlyArtsAndSummaries
          isActiveMonthlyRecap={isActiveMonthlyRecap}
          backToDefault={backToDefault}
        />
      )}
      <Navbar navigation={navigation} />
    </DefaultView>
  );
};

export default RecapScreen;
