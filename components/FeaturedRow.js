import React from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { themeColors } from "../theme";
import StoreCard from "./StoreCard";
import { useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";

export default function FeaturedRow({ title, description, stores }) {
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-500";

  return (
    <View className={bgColor}>
      <View className="flex-row justify-between items-center px-4">
        <View>
          <Text
            className={"text-lg font-bold " + (isDarkMode ? "text-white" : "")}
          >
            {title}
          </Text>
          <Text className={"text-xs " + textColor}>{description}</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ color: themeColors.text }} className="font-semibold">
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        className="overflow-visible py-5"
      >
        {stores != null &&
          stores.map((store, index) => {
            return <StoreCard item={store} key={index} />;
          })}
      </ScrollView>
    </View>
  );
}
