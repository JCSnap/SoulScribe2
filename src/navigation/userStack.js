import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/Home";
import WriteScreen from "../screens/Write";
import ProfileScreen from "../screens/Profile";
import RecapScreen from "../screens/Recap";
import ShopScreen from "../screens/Shop";
import ItemsScreen from "../screens/Items";
import TestRecap from "../screens/TestRecap";
import FeedbackScreen from "../screens/Feedback"
import SettingsScreen from "../screens/Settings"

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: "none" }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Write" component={WriteScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Recap" component={RecapScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="Items" component={ItemsScreen} />
        <Stack.Screen name="TestRecap" component={TestRecap} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
