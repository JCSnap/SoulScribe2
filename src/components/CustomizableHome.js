import React from "react";
import { View, Image } from "react-native";
import { CUSTOMIZABLE_IMAGES } from "../constants/Shop";
import { onSnapshot } from "firebase/firestore";
import getUserData from "../utils/getUserData";

/**
 * Customizable homepage.
 */
export default class CustomizableHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      character: null,
      pet: null,
    };
    this.unsubscribe = null; // Initialize unsubscribe as null
  }

  async componentDidMount() {
    // Retrieve user data and user document reference
    const userData = await getUserData();
    const userDocRef = userData.getUserDocRef();

    // Listen for changes in the user document
    this.unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const character = userData.home_character;
        const pet = userData.home_pet;

        // Updates the state with the retrieved character and pet
        this.setState({
          character: CUSTOMIZABLE_IMAGES.characters[character].path,
          pet: CUSTOMIZABLE_IMAGES.pets[pet].path,
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  componentWillUnmount() {
    // Stop listening for updates when the component is unmounted
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return (
      <View className="mt-12 h-2/3 w-full justify-end">
        <Image
          source={this.state.character}
          className="w-full h-full"
          resizeMode="cover"
        />
        <Image
          source={this.state.pet}
          className="h-2/5 w-2/5 absolute left-10"
        />
      </View>
    );
  }
}
