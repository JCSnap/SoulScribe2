import React from "react";
import { Text } from "react-native";

/**
 * Component for rendering text with default styling.
 */
export const DefaultText = ({ children }) => <Text className="text-xl">{children}</Text>;

/**
 * Component for rendering text with title styling.
 */
export const TitleText = ({ children }) => (
  <Text className="text-2xl font-bold">{children}</Text>
);

/**
 * Component for rendering text with heading styling.
 */
export const HeadingText = ({ children }) => (
  <Text className="text-3xl font-bold">{children}</Text>
);
