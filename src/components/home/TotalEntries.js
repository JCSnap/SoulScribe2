import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "src/backend/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const TotalEntries = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, "users", uid);

    // This implementation is required because users might add an entry after the home screen is loaded
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      setCount(doc.data().entries);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View className="m-3 absolute" style={{ height: "5%" }}>
      <View className="bg-white h-30 w-30 rounded-lg items-center justify-center flex-row self-center">
        <Image
          source={require("src/assets/low_poly_diary.png")}
          className="h-14 w-14"
        />
        <Text className="pr-5 font-bold text-2xl">{count}</Text>
      </View>
    </View>
  );
};

export default TotalEntries;
