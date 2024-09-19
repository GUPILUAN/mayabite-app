import React from "react";
import { View, Text } from "react-native";
import StoreCard from "./StoreCard";
/* DESARROLLO */
export default function StoreRow() {
  return (
    <View>
      <View className="flex-row justify-between items-center px-4"></View>
      {stores != null &&
        stores.map((store, index) => {
          return (
            <>
              <StoreCard item={store} key={index} />
            </>
          );
        })}
    </View>
  );
}
