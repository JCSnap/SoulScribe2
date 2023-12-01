/**
 * Sign-in screen where the user can sign in with their email and password.
 */

import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut, verifyBeforeUpdateEmail } from "firebase/auth";
import { PrimaryButton } from "../components/Button";
import { CenteredView } from "../components/View";
import { DefaultTextInput, PasswordInput } from "../components/TextInput";
import { ErrorMessage } from "../components/Error";
import { DefaultText } from "../components/Text";

// Get the authentication instance
const auth = getAuth();

const SignInScreen = ({navigation, route}) => {
  const [value, setValue] = useState({
    email: "",
    password: "",
    error: "",
  });

  const [signUpDone, setSignUpDone] = useState(route.params?.signUpDone || false);
  const [signInClicked, setSignInClicked] = useState(false);

  useEffect(() => {
    // Update signUpDone when route.params changes and signInClicked is false
    if (!signInClicked) {
      setSignUpDone(route.params?.signUpDone || false);
    }
  }, [route.params?.signUpDone, signInClicked]);

  const prevValueRef = useRef(value);

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);
  
  const [newVerificationEmail, setNewVerificationEmail] = useState(false);

  const [emailSent, setEmailSent] = useState(false);

  const [user, setUser] = useState(null);

  // Function to handle the sign-in process
  async function signIn() {
    setSignUpDone(false);
    setSignInClicked(true);
    setNewVerificationEmail(false);
    console.log("signUpDone set to " + signUpDone)
    setEmailSent(false);
  
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }
  
    try {
      // Sign in the user with the provided email and password
      await signInWithEmailAndPassword(auth, value.email, value.password);
      setValue(prevValueRef.current);
    } catch (error) {
      // Handle sign-in errors here
      if (error.message == "Firebase: Error (auth/invalid-email).") {
        setValue({
          ...value,
          error: "Invalid email. Please try again.",
        });
      } else if (error.message == "Firebase: Error (auth/wrong-password).") {
        setValue({
          ...value,
          error: "Wrong password. Please try again.",
        });
      } else if (error.message == "Firebase: Error (auth/user-not-found).") {
        setValue({
          ...value,
          error: "User not found. Please register with this email.",
        });
      } else {
        setValue({
          ...value,
          error: error.message,
        });
      }
      console.log(error.message);
      return;
    }
  }

  useEffect(() => auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, check email verification status
      console.log(user.emailVerified + " + " + signUpDone);
      if (auth && !user.emailVerified && !signUpDone) {
        setNewVerificationEmail(true);
        setUser(user);
        signOut(auth);
        setValue({
          ...value,
          error: "Please verify your email before attempting to sign in again.",
        });
        console.log("veri is false");
        console.log(user.emailVerified);
      } else {
        console.log("email_verified is true");
        // Proceed with any further actions if needed
      }
    } else {
      console.log("auth is undefined");
      console.log("");
    }
    }), [user, signUpDone]);

  useEffect(() => {
    console.log("refresh")
  }, [])
  

  async function sendNewVerificationEmail() {
    setNewVerificationEmail(false)
    try {
      await sendEmailVerification(user)
      .then(setEmailSent(true)).then(console.log("email sent!"))
    } catch (error) {
      if (error.message == "Firebase: Error (auth/too-many-requests).") {
        setValue({
          ...value,
          error: "Too many verification emails sent. Please try again later.",
        });
      } else {
        setValue({
          ...value,
          error: error.message,
        });
      }
    }
    console.log(emailSent)
  }

  return (
    <CenteredView>
      <DefaultText>Sign in here!</DefaultText>

      {!!value.error && <ErrorMessage message={value.error} />}

      {!!signUpDone && 
        <View className="mt-3 p-3 w-3/4  bg-green-600">
          <Text className="text-white text-center">
            Sign-up successful! Please verify your email using the link
            sent to your email before you proceed further.
          </Text>
        </View>}

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
        <PrimaryButton title="Sign In" onPress={() => {signIn()}} />

        {!!newVerificationEmail && 
        <View className="mt-3 p-3 bg-blue-400 w-3/4">
          <Text className="text-white text-center">
            Would you like us to send you another verification email?
          </Text>
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              className="bg-green-400 w-24 h-8 m-2 border-2 flex-1"
              onPress={sendNewVerificationEmail}
            >
              <Text className="text-m text-center">Yes</Text>
            </TouchableOpacity>
      
            <TouchableOpacity
              className="bg-red-400 w-24 h-8 m-2 border-2 flex-1"
              onPress={() => setNewVerificationEmail(false)}
            >
              <Text className="text-m text-center">No</Text>
            </TouchableOpacity>
        </View>
      </View>}

        {!!emailSent && 
        <View className="mt-3 p-3 w-3/4">
          <Text className="text-white text-center">
            Email sent! Please use that link to verify your email.
          </Text>
        </View>}
      </View>
    </CenteredView>
  );
};

export default SignInScreen;
