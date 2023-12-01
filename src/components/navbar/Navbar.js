import React, { useCallback } from "react";
import { View, Text, Image, Button } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";

/**
 * Navigation bar containing buttons to other screens.
 */
const Navbar = () => {
  const navigation = useNavigation();
  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );

  const goToScreen = useCallback((screenName) => {
    navigation.navigate(screenName);
  }, []);

  const links = [
    {
      title: "Home",
      icon: require("../../assets/navbar/home.png"),
      function: () => goToScreen("Home"),
    },
    {
      title: "Shop",
      icon: require("../../assets/navbar/shop.png"),
      function: () => goToScreen("Shop"),
    },
    {
      title: "Write",
      icon: require("../../assets/navbar/write.png"),
      function: () => goToScreen("Write"),
    },
    {
      title: "Recap",
      icon: require("../../assets/navbar/recap.png"),
      function: () => goToScreen("Recap"),
    },
    {
      title: "Profile",
      icon: require("../../assets/navbar/profile.png"),
      function: () => goToScreen("Profile"),
    },
  ];

  return (
    <View className="h-12">
      <View
        id="navbar-container"
        className="flex-1 px-2 bg-white w-full flex-row border-t-2 border-t-gray-300"
      >
        {links.map((link, index) => (
          <View
            id="individual-containers"
            className="flex-1 justify-center"
            key={index}
          >
            <TouchableOpacity
              onPress={link.function}
              className={`items-center h-full justify-center ${
                routeName === link.title ? "bg-gray-300" : ""
              }`}
            >
              <Image source={link.icon} className="w-6 h-6" />
              <Text
                className={`text-xs ${
                  routeName === link.title ? "font-bold" : "text-black"
                }`}
              >
                {link.title}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Navbar;
