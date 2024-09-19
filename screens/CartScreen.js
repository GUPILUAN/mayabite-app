import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { themeColors } from "../theme";

export default function CartScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  let store = params;
  return (
    <View className="bg-white flex-1">
      <View className="relative py-4 shadow-sm">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: themeColors.bgColor(1) }}
          className="absolute z-10 rounded-full p-1 shadow top-5 left-2"
        >
          <View>
            <Text className="text-black">{store.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
