/**
 * Items Screen: Displays a list of items that users can purchase.
 */

import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../backend/firebase/firebase";
import { ART_STYLES, CUSTOMIZABLE_IMAGES } from "../constants/Shop";
import ModalItem from "../components/ModalItem";
import setUserData from "../utils/setUserData";
import { DefaultScrollView } from "../components/View";
import { useDispatch } from "react-redux";
import { changeArtSelected } from "../redux/Profile";

// Item component
const Item = ({ path, title, onPress, isActive }) => (
  <View className={`items-center w-1/3 ${isActive ? "bg-white" : ""}`}>
    <Image source={path} className="w-32 h-32" onTouchEnd={onPress} />
    <Text>{title}</Text>
  </View>
);

// Category component
const Category = ({
  title,
  items,
  openModal,
  homeCharacter,
  homePet,
  curArt,
}) => (
  <View className="pt-4">
    <Text className="font-bold text-lg text-center">{title} Unlocked</Text>
    <View className="flex-row flex-wrap">
      {Object.entries(items).map(([key, item], index) => (
        <Item
          key={index}
          path={item.path}
          title={item.title}
          onPress={() => openModal(item)}
          isActive={
            item.id === homeCharacter ||
            item.id === homePet ||
            curArt === item.id
          }
        />
      ))}
    </View>
  </View>
);

const ItemsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  // State to control the modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State to hold the selected item
  const [selectedItem, setSelectedItem] = useState(null);

  const [charactersUnlocked, setCharactersUnlocked] = useState([]);
  const [petsUnlocked, setPetsUnlocked] = useState([]);
  const [artsUnlocked, setArtsUnlocked] = useState([]);

  const [homeCharacter, setHomeCharacter] = useState(null);
  const [homePet, setHomePet] = useState(null);
  const [curArt, setCurArt] = useState(null);

  // Function to open the modal
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Function to use the item
  const useItem = () => {
    updateItem(selectedItem);
    closeModal();
  };

  // Update item function
  const updateItem = async (item) => {
    const userData = await setUserData();
    if (item.type === "character") {
      await userData.setHomeCharacter(item.id);
    } else if (item.type === "pet") {
      const home_pet = "home_pet";
      await userData.setHomePet(item.id);
    } else if (item.type === "artStyle") {
      const userData = await setUserData();
      await userData.setArtStyle(item.id);
      dispatch(changeArtSelected(item.title));
    } else {
      console.log("Item type not recognized");
    }
  };

  useEffect(() => {
    // Fetch user data and update state
    const fetchData = async () => {
      const auth = getAuth();
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, "users", uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists) {
          const userData = doc.data();
          const characters = userData.characters_unlocked || [];
          const pets = userData.pets_unlocked || [];
          const arts = userData.arts_unlocked || [];
          setHomeCharacter(userData.home_character);
          setHomePet(userData.home_pet);
          setCurArt(userData.style);

          setCharactersUnlocked(
            characters.reduce(
              (acc, character) => ({
                ...acc,
                [character]: CUSTOMIZABLE_IMAGES.characters[character],
              }),
              {}
            )
          );
          setPetsUnlocked(
            pets.reduce(
              (acc, pet) => ({
                ...acc,
                [pet]: CUSTOMIZABLE_IMAGES.pets[pet],
              }),
              {}
            )
          );
          setArtsUnlocked(
            arts.reduce(
              (acc, art) => ({
                ...acc,
                [art]: ART_STYLES[art],
              }),
              {}
            )
          );
        } else {
          console.log("No such document!");
        }
      });

      // Cleanup function to unsubscribe from the listener when the component is unmounted
      return () => unsubscribe();
    };

    fetchData();
  }, []);

  // Assuming you fetch your data here and have it in a format like this:
  const data = {
    Characters: charactersUnlocked,
    Pets: petsUnlocked,
    Arts: artsUnlocked,
  };

  return (
    <DefaultScrollView className="mb-10">
      {Object.entries(data).map(([category, items], index) => (
        <Category
          key={index}
          title={category}
          items={items}
          openModal={openModal}
          homeCharacter={homeCharacter}
          homePet={homePet}
          curArt={curArt}
        />
      ))}
      <ModalItem
        visible={isModalVisible}
        onRequestClose={closeModal}
        item={selectedItem}
        actionButtonTitle="USE"
        onActionButtonPress={useItem}
        screen="item"
      />
    </DefaultScrollView>
  );
};

export default ItemsScreen;
