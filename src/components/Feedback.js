import React, { useState} from "react";
import { Button } from "react-native-elements";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import getUserData from "../utils/getUserData";
import setUserData from "../utils/setUserData";
import { TextInput } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";

/**
 * Component for user to enter his/her journal entry.
 */
const Feedback = () => {
    const [feedback, setFeedback] = useState("");

    useFocusEffect(
        React.useCallback(() => {
          const fetchEntry = async () => {
            const userData = await getUserData();
            const oldFeedback = await userData.getFeedback();
            if (oldFeedback != "") {
              console.log(oldFeedback);
              setFeedback(oldFeedback);
            }
          };
          fetchEntry();
          return () => setFeedback("");
        }, [])
      );

    const editFeedback = async () => {
        try {
            const userDataSet = await setUserData();
            console.log("Adding Feedback: ", feedback);
            await userDataSet.updateFeedback(feedback);
            Toast.show({
                type: "success",
                text1: "Feedback saved!",
                text2: "Thanks for the feedback!",
              });
            
          } catch (error) {
            console.error("Error feedback: ", error);
          }
    }

    return (
      <View className="items-center">
        <View className="absolute z-50"><Toast /></View>
        <View className="bg-white border-2 border-zinc-600 m-6 h-96 w-80 z-30">
            <TextInput
                placeholder="Please input your feedback here!"
                onChangeText={setFeedback}
                value={feedback}
                multiline={true}
                autoCorrect={true}
                className="rounded-md m-2 pt-0 text-justify"
            />
        </View>
        <View className="mx-8 w-20">
            <Button title="Save" onPress={editFeedback}/>
        </View>
      </View>
    );
}

export default Feedback;
