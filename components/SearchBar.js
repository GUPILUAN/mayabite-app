import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";

export default function SearchBar() {
  const navigation = useNavigation();
  return (
    <>
      {/*SearchBar*/}
      <View className="flex-row items-center space-x-2 px-4 pb-2">
        <View className="flex-row flex-1 items-center p-3 rounded-full border border-gray-300">
          <Icon.Search height="25" width="25" stroke="gray" />
          <TextInput placeholder="Buscar" className="ml-2 flex-1" />
          <View className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-gray-300">
            <Icon.MapPin height="20" width="20" stroke="gray" />
            <Text className="text-gray-600">Mérida, YUC</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Auth")}>
          <View
            style={{ backgroundColor: themeColors.bgColor(1) }}
            className="p-3 rounded-full"
          >
            <Icon.Sliders
              height="20"
              width="20"
              strokeWidth={2.5}
              stroke="white"
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
