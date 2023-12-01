import React, { useState } from "react";
import { Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export const DropdownComponent = ({ title, items = [], onChangeItem }) => {
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [choices, setChoices] = useState(items.map((item) => ({ label: item, value: item })));

  const handleValueChange = (selectedValue) => {
    setValue(selectedValue);
    onChangeItem(selectedValue); // Invoke the callback with the selected value
  };

  return (
    <View className="z-20 m-3">
      <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold", color: "#000" }}>
        {title}
      </Text>
      <DropDownPicker
        open={isOpen}
        setOpen={setOpen}
        value={value}
        items={choices}
        setValue={setValue}
        setItems={setChoices}
        placeholder={title}
        style={{ backgroundColor: "#fafafa" }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        containerStyle={{ height: 40 }}
        onChangeValue={handleValueChange} // Pass the callback function here
      />
    </View>
  );
};
