/**
 * Sign-up screen where the user can sign up with their email and password.
 */

import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { StackScreenProps } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Timestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../backend/firebase/firebase";
import { PrimaryButton } from "../components/Button";
import { CenteredView } from "../components/View";
import { DefaultTextInput, PasswordInput } from "../components/TextInput";
import { ErrorMessage } from "../components/Error";
import { DefaultText } from "../components/Text";

// Get the authentication instance
const auth = getAuth();

const SignUpScreen = ({ navigation }) => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });
  const currDate = new Date();
  currDate.setDate(currDate.getDate() - 1);

  const date = Timestamp.fromDate(currDate);

  // Function to handle the sign-up process
  async function signUp() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      ).then(async (response) => {
        await sendEmailVerification(response.user)
        return response}
      ).then((response) => {
        // User is signed up successfully
        // Now create or update user data in Firestore
        const uid = response.user.uid;
        setDoc(doc(db, "users", uid), {
          // Use 'doc' to get a DocumentReference and 'setDoc' to write data
          uid: uid,
          email: value.email,
          coins: 1500,
          style: "postGrunge",
          entries: 0,
          home_character: "girlMysteriousUmbrella",
          home_pet: "dogGoldenRetrieverHappy",
          is_first_time: true,
          characters_unlocked: [],
          pets_unlocked: [],
          arts_unlocked: ["postGrunge", "miyazaki", "lowPolyGame", "lineArt"],
          last_journal_date: date,
          consecutive_days: 0,
          username: "",
          gender: "",
          feedback: "",
          // ...other user data...
        })
          .then(() => {
            console.log("Document written with ID: ", uid);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      });
      // Navigate to the sign-in screen after successful sign-up
      navigation.navigate("Sign In", {
        signUpDone: true,
      });
    } catch (error) {
      if (error.message == "Firebase: Error (auth/invalid-email).") {
        setValue({
          ...value,
          error: "Invalid email. Please provide a valid email.",
        });
      } else if (
        error.message ==
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        setValue({
          ...value,
          error: "Password should be at least 6 characters.",
        });
      } else if (
        error.message == "Firebase: Error (auth/email-already-in-use)."
      ) {
        setValue({
          ...value,
          error: "Email already has a registered account.",
        });
      } else {
        setValue({
          ...value,
          error: error.message,
        });
      }
      console.log(error.message);
    }
  }

  return (
    <CenteredView>
      <DefaultText>Sign up here!</DefaultText>

      {!!value.error && <ErrorMessage message={value.error} />}

      <View className="items-center">
        <DefaultTextInput
          placeholder="Email"
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
        />
        <PasswordInput
          placeholder="Password"
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
        />
        <PrimaryButton title="Sign up" onPress={signUp} />
      </View>
    </CenteredView>
  );
};

export default SignUpScreen;
