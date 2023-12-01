/**
 * Shop Screen: Allows the user to purchase items.
 */

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { ART_STYLES, CUSTOMIZABLE_IMAGES } from "../constants/Shop";
import ModalItem from "../components/ModalItem";
import Navbar from "../components/navbar/Navbar";
import getUserData from "../utils/getUserData";
import setUserData from "../utils/setUserData";
import Toast from "react-native-toast-message";
import TotalCoins from "../components/TotalCoins";
import { DefaultScrollView } from "../components/View";
import DraggableChatBot from "../components/ChatBot";
import { useSelector, useDispatch } from "react-redux";
import { deductCoins } from "../redux/Profile";
import ChatInterface from "../components/ChatInterface";

// Item component
const Item = ({ path, title, onPress, isUnlocked }) => (
  <View
    className="items-center w-1/3"
    style={isUnlocked ? { backgroundColor: "white" } : {}}
  >
    <Image source={path} className="w-32 h-32" onTouchEnd={onPress} />
    <Text>{title}</Text>
  </View>
);

// Category component
const Category = ({ title, items, openModal }) => (
  <View className="pt-4">
    <Text className="font-bold text-lg text-center">{title}</Text>
    <View className="flex-row flex-wrap">
      {Object.entries(items).map(([key, item], index) => (
        <Item
          key={index}
          path={item.path}
          title={item.title}
          onPress={() => openModal(item)}
          isUnlocked={item.isUnlocked}
        />
      ))}
    </View>
  </View>
);

const ShopScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [charactersUnlocked, setCharactersUnlocked] = useState([]);
  const [petsUnlocked, setPetsUnlocked] = useState([]);
  const [artsUnlocked, setArtsUnlocked] = useState([]);

  const dispatch = useDispatch();

  const chatOpen = useSelector((state) => state.chatbot.chatOpen);

  // Open the modal for the selected item
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Handle item purchase
  const purchaseItem = async () => {
    const userDataGet = await getUserData();
    const coins = await userDataGet.getCoins();

    // Retrieve unlocked items for different categories
    const charactersUnlocked = userDataGet.getCharactersUnlocked();
    const petsUnlocked = userDataGet.getPetsUnlocked();
    const artsUnlocked = userDataGet.getArtsUnlocked();

    // Check if the item is already unlocked or if the user has enough coins
    if (
      charactersUnlocked.includes(selectedItem.id) ||
      petsUnlocked.includes(selectedItem.id) ||
      artsUnlocked.includes(selectedItem.id)
    ) {
      alert("Item already unlocked!");
      return;
    } else if (coins < selectedItem.cost) {
      alert("Not enough coins!");
      return;
    } else {
      // Show a success message using Toast
      Toast.show({
        type: "success",
        text1: "Purchase confirmation",
        text2: `${selectedItem.title} is now unlocked! 🥳`,
      });

      // Deduct the item cost from the user's coins
      const type = selectedItem.type;
      const userDataSet = await setUserData();
      userDataSet.deductCoins(selectedItem.cost);
      dispatch(deductCoins(selectedItem.cost));

      // Add the unlocked item to the appropriate category
      switch (type) {
        case "character":
          await userDataSet.addCharactersUnlocked(selectedItem.id);
          break;
        case "pet":
          await userDataSet.addPetsUnlocked(selectedItem.id);
          break;
        case "art":
          await userDataSet.addArtsUnlocked(selectedItem.id);
          break;
        // Add cases for other types of items if needed
        default:
          console.log("Item type not recognized");
      }
    }

    closeModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserData();
      const characters = userData.characters_unlocked || [];
      const pets = userData.pets_unlocked || [];
      const arts = userData.arts_unlocked || [];

      // Map and set unlocked characters
      setCharactersUnlocked(
        Object.entries(CUSTOMIZABLE_IMAGES.characters).reduce(
          (acc, [id, character]) => ({
            ...acc,
            [id]: { ...character, isUnlocked: characters.includes(id) },
          }),
          {}
        )
      );

      // Map and set unlocked pets
      setPetsUnlocked(
        Object.entries(CUSTOMIZABLE_IMAGES.pets).reduce(
          (acc, [id, pet]) => ({
            ...acc,
            [id]: { ...pet, isUnlocked: pets.includes(id) },
          }),
          {}
        )
      );

      // Map and set unlocked arts
      setArtsUnlocked(
        Object.entries(ART_STYLES).reduce(
          (acc, [id, art]) => ({
            ...acc,
            [id]: { ...art, isUnlocked: arts.includes(id) },
          }),
          {}
        )
      );
    };

    fetchData();
  }, []);

  const data = {
    Characters: charactersUnlocked,
    Pets: petsUnlocked,
    Arts: artsUnlocked,
  };

  const bg_colour = useSelector((state) => state.profile.bg_colour)

  return (
    <View className="flex-1">
      <View className="z-20">
        <Toast />
      </View>
      {!chatOpen && <DraggableChatBot />}
      {chatOpen && <ChatInterface />}
      <View className={`${bg_colour} h-20`}>
        <TotalCoins className="flex-1 z-50" />
      </View>
      <DefaultScrollView>
        {Object.entries(data).map(([category, items], index) => (
          <Category
            key={index}
            title={category}
            items={items}
            openModal={openModal}
          />
        ))}
        <ModalItem
          visible={isModalVisible}
          onRequestClose={closeModal}
          item={selectedItem}
          actionButtonTitle="BUY"
          onActionButtonPress={purchaseItem}
          screen="shop"
        />
      </DefaultScrollView>
      <Navbar navigation={navigation} />
    </View>
  );
};

export default ShopScreen;
