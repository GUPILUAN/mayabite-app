import React from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { themeColors } from "../theme";
import StoreCard from "./StoreCard";

export default function FeaturedRow({ title, description, stores }) {
  return (
    <View>
      <View className="flex-row justify-between items-center px-4">
        <View>
          <Text className="text-lg font-bold">{title}</Text>
          <Text className="text-gray-500 text-xs">{description}</Text>
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
