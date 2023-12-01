import React, { useState, useEffect } from "react";
import { ScrollView, View, Modal, Text, Button } from "react-native";

const ModalJournal = ({ visible, onRequestClose, date, text }) => {
  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent={true}>
      <View
        className="flex-1 justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View className=" flex-initial h-full my-14 bg-white rounded-xl mx-2 items-center justify-between bg-cover">
          <View className="flex-1 justify-between w-full">
            <Text className="pt-5 self-center font-bold text-lg">{date}</Text>
            <ScrollView className="mx-4 mb-20 mt-0 border-slate-300 border-2">
              <Text
                className={`text-justify text-base m-2 mt-1 mb-1 ${
                  text === "" ? "text-gray-500" : ""
                }`}
              >
                {text === "" ? "No journal entry found for this date" : text}
              </Text>
            </ScrollView>
            <View className="absolute bottom-0 right-0 m-5">
              <Button title="Back" onPress={onRequestClose} className="mr-5" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalJournal;
