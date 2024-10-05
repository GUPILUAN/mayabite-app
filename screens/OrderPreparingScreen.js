import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { selectTheme } from "../slices/themeSlice";
import { useSelector } from "react-redux";

export default function OrderPreparingScreen() {
  const navigation = useNavigation();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Delivery");
    }, 2000);
  });
  return (
    <View className={"flex-1 justify-center items-center " + bgColor}>
      <Image
        source={require("../assets/images/going.gif")}
        className="h-80 w-96 rounded-3xl"
      />
    </View>
  );
}
