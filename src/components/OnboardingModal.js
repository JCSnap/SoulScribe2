import Carousel from "react-native-snap-carousel";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { DefaultView } from "./View";

const OnboardingModal = (props) => {
  const carouselRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState("#cdb4db");
  const [activeIndex, setActiveIndex] = useState(0);
  const backgroundColors = [
    "#cdb4db",
    "#ffc8dd",
    "#ffafcc",
    "#bde0fe",
    "a2d2ff",
  ];

  const [pages] = useState([
    {
      title: "Write your first entry!",
      description: "Press the 'Write' button to get started.",
      image: require("../assets/onboarding/homescreen.png"),
    },
    {
      title: "Save or Test!",
      description:
        "Save your entry by pressing the 'Done' button. You can also test the AI recap by pressing the 'Test Recap' button. Note that pressing 'Test Recap' will not save your entry.",
      image: require("../assets/onboarding/write.png"),
    },
    {
      title: "Select your art style!",
      description:
        "Choose your art style by going to your profile page. This will decide the art that is used to generate your recap!",
      image: require("../assets/onboarding/items.png"),
    },
    {
      title: "View your recap!",
      description:
        "A summary and art will be generated at the end of every week based on your entries. You can view them at the 'Recap' page!",
      image: require("../assets/onboarding/recap.png"),
    },
    {
      title: "Earn coins!",
      description:
        "Earn coins by journaling and doing it consistently! Use them to buy items and art styles! Consult the chatbot if you have more questions.",
      image: require("../assets/onboarding/chatbot.png"),
    },
  ]);

  const toNewPage = (index) => {
    setActiveIndex(index);
    setBackgroundColor(backgroundColors[index]);
  };

  const goToNextPage = () => {
    this._carousel.snapToNext();
    toNewPage(activeIndex + 1);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View className="flex-1 justify-center">
        <View className="justify-center items-center">
          <Image
            source={item.image}
            className="w-72 h-2/3"
            resizeMode="contain"
          />
          <Text className="font-bold text-xl">{item.title}</Text>
          <Text className="pt-3 text-lg">{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View
      className="absolute z-50 bg-white h-full w-full items-center"
      style={{ backgroundColor: backgroundColor }}
    >
      <Carousel
        data={pages}
        renderItem={renderItem}
        sliderWidth={Dimensions.get("window").width - 100}
        itemWidth={Dimensions.get("window").width - 100}
        layout={"default"}
        onSnapToItem={(index) => toNewPage(index)}
        ref={(c) => {
          this._carousel = c;
        }}
      />
      <View className="w-full px-20 pb-10 flex-row justify-between">
        <TouchableOpacity onPress={props.closeModal}>
          <Text className="text-white text-lg">Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={
            activeIndex == pages.length - 1 ? props.closeModal : goToNextPage
          }
        >
          {activeIndex == pages.length - 1 ? (
            <Text className="text-black text-lg">Done</Text>
          ) : (
            <Text className="text-black text-lg">Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingModal;
