import React, { useState, useRef } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import Carousel from "react-native-snap-carousel";
import { View, Image, Text } from "react-native";
import { TitleText } from "./Text";
import setUserData from "../utils/setUserData";
import { DefaultView } from "./View";
import { ART_STYLES } from "../constants/Shop";

/**
 * Carousel for users to view different art styles available for selection.
 * Currently unused.
 */
const ArtStyleCarousel = () => {
  const postGrunge = ART_STYLES["postGrunge"];
  const miyazaki = ART_STYLES["miyazaki"];
  const lowPolyGame = ART_STYLES["lowPolyGame"];
  const lineArt = ART_STYLES["lineArt"];

  const [entries] = useState([
    {
      id: postGrunge.id,
      title: postGrunge.title,
      image: postGrunge.path,
    },
    {
      id: miyazaki.id,
      title: miyazaki.title,
      image: miyazaki.path,
    },
    {
      id: lowPolyGame.id,
      title: lowPolyGame.title,
      image: lowPolyGame.path,
    },
    {
      id: lineArt.id,
      title: lineArt.title,
      image: lineArt.path,
    },
  ]);

  const carouselRef = useRef(null);

  const chooseArtStyle = async (artId) => {
    const userData = await setUserData();
    await userData.setArtStyle(artId);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          carouselRef.current.snapToItem(index);
          await chooseArtStyle(item.id);
        }}
      >
        <DefaultView>
          <Image source={item.image} className="w-32 h-32" />
          <TitleText>{item.title}</TitleText>
        </DefaultView>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex items-center h-2/5">
      <Text className="text-3xl">Choose your style</Text>
      <Carousel
        ref={carouselRef}
        data={entries}
        renderItem={renderItem}
        sliderWidth={Dimensions.get("window").width - 100}
        itemWidth={Dimensions.get("window").width - 300}
        layout={"default"}
      />
    </View>
  );
};

export default ArtStyleCarousel;
