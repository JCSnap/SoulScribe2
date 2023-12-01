import React, { useState, useEffect, Alert } from "react";
import { View, Text, Modal, Button, Dimensions } from "react-native"
import Navbar from "../components/navbar/Navbar";
import { DefaultView, SettingsView } from "../components/View";
import setUserData from "../utils/setUserData";
import getUserData from "../utils/getUserData";
import { DefaultText, TitleText } from "../components/Text";
import { ColourableSecondaryButton, SecondaryButton, PrimaryButton } from "../components/Button";
import { DefaultTextInput } from "../components/TextInput"
import { useDispatch, useSelector } from "react-redux";
import { changeUsername, changeGender, changeColour } from "../redux/Profile"

/**
 * Settings Screen where the user is directed to give feedback.
 */

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [mostRecentUpdate, setMostRecentUpdate] = useState("");

  const [genderVisible, setGenderVisible] = useState(false);
  const [usernameVisible, setUsernameVisible] = useState(false);

  const username = useSelector((state) => state.profile.username)
  const gender = useSelector((state) => state.profile.gender)
  const backgroundColour = useSelector((state) => state.profile.bg_colour)

  const openModal = (modalOpener) => {
    modalOpener();
  }

  const userDataSet = setUserData();

  const updateUserInfo = async (string) => {
      try {
        const userDataSet = await setUserData();
        console.log("updating data")
        if (string == "Gender") {
          await userDataSet.setGender(gender);
        } else if (string == "Username") {
          await userDataSet.setUsername(username);
          console.log("username updated!")
        } else if (string == "BackgroundColour") {
          await userDataSet.setBackgroundColour(backgroundColour);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
  };

  const windowWidth = Dimensions. get('window')

  const SettingRow = ({ title, data, onPress, index }) => (
    <View className={`flex flex-row justify-between items-center w-full`}>
      <View className="left-5">
        <Text className="text-xl">{title}: {data}</Text>
      </View>
      <View className="relative right-0">
        <PrimaryButton onPress={onPress} title={`Change my ${title}`}></PrimaryButton>
      </View>
    </View>
  );

  const ModalGender = () => {
    const userDataSet = setUserData();
    return (
      <Modal visible={genderVisible} transparent={true}>
        <View
        className="flex-1 justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="h-1/3 bg-white rounded-xl mx-10 items-center bg-cover">
              <Text className="text-xl my-5">Your current gender is: {gender}</Text>
              <DefaultText>Select your gender below:</DefaultText>
              <View className="flex-row items-center">
                <PrimaryButton onPress={() => dispatch(changeGender("Male"))} title={"Male"} />
                <PrimaryButton onPress={() => dispatch(changeGender("Female"))} title={"Female"} />
              </View>
            <View className="absolute bottom-2 right-2 z-30">
              <Button title="Exit" onPress={() => {setGenderVisible(false), updateUserInfo("Gender")}} className="mr-5 mb-10"/>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  
  const ModalUsername = () => {
    return (
      <Modal visible={usernameVisible} transparent={true} statusBarTranslucent={true} avoidKeyboard={false}>
        <View
        className="flex-1 justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="h-1/3 bg-white rounded-xl mx-10 items-center bg-cover">
              <Text className="text-xl my-5">Your current username is: {username}</Text>
              <DefaultText>Type your new username below:</DefaultText>
              <View className="flex-row items-center">
                <DefaultTextInput placeholder="Type your new username here" value={username} onChangeText={(text) => dispatch(changeUsername(text))} />
              </View>
            <View className="absolute bottom-2 right-2 z-30">
              <Button title="Exit" onPress={() => {setUsernameVisible(false), updateUserInfo("Username")}} className="mr-5 mb-10"/>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  

  const Settings = [
    {index: 1, name: "Gender", data: gender, setOpen: setGenderVisible, modal: ModalGender, visible: genderVisible},
    {index: 2, name: "Username", data: username, setOpen: setUsernameVisible, modal: ModalUsername, visible: usernameVisible},
  ]

    return (
      <DefaultView>
        <SettingsView>
          <View className="items-center">
            <TitleText>Settings</TitleText>
          </View>
            {Settings.map((setting) => (
            <SettingRow 
              key={setting.name} 
              data={setting.data} 
              title={setting.name} 
              onPress={() => openModal(setting.setOpen)}
              index={setting.index} 
              marginBottom={setting.index !== Settings.length ? 20 : 0}
              />
            ))}
            {Settings.map((setting) => (
            setting.modal()
            ))}
          </SettingsView>
        <Navbar navigation={navigation} />
      </DefaultView>
    );
};
  
export default SettingsScreen;