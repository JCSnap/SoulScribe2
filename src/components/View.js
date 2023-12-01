import React from "react";
import { View, ScrollView } from "react-native";
import { useSelector } from "react-redux";



/**
 * Component for a centered view with default settings.
 */
export const CenteredView = ({ children }) => {
  const bg_colour = useSelector((state) => state.profile.bg_colour)
  return (
    <View className={`flex-1 ${bg_colour} items-center justify-center`}>
    {children}
    </View>
  )
};

/**
 * Component for a default view with primary color styling.
 */
export const DefaultView = ({ children }) => {
  const bg_colour = useSelector((state) => state.profile.bg_colour)
  return (
  <View className={`flex-1 ${bg_colour} items-center justify-between`}>
    {children}
  </View>
  )
};

export const SettingsView = ({ children }) => {
  const bg_colour = useSelector((state) => state.profile.bg_colour)
  return (
  <View className={`flex-1 ${bg_colour} w-full`}>
    {children}
  </View>
  )
};

/**
 * Component for a default scrollable view with primary color styling.
 */
export const DefaultScrollView = ({ children }) => {
  const bg_colour = useSelector((state) => state.profile.bg_colour)
  return (
  <ScrollView className={`${bg_colour} w-full`}>{children}</ScrollView>
  )
};

export const DefaultDivider = () => (
  <View className="h-1 bg-slate-200 my-2"></View>
);
