import React from "react";
import { Text, View } from "react-native";

/**
 * Component for displaying an error message.
 * 
 * @param {string} message - The error message to display.
 */
export const ErrorMessage = ({ message }) => (
  <View className="mt-3 p-3 bg-red-400 w-3/4">
    <Text className="text-white text-center">{message}</Text>
  </View>
);
