import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  ScrollView,
  View,
  Modal,
  Image,
  Text,
  Button,
} from "react-native";

/**
 * Modal component that displays item details and provides actions.
 */
const ModalItem = ({
  visible,
  onRequestClose,
  item,
  actionButtonTitle,
  onActionButtonPress,
  screen,
}) => {
  // State variable to track the selected example for art styles
  const [selectedExample, setSelectedExample] = useState(
    item?.type == "artStyle" ? item?.examples[0] : {}
  );

  useEffect(() => {
    // Update the selected example when the item changes
    if (item?.type === "artStyle") {
      setSelectedExample(item?.examples[0]);
    } else {
      // Do nothing for other item types
    }
  }, [item]);

  // Event handler when an image is pressed
  const onImagePress = (example) => {
    setSelectedExample(example);
  };

  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent={true}>
      <View
        className="flex-1 justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View className=" flex-initial h-4/6 bg-white rounded-xl mx-10 items-center justify-between bg-cover">
          {item?.type === "artStyle" ? (
            // Render art style details
            <View>
              <Text className="pt-5 self-center font-bold text-lg">
                {item?.title}
              </Text>
              <Image
                source={{ uri: selectedExample?.image }}
                className="h-60 w-60 rounded-md self-center m-2"
              />
              <Text className="text-sm self-center text-center">
                {selectedExample?.event}
              </Text>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{ alignItems: "center" }}
                className="m-2"
              >
                {item?.examples.map((example, index) => (
                  <TouchableOpacity onPress={() => onImagePress(example)}>
                    <Image
                      key={index}
                      source={{ uri: example.image }}
                      className="w-16 h-16 m-1 rounded-md"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View className="w-32 h-10 self-center bg-yellow-400 rounded-xl justify-center">
                  <Text className="font-bold self-center text-lg text-white">
                    Cost: {item?.cost}
                  </Text>
                </View>
              <View className="flex-row py-2 self-end mr-5">
                <View className="m-2">
                  <Button
                    title="CANCEL"
                    onPress={onRequestClose}
                    className="mr-5"
                  />
                </View>
                <View className="m-2">
                  <Button
                    title={actionButtonTitle}
                    onPress={onActionButtonPress}
                  />
                </View>
              </View>
            </View>
          ) : (
            // Render other item details
            <View className="flex-1 justify-between">
              <Text className="pt-5 self-center font-bold text-lg">
                {item?.title}
              </Text>
              <Image source={item?.path} className=" h-80 w-80" />
              {screen === "shop" ? (
                <View className="w-32 h-10 self-center bg-yellow-400 rounded-xl justify-center">
                  <Text className="font-bold self-center text-lg text-white">
                    Cost: {item?.cost}
                  </Text>
                </View>
              ) : (
                <View></View>
              )}
              <View className="flex-row pb-5 self-end mr-10">
                <View className="m-2">
                  <Button
                    title="CANCEL"
                    onPress={onRequestClose}
                    className="mr-5"
                  />
                </View>
                <View className="m-2">
                  <Button
                    title={actionButtonTitle}
                    onPress={onActionButtonPress}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalItem;
