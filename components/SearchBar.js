import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";

export default function SearchBar({ location }) {
  const navigation = useNavigation();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-900" : " bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-700";
  const borderColor = isDarkMode ? "border-white" : "border-gray-400";

  return (
    <>
      {/*SearchBar*/}
      <View className="flex-row items-center space-x-2 px-4 pb-2 ">
        <View
          className={
            "flex-row flex-1 items-center p-3 rounded-full border " +
            borderColor
          }
        >
          <Icon.Search
            height="25"
            width="25"
            stroke={isDarkMode ? "white" : "gray"}
          />
          <TextInput
            placeholder="Buscar"
            placeholderTextColor="gray"
            className={"ml-2 flex-1 " + textColor}
          />
          <View
            className={
              "flex-row items-center space-x-1 border-0 border-l-2 pl-2 " +
              borderColor
            }
          >
            <Icon.MapPin
              height="20"
              width="20"
              stroke={isDarkMode ? "white" : "gray"}
            />
            <Text className={isDarkMode ? "text-white" : "text-gray-600"}>
              {location}
            </Text>
          </View>
        </View>
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
    </>
  );
}
