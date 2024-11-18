import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { themeColors } from "../theme";

import * as Icon from "react-native-feather";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";

export default function StoreCard({ item }) {
  const navigation = useNavigation();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-900" : " bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-700";

  return (
    <View
      style={{
        shadowColor: themeColors.bgColor(0.2),
        shadowRadius: 7,
        elevation: 5,
      }}
      className={"mb-3 mt-1 mr-6 rounded-3xl shadow-lg " + bgColor}
    >
      {item != null ? (
        <>
          <TouchableOpacity
            style={{ elevation: 5 }}
            onPress={() => navigation.navigate("Store", { ...item })}
            className={"rounded-lg p-3 mr-2 " + bgColor}
          >
            <Image
              className="h-36 w-64 rounded-3xl"
              source={{ uri: `data:image/jpeg;base64,${item.image}` }}
            />
            <View className="px-3 pb-4 space-y-2">
              <Text
                className={
                  "text-lg font-bold pt-2 " + (isDarkMode ? "text-white" : "")
                }
              >
                {item.name}
              </Text>
              <View
                className="flex-row items-center space-x-1"
                style={{ elevation: 5 }}
              >
                <Image
                  source={require("../assets/images/star.png")}
                  className="h-4 w-4"
                ></Image>
                <Text
                  style={{ color: themeColors.starsColor(item.stars) }}
                  className={"text-xs"}
                >
                  {item.stars.toFixed(1)}
                </Text>
                <Text className={textColor}>
                  ({item.reviews} reviews) •{" "}
                  <Text
                    className={
                      "font-semibold " + (isDarkMode ? "text-white" : "")
                    }
                  >
                    {item.category}
                  </Text>
                </Text>
              </View>
              <View
                className="flex-row items-center space-x-1"
                style={{ elevation: 5 }}
              >
                <Icon.MapPin color="gray" width="15" height="15" />
                <Text className={"text-xs " + textColor}>• {}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}
