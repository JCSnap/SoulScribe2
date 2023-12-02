/**
 * Home Screen: The first screen displayed to the user after logging in.
 * It provides an overview of the user's journal, customizable content, and navigation options.
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { WriteButton } from "../components/Button";
import Navbar from "../components/navbar/Navbar";
import CustomizableHome from "../components/CustomizableHome";
import TotalEntries from "../components/TotalEntries";
import { Text, View, Dimensions } from "react-native";
import { DefaultView } from "../components/View";
import Toast from "react-native-toast-message";
import DraggableChatBot from "../components/ChatBot";
import SetUp from "../components/SetUp";
import getUserData from "../utils/getUserData";
import OnboardingModal from "../components/OnboardingModal";
import { ART_STYLES } from "../constants/Shop";
import {
  changeEntries,
  changeColour,
  changeUsername,
  changeGender,
  setEmail,
  changeArtSelected,
  changeCoins,
  setLoaded,
} from "../redux/Profile";
import ChatInterface from "../components/ChatInterface";
import { setX } from "../redux/Chatbot";

const HomeScreen = ({ navigation, route }) => {
  const { user } = useAuthentication();
  const dispatch = useDispatch();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const username = useSelector((state) => state.profile.username);
  const isLoaded = useSelector((state) => state.profile.loaded);
  const isChatOpen = useSelector((state) => state.chatbot.chatOpen);

  const checkFirstTime = async () => {
    const userData = await getUserData();
    const isFirstTime = await userData.getIsFirstTine();
    setIsFirstTime(isFirstTime);
    dispatch(changeUsername(await userData.getUsername()));
  };

  const toggleOnboarding = () => {
    setIsOnboardingOpen(!isOnboardingOpen);
  };

  const getProfile = async () => {
    if (!isLoaded) {
      const userData = await getUserData();
      const username = await userData.getUsername();
      const gender = await userData.getGender();
      const art = await userData.getStyle();
      const artTitle = ART_STYLES[art].title;
      const coins = await userData.getCoins();
      const entries = await userData.getEntries();
      const email = await userData.getEmail();
      dispatch(changeUsername(username));
      dispatch(changeCoins(coins));
      dispatch(changeEntries(entries));
      dispatch(changeGender(gender));
      dispatch(setEmail(email));
      dispatch(changeArtSelected(artTitle));
      dispatch(setLoaded());
      dispatch(setX(Dimensions.get("window").width - 60));
    }
  };

  useEffect(() => {
    checkFirstTime();
    getProfile();
  }, [isLoaded]);

  useEffect(() => {
    if (route.params?.showToast) {
      console.log(route.params?.firstEntry);
      if (route.params?.firstEntry) {
        Toast.show({
          type: "success",
          text1: "Entry of the day saved! 📅",
          text2: `With ${route.params?.consecutiveDays} consecutive ${
            route.params?.consecutiveDays == 1 ? "day" : "days"
          } journalled, you earned ${route.params?.coinsEarned} ${
            route.params?.coinsEarned == 1 ? "coin" : "coins"
          }! 🪙`,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Entry saved! 📚",
          text2: "Keep up the good work!",
        });
      }

      // Reset the param to false so it doesn't keep showing the toast
      route.params.showToast = false;
    }
  }, [route.params]);

  return (
    <DefaultView>
      {isOnboardingOpen && <OnboardingModal closeModal={toggleOnboarding} />}
      {isFirstTime && (
        <SetUp onSave={checkFirstTime} toggleOnboarding={toggleOnboarding} />
      )}
      <View className="absolute z-20">
        <Toast />
      </View>
      {!isChatOpen && <DraggableChatBot />}
      <TotalEntries />
      <CustomizableHome />
      <Text className=" text-lg font-bold h-7">Welcome {username}!</Text>
      <WriteButton
        onPress={() => {
          navigation.navigate("Write");
        }}
      />
      {isChatOpen && <ChatInterface />}
      <Navbar navigation={navigation} />
    </DefaultView>
  );
};

export default HomeScreen;
