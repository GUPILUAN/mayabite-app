import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import AnimatedSwitch from "./AnimatedSwitch";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { useNavigation } from "@react-navigation/native";

export default function OrderSelector({ onValueChange }) {
  const navigation = useNavigation();
  return (
    <View className="flex-row items-center space-x-2 px-4 pb-2 justify-evenly">
      <AnimatedSwitch onValueChange={onValueChange} />
      <TouchableOpacity
        onPress={async () => {
          navigation.navigate("Settings");
        }}
      >
        <View
          style={{ backgroundColor: themeColors.bgColor(1) }}
          className="p-3 rounded-full"
        >
          <Icon.Settings
            height="20"
            width="20"
            strokeWidth={2.5}
            stroke="white"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
