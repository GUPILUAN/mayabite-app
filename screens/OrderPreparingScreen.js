import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function OrderPreparingScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Delivery");
    }, 2000);
  });
  return (
    <View className="bg-white flex-1 justify-center items-center">
      <Image
        source={require("../assets/images/going.gif")}
        className="h-80 w-96"
      />
    </View>
  );
}
