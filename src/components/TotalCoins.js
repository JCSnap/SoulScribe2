import React from "react";
import { View, Text, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "../backend/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import getUserData from "../utils/getUserData";

/**
 * Component that displays the total number of coins earned by the user.
 * It keeps track of the count by listening to changes in the user's data.
 */
export default class TotalCoins extends React.Component {
  state = {
    coins: 0,
  };

  componentDidMount() {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, "users", uid);

    /**
     * Listen to changes in the user's document and update the count on the screen.
     */
    this.unsubscribe = onSnapshot(userDocRef, (doc) => {
      this.setState({ coins: doc.data().coins });
    });
  }

  componentWillUnmount() {
    // Detach the listener when the component is unmounted
    this.unsubscribe();
  }

  render() {
    return (
      <View className="m-5">
        <View className="bg-white absolute h-12 w-2/6 rounded-lg items-center justify-center flex-row self-center">
          <Image
            source={require("../assets/low_poly_coin.png")}
            className="h-14 w-14"
          />
          <Text className="pr-5 font-bold text-2xl">{this.state.coins}</Text>
        </View>
      </View>
    );
  }
}
