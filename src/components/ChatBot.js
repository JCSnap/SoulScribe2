import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Draggable from "react-native-draggable";
import { useDispatch, useSelector } from "react-redux";
import { toggleChat, setX, setY } from "../redux/Chatbot";

const DraggableChatBot = () => {
  const dispatch = useDispatch();

  const x = useSelector((state) => state.chatbot.x)
  const y = useSelector((state) => state.chatbot.y)

  const toggleChatLocal = () => {
    dispatch(toggleChat());
    console.log(y)
  };

  return (
    <View className="w-full absolute z-40">
      <Draggable
        x={x}
        y={y}
        minX={Dimensions.get("window").width - 60}
        onShortPressRelease={toggleChatLocal}
        onDragEnd={(event, gestureState) => {
          // Update x when the drag ends
          dispatch(setX(gestureState.moveX));
        }}
      >
        <View>
          <Image
            source={require("../assets/chatbot.png")}
            className="w-20 h-20"
          ></Image>
        </View>
      </Draggable>
    </View>
  );
};

export default DraggableChatBot;
