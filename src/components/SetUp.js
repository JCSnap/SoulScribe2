/**
 * Pop up to get first time users to set default settings
 */

import React, { useState } from "react";
import ArtStyleCarousel from "./ArtStyleCarousel";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { SaveButton } from "./Button";
import setUserData from "../utils/setUserData";

const SetUp = ({ onSave, toggleOnboarding }) => {
  const [value, setValue] = useState({
    username: "",
    artStyle: "",
  });
  const [gender, setGender] = useState("Male");
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const updateUserInfo = async () => {
    const userData = await setUserData();
    if (value.username == "") {
      Alert.alert("Please enter a username!");
      return;
    }
    await userData.setUsername(value.username);
    await userData.setGender(gender);
    await userData.setHomeCharacter(
      gender == "Male" ? "boyHoodieBigBackpack" : "girlMysteriousUmbrella"
    );
    await userData.setHomePet("dogGoldenRetrieverHappy");
    await userData.addCharactersUnlocked(
      gender == "Male" ? "boyHoodieBigBackpack" : "girlMysteriousUmbrella"
    );
    await userData.addPetsUnlocked("dogGoldenRetrieverHappy");
    await userData.setFirstTime(false);
    toggleOnboarding();
    onSave();
  };

  return (
    <Modal
      visible={isModalVisible}
      onRequestClose={closeModal}
      transparent={true}
      statusBarTranslucent={true}
      avoidKeyboard={false}
    >
      <View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          height: Dimensions.get("screen").height,
        }}
      >
        <View className="z-20 flex-1 justify-center absolute w-11/12 h-5/6 bg-white items-center rounded-3xl px-5">
          <Text className="font-bold pb-4">
            Please give us some of your information to get started!
          </Text>
          <View className="items-center w-full h-3/4">
            <Text className="text-3xl">Username</Text>
            <TextInput
              placeholder="What should we call you?"
              value={value.username}
              onChangeText={(text) => setValue({ ...value, username: text })}
              key="UsernameInput"
              className={`text-2xl w-full text-center border-2 ${
                value.username != "" ? "border-green-300" : "border-gray-300"
              }`}
            />

            <Text className="text-3xl mt-3">Gender</Text>
            <View className="flex-row justify-center w-full h-2/5">
              <TouchableOpacity
                onPress={() => setGender("Male")}
                className={`w-1/2 h-full items-center ${
                  gender == "Male" ? "border-2 border-green-300" : ""
                }`}
              >
                <Text className="">Male</Text>
                <Image
                  source={require("../assets/customizable_home/low_poly_boy_bag.png")}
                  className="w-full h-full"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender("Female")}
                className={`w-1/2 h-full items-center ${
                  gender == "Female" ? "border-2 border-green-300" : ""
                }`}
              >
                <Text className="">Female</Text>
                <Image
                  source={require("../assets/customizable_home/low_poly_girl_umbrella.png")}
                  className="w-full h-full"
                />
              </TouchableOpacity>
            </View>
            <ArtStyleCarousel />
            <SaveButton onPress={updateUserInfo} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SetUp;
