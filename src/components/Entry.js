import React, { useState } from "react";
import { EntryInput } from "../components/TextInput";
import { DefaultDivider } from "./View";
import { Alert, TouchableOpacity, Text, View } from "react-native";
import getUserData from "../utils/getUserData";
import setUserData from "../utils/setUserData";
import { useFocusEffect } from "@react-navigation/native";
import GenerateRecapInterface from "./GenerateRecapInterface";
import Toast from "react-native-toast-message";
import convertEntryToVector from "../utils/convertEntryToVector";
import { useDispatch } from "react-redux";
import { addDailyEntry, addCoins } from "../redux/Profile"
/**
 * Component for user to enter his/her journal entry.
 */
const Entry = ({ navigation }) => {
  const [entry, setEntry] = useState("");
  const [date, setDate] = useState(new Date());
  const [isDisabled, setIsDisabled] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      const fetchEntry = async () => {
        const userData = await getUserData();
        const today = new Date();
        today.setHours(today.getHours() + 8);
        setDate(today);
        console.log(today.getMinutes());
        const entryDocSnap = await userData.getEntryDocSnap(today);
        if (entryDocSnap.exists()) {
          const entryData = entryDocSnap.data();
          console.log(entryData.text);
          setEntry(entryData.text);
        }
      };

      fetchEntry();

      return () => setEntry(""); // cleanup
    }, [])
  );

  const addEntry = async () => {
    // Get user data and last journal date
    const userDataGet = await getUserData();
    const lastDate = await userDataGet.getLastJournalDate().toDate();
    const userId = await userDataGet.getUserId();
    let consecutiveDays = await userDataGet.getConsecutiveDays();
    let coinsEarned = 0;
    try {
      let firstEntry = false;
      const userDataSet = await setUserData();
      let newEntry = {
        text: entry,
        date: date,
      };
      await userDataSet.setJournalEntry(newEntry);
      await convertEntryToVector(entry, date, userId);

      // Update coins and consecutive days if applicable
      const currDate = new Date();
      currDate.setHours(0, 0, 0, 0);

      // Updates for first entry of the day
      if (currDate.toDateString() != lastDate.toDateString()) {
        firstEntry = true;
        // Update number of entries
        await userDataSet.updateEntries();
        dispatch(addDailyEntry());
        const difference = currDate.getTime() - lastDate.getTime();
        const entryIsMadeYesterday =
          Math.ceil(difference / (1000 * 3600 * 24)) == 1;

        if (entryIsMadeYesterday) {
          consecutiveDays += 1;
        } else {
          consecutiveDays = 1;
        }

        await userDataSet.updateConsecutiveDays(consecutiveDays);

        // Add coins based on consecutive days (up to a maximum of 10 coins)
        coinsEarned = consecutiveDays <= 5 ? consecutiveDays * 2 : 10;
        await userDataSet.addCoins(coinsEarned);
        dispatch(addCoins(coinsEarned))

        // Update the last journal date to the current date
        userDataSet.updateLastJournalDate(currDate);

        // Update the dates with entries
        userDataSet.updateDatesWithEntry(currDate);
        console.log(currDate);
      }
      return [firstEntry, consecutiveDays, coinsEarned];
    } catch (error) {
      console.error("Error adding journal document: ", error);
      Alert.alert(
        "Error",
        "An error occurred while saving your entry, please try again! " +
          error.message
      );
    }
  };

  const saveAndExit = async () => {
    if (isDisabled) {
      return;
    }
    setIsDisabled(true);
    const regex = /\S+/g;
    const tokens = entry.match(regex);
    const tokenCount = tokens.length;
    console.log(tokenCount);
    if (tokenCount < 10) {
      Toast.show({
        type: "error",
        text1: "❌ Entry needs a minimum of 10 tokens",
        text2: "Please write the minimum token length before saving.",
      });
      setIsDisabled(false);
    } else if (tokenCount >= 4096) {
      Toast.show({
        type: "error",
        text1: "❌ Entry exceeded token limit of 4096",
        text2: "Please shorten it before saving again.",
      });
      setIsDisabled(false);
    } else {
      const data = await addEntry();
      navigation.navigate("Home", {
        showToast: true,
        firstEntry: data[0],
        consecutiveDays: data[1],
        coinsEarned: data[0] ? data[2] : 0,
      });
      setIsDisabled(false);
    }
  };

  // Later in your code, when you want to display the date:
  const readableDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View className="flex-1 w-11/12">
      <View className="z-20 m-0">
        <Toast />
      </View>
      <View className="flex-row justify-between mt-2 mx-2">
        <Text className="font-bold text-3xl self-center">{readableDate}</Text>
        <TouchableOpacity onPress={saveAndExit}>
          <View
            className={`w-28 h-10 rounded-2xl justify-center ${
              isDisabled ? "bg-gray-600" : "bg-blue-500"
            }`}
          >
            <Text className="text-white text-2xl self-center">Save</Text>
          </View>
        </TouchableOpacity>
      </View>
      <DefaultDivider />
      <EntryInput value={entry} onChangeText={setEntry} />
      <GenerateRecapInterface
        navigation={navigation}
        text={entry}
        date={date}
      />
    </View>
  );
};

export default Entry;
