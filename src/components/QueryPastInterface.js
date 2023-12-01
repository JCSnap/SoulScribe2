import React, { useState, useEffect, useCallback } from "react";
import { Dimensions, View, Keyboard, Modal } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import getUserData from "../utils/getUserData";
import getQueryPastResponse from "../utils/getQueryPastResponse";
import { FEATURE, QUERY_PAST } from "../constants/Replies";
import DraggableQueryPastBot from "./QueryPastBot";

const QueryPastInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [minInputToolbarHeight, setMinInputToolbarHeight] = useState(0);

  const _keyboardDidShow = (e) => {
    let keyboardHeight = e.endCoordinates.height;
    console.log(keyboardHeight);
    setMinInputToolbarHeight(keyboardHeight);
  };

  const _keyboardDidHide = () => {
    setMinInputToolbarHeight(0);
  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: QUERY_PAST,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Your buddy",
          avatar: require("../assets/low_poly_clock.png"),
        },
        quickReplies: {
          type: "radio", // or 'checkbox',
          keepIt: true,
          values: [
            {
              title: "Tell me more about this feature!",
              value: "feature",
            },
          ],
        },
      },
    ]);
    console.log(messages);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      _keyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserData();
      const uid = userData.getUserId();
      // Only reply when it's not the bot's message
      if (messages.length > 0 && messages[0].user._id !== 2) {
        setIsTyping(true); // set the typing indicator to true
        let response = "";
        try {
          response = await getQueryPastResponse(messages[0].text, uid);
        } catch (error) {
          response =
            "Sorry, there appears to be an error. Please try again 😞.";
        }
        setIsTyping(false); // set the typing indicator to false
        console.log(response);
        startReplying(response);
      }
    };

    fetchData();
  }, [messages]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const startReplying = (response) => {
    const responseObject = {
      _id: Math.round(Math.random() * 1000000),
      text: response,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "Your buddy",
        avatar: require("../assets/low_poly_clock.png"),
      },
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, responseObject)
    );
  };

  const onQuickReply = (replies) => {
    const newReply = replies[0];

    let responseText;
    if (newReply.value == "feature") {
      responseText = FEATURE;
    }

    console.log(messages[0]);
    const dummy = {
      _id: Math.round(Math.random() * 1000000),
      text: newReply.title,
      user: {
        _id: 1,
      },
    };

    const response = {
      _id: Math.round(Math.random() * 1000000),
      text: responseText,
      user: {
        _id: 2,
        name: "Your buddy",
        avatar: require("../assets/low_poly_clock.png"),
      },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [response, dummy])
    );
  };

  return (
    <View className="items-center w-11/12 z-30">
      <Modal transparent={true}>
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <DraggableQueryPastBot />
    <View
      className="bg-white w-11/12 rounded-lg border-stone-400 border-4"
      style={{
        height: Dimensions.get("window").height * 0.89 - minInputToolbarHeight,
        borderColor: "black",
      }}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        onQuickReply={(replies) => onQuickReply(replies)}
        user={{
          _id: 1,
        }}
        isTyping={isTyping}
        bottomOffset={1}
      />
        </View>
        </View>
      </Modal>
    </View>
  );
};

export default QueryPastInterface;
