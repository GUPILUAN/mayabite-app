import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";

export default function CartBar() {
  const navigation = useNavigation();
  return (
    <View className="absolute bottom-5 w-full z-50">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Cart");
        }}
        style={{ backgroundColor: themeColors.bgColor(1) }}
        className="flex-row justify-between items-center mx-5 rounded-full p-4 py-3 shadow-lg"
      >
        <View
          className="p-2 px-4 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
        >
          <Text className="text-lg font-extrabold text-white">0</Text>
        </View>
        <Text className="flex-1 text-center text-lg font-extrabold text-white">
          View Cart
        </Text>
        <Text className="font-extrabold text-white text-lg">${0}</Text>
      </TouchableOpacity>
    </View>
  );
}
