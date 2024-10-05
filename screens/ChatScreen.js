import { View, Text } from "react-native";
import React from "react";
import { selectTheme } from "../slices/themeSlice";
import { useSelector } from "react-redux";

export default function ChatScreen() {
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-white" : " text-black";
  return (
    <View className={bgColor + " w-full h-screen"}>
      <Text className={textColor}>Desliza para abajo</Text>
    </View>
  );
}
