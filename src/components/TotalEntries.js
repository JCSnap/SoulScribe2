import React from "react";
import { View, Text, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "../backend/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import getUserData from "../utils/getUserData";

/**
 * Component that displays the total number of entries made by the user.
 * It keeps track of the count by listening to changes in the user's data.
 */
export default class TotalEntries extends React.Component {
  state = {
    count: 0,
  };

  componentDidMount() {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, "users", uid);

    /**
     * Listen to changes in the user's document and update the count on the screen.
     */
    this.unsubscribe = onSnapshot(userDocRef, (doc) => {
      this.setState({ count: doc.data().entries });
    });
  }

  componentWillUnmount() {
    // Detach the listener when the component is unmounted
    this.unsubscribe();
  }

  render() {
    return (
      <View className="m-3 absolute" style={{ height: "5%" }}>
        <View className="bg-white h-30 w-30 rounded-lg items-center justify-center flex-row self-center">
          <Image
            source={require("../assets/low_poly_diary.png")}
            className="h-14 w-14"
          />
          <Text className="pr-5 font-bold text-2xl">{this.state.count}</Text>
        </View>
      </View>
    );
  }
}
