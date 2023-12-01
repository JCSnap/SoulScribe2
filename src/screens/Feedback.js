import React from "react";
import Navbar from "../components/navbar/Navbar";
import { DefaultView } from "../components/View";
import Feedback from "../components/Feedback";
import { View } from "react-native";

/**
 * Feedback Screen where the user is directed to give feedback.
 */

const FeedbackScreen = ({ navigation }) => {
    return (
      <DefaultView>
        <Feedback />
        <Navbar navigation={navigation} />
      </DefaultView>
    );
};
  
export default FeedbackScreen;