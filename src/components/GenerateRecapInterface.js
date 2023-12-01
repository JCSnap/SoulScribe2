import React from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import setUserData from "../utils/setUserData";

/**
 * Component that navigates to the "TestRecap" screen.
 */
const GenerateRecapInterface = ({ navigation, text, date }) => {
  const newEntry = {
    text: text,
    date: date,
  };

  const goToTestRecapScreen = async () => {
    // Check if entry is less than 30 characters
    if (text.length < 30) {
      Alert.alert("Entry should be more than 30 characters!");
      return;
    }
    const userData = await setUserData();
    await userData.setJournalEntry(newEntry);
    navigation.navigate("TestRecap", { text: text, date: date });
  };

  return (
    <View className="bg-black w-52 h-16 mt-auto justify-center mb-6 self-center rounded-lg">
      <TouchableOpacity onPress={goToTestRecapScreen}>
        <Text className="text-xl self-center text-white">
          Test Generate Recap
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenerateRecapInterface;
