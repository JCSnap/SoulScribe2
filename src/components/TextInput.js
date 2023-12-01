import React from "react";
import { TextInput } from "react-native";

/**
 * Component for rendering a default-styled textbox for user input.
 */
export const DefaultTextInput = ({
  placeholder,
  onChangeText,
  value,
  ...props
}) => (
  <TextInput
    placeholder={placeholder}
    style={{ height: 50, width: 300 }}
    onChangeText={onChangeText}
    value={value}
    autoCapitalize="none"
    className="border-2 border-gray-300 rounded-md p-2 m-1"
    {...props}
  />
);

/**
 * Component for rendering a textbox styled for password input.
 */
export const PasswordInput = ({ placeholder, onChangeText, value }) => (
  <DefaultTextInput
    secureTextEntry={true}
    placeholder={placeholder}
    onChangeText={onChangeText}
    value={value}
  />
);

/**
 * Component for rendering a textbox styled for journal entry input.
 */
export const EntryInput = ({ onChangeText, value }) => (
  <TextInput
    placeholder="What's on your mind?"
    onChangeText={onChangeText}
    value={value}
    multiline={true}
    autoCorrect={true}
    className="rounded-md m-2 pt-0 pr-3 text-justify"
  />
);
