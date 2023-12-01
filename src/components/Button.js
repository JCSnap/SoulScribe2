import React, { useState } from "react";
import { Button } from "react-native-elements";
import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import { View, Text, Dimensions, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux"; 

// Get the authentication instance from Firebase
const auth = getAuth();

// A reusable primary button component
export const PrimaryButton = ({ onPress, title }) => (
  <TouchableOpacity
    className="bg-blue-500 m-2 justify-center"
    style={{
      padding: 5,
      borderRadius: 8,
      width: (Dimensions.get("window").width * 2) / 7,
    }}
    onPress={onPress}
  >
    <Text className="text-base text-center text-white">{title}</Text>
  </TouchableOpacity>
);

// A reusable secondary button component
export const SecondaryButton = ({ onPress, title }) => (
  <TouchableOpacity
    className="bg-blue-500 w-24 h-8 m-2 border-2 border-sky-700"
    onPress={onPress}
  >
    <Text className="text-xl text-center">{title}</Text>
  </TouchableOpacity>
);

// A customizable reusable secondary button component
export const ColourableSecondaryButton = ({ onPress, title, colour }) => (
  <TouchableOpacity
    className={`${colour} w-24 h-8 m-2 border-2 border-sky-700`}
    onPress={onPress}
  >
    <Text className="text-xl text-center">{title}</Text>
  </TouchableOpacity>
);

// A button component for signing out
export const SignOutButton = () => {
  return (
  <PrimaryButton
    title="Sign Out"
    onPress={() => {
      // Sign out the user using the authentication instance
      signOut(auth).then(() => navigation.navigate("Sign Out"));
    }}
  />)
  };

// A button component for writing
export const WriteButton = ({ onPress }) => (
  <TouchableOpacity
    className="m-2 bg-black rounded-lg w-1/4 justify-center items-center"
    style={{ height: "7%" }}
    onPress={onPress}
  >
    <Text className="text-white text-2xl">Write</Text>
  </TouchableOpacity>
);

// A button component for navigating to user's items
export const GoToItemsButton = ({ onPress }) => (
  <TouchableOpacity
    className="m-2 bg-black rounded-lg justify-center items-center w-4/12 h-16"
    onPress={onPress}
  >
    <Text className="text-white text-xl font-bold">Your items</Text>
  </TouchableOpacity>
);

export const SaveButton = ({ onPress }) => {
  return (
    <TouchableOpacity className="p-2 bg-black" onPress={onPress}>
      <Text className="text-white text-2xl">SAVE</Text>
    </TouchableOpacity>
  );
};

export const DeleteAccountButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="m-2 bg-red-600 rounded-lg justify-center items-center w-4/12 h-16"
      style={{
        padding: 5,
        borderRadius: 8,
        width: (Dimensions.get("window").width * 2) / 7,
      }}
      onPress={onPress}
    >
      <Text className="text-white text-md">DELETE ACCOUNT</Text>
    </TouchableOpacity>
  );
};

export const ResetPasswordButton = ({ onPress, email }) => {
  return (
    <TouchableOpacity
    className="m-2 bg-red-500 rounded-lg justify-center items-center w-4/12 h-16"
    onPress = {() => {
      if (email == "soulscribeofficial@gmail.com") {
        onPress("Reset Password is disabled on this guest account.")
      } else {
        sendPasswordResetEmail(auth, email)
        .then(() => {
          onPress("Please check your email to reset your password!")
          console.log("email sent!")
        })
        .catch((error) => {
          onPress(error.message)
          console.log(error.message)
        })
      }}}>
        <Text className="text-white text-xl font-bold text-center">Reset Password</Text>
    </TouchableOpacity>
  )
}

export const SettingsButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {navigation.navigate("Settings")}}>
        <Ionicons
          name="settings-sharp"
          size={32}
          />
      </TouchableOpacity>
  )
}