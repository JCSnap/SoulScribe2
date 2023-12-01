import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Draggable from "react-native-draggable";
import QueryPastInterface from "./QueryPastInterface";
import { useDispatch, useSelector } from "react-redux";
import { toggleBackgroundQueryBot, toggleQueryChat, setQueryX } from "../redux/Chatbot";
const DraggableQueryPastBot = () => {
  const dispatch = useDispatch();

  const x = useSelector((state) => state.chatbot.queryX)
  const bg_open = useSelector((state) => state.chatbot.queryBackgroundOpen)

  const toggleChat = () => {
    dispatch(toggleQueryChat());
    dispatch(toggleBackgroundQueryBot());
    console.log(bg_open);
  };

  return (
    <View className="w-full absolute z-40">
      <Draggable
        x={x}
        y={30}
        minX={Dimensions.get("window").width - 60}
        onShortPressRelease={toggleChat}
        onDragEnd={(event, gestureState) => {
          // Update x when the drag ends
          dispatch(setQueryX(gestureState.moveX));
        }}
      >
        <View>
          <Image
            source={require("../assets/low_poly_clock.png")}
            className="w-16 h-16"
          ></Image>
        </View>
      </Draggable>
    </View>
  );
};

export default DraggableQueryPastBot;
