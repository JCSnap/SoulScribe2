/**
 * Welcome screen where the user is directed to upon opening the app.
 */

import React, { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { StackScreenProps } from "@react-navigation/native-stack";
import { PrimaryButton } from "../components/Button";
import { CenteredView } from "../components/View";
import { DefaultText } from "../components/Text";
import { useDispatch } from "react-redux";
import { reset } from "../redux/Profile";

const WelcomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reset());
  })
  return (
    <CenteredView>
      <DefaultText>Welcome to Soulscribe!</DefaultText>

      <Image 
        className="w-60 h-60"
        source={require('../assets/low_poly_book_midjourney.png')} 
      />

      <View>
        {/* Sign-in button */}
        <PrimaryButton
          title="Sign in"
          onPress={() => navigation.navigate("Sign In")}
        />
        
        {/* Sign-up button */}
        <PrimaryButton
          title="Sign up"
          type="outline"
          onPress={() => navigation.navigate("Sign Up")}
        />
      </View>
    </CenteredView>
  );
};

export default WelcomeScreen;
