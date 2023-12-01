/**
 * Profile Screen: Displays the user's profile information.
 */

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import { View, Text, Image, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { GoToItemsButton, SignOutButton } from "../components/Button";
import { DefaultScrollView, DefaultView } from "../components/View";
import DraggableChatBot from "../components/ChatBot";
import CalendarView from "../components/CalendarView";
import ModalJournal from "../components/ModalJournal";
import getUserData from "../utils/getUserData";
import {
  SettingsButton,
  PrimaryButton,
  DeleteAccountButton,
  ResetPasswordButton,
} from "../components/Button";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../backend/firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import ChatInterface from "../components/ChatInterface";

const ProfileScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dailyJournal, setDailyJournal] = useState("");
  const [datesWithEntry, setDatesWithEntry] = useState({});

  const dispatch = useDispatch();

  const username = useSelector((state) => state.profile.username);
  const email = useSelector((state) => state.profile.email);
  const art = useSelector((state) => state.profile.art_selected);
  const coins = useSelector((state) => state.profile.coins);
  const entries = useSelector((state) => state.profile.entries);
  const chatOpen = useSelector((state) => state.chatbot.chatOpen);

  const openModal = (date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    async function loadUserInfo() {
      try {
        const userDataGet = await getUserData();
        const datesWithEntry = await userDataGet.getDatesWithEntry();
        let markedDatesWithEntry = {};
        datesWithEntry.map(
          (date) => (markedDatesWithEntry[date] = { marked: true })
        );
        setDatesWithEntry(markedDatesWithEntry);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
    loadUserInfo();
  }, []);

  async function loadDailyJournal(date) {
    try {
      let formattedDate = new Date();
      formattedDate.setDate(date.day);
      formattedDate.setMonth(date.month - 1);
      formattedDate.setYear(date.year);
      formattedDate.setMinutes(0);
      formattedDate.setHours(8);
      /**
       * This is neccessary because React Native calendar gives a different date object from javascript, so we
       * need to convert it to Javascript date.
       */
      openModal(date.dateString);
      const userDataGet = await getUserData();
      const text = await userDataGet.getDailyJournalText(formattedDate);
      setDailyJournal(text);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteAccount = async () => {
    if (email == "soulscribeofficial@gmail.com") {
      Alert.alert(
        "Delete Account disabled",
        "Delete Account is disabled on this test account",
        [
          {
            text: "CANCEL",
            style: "cancel",
          },
        ]
      );
    } else {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        Alert.alert(
          "Delete Account",
          "Are you sure you want to delete this account? This action is irreversible",
          [
            {
              text: "CANCEL",
              style: "cancel",
            },
            {
              text: "YES",
              onPress: async () => {
                try {
                  // Delete user data from Firestore
                  const userDoc = doc(db, "users", user.uid);
                  await deleteDoc(userDoc);

                  // Delete the Firebase Auth user
                  await deleteUser(user);
                  console.log("User deleted");
                } catch (error) {
                  console.error("Error deleting user:", error);
                }
              },
              style: "destructive", // This gives the option a red color (only on iOS)
            },
          ],
          { cancelable: false }
        );
      } else {
        // No user is signed in.
        console.log("No user is signed in");
      }
    }
  };

  return (
    <DefaultView>
      <View className="z-20 m-0">
        <Toast />
      </View>
      {!chatOpen && <DraggableChatBot />}
      {chatOpen && <ChatInterface />}
      <DefaultScrollView>
        <View className="bg-white w-full h-32 my-2 rounded-lg flex-row">
          <View className="absolute top-2 right-2 z-30">
            <SettingsButton navigation={navigation} />
          </View>
          <View className="w-1/4 py-5">
            <Image
              source={require("../assets/profile.jpeg")}
              className="w-full h-full aspect-auto"
            ></Image>
          </View>
          <View className="flex justify-between py-3">
            <View className="flex-row">
              <Text className="font-bold">Username: </Text>
              <Text>{username}</Text>
            </View>
            <View className="flex-row">
              <Text className="font-bold">Email: </Text>
              <Text>{email}</Text>
            </View>
            <View className="flex-row">
              <Text className="font-bold">Art Selected: </Text>
              <Text>{art}</Text>
            </View>
            <View className="flex-row">
              <View className="w-1/2 flex-row">
                <Image
                  source={require("../assets/low_poly_coin.png")}
                  className="w-5 h-5"
                />
                <Text>{coins}</Text>
              </View>
              <View className="w-1/2 flex-row">
                <Image
                  source={require("../assets/low_poly_diary.png")}
                  className="w-5 h-5"
                />
                <Text>{entries}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-row">
          <View className="items-center" style={{ height: 400 }}>
            <Text className="text-xl">Journal </Text>
            <CalendarView
              onDayPress={(date) => loadDailyJournal(date)}
              datesWithEntry={datesWithEntry}
            />
          </View>
          <View className="justify-center">
            <ModalJournal
              visible={isModalVisible}
              onRequestClose={closeModal}
              date={selectedDate.toString()}
              text={dailyJournal}
            />
          </View>
        </View>
        <View className="my-2 justify-center flex-row">
          <GoToItemsButton onPress={() => navigation.navigate("Items")} />
          <ResetPasswordButton
            onPress={(message) =>
              Toast.show({ type: "success", text1: message })
            }
            email={email}
          />
        </View>
        <View className="flex-row justify-between">
          <PrimaryButton
            title="Feedback"
            onPress={() => navigation.navigate("Feedback")}
          />
          <SignOutButton />
          <DeleteAccountButton onPress={deleteAccount} />
        </View>
      </DefaultScrollView>
      <Navbar classname="absolute -bottom-1" navigation={navigation} />
    </DefaultView>
  );
};

export default ProfileScreen;
