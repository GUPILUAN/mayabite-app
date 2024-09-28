import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";

export default function ProductRow({ product, product_stock }) {
  const [quantity, setQuantity] = useState(0);

  return (
    <View className="flex-row items-center bg-white p-3 rounded-3xl shadow-2xl mb-3 mx-2">
      {product != null ? (
        <>
          <Image
            className="rounded-3xl"
            style={{ height: 100, width: 100 }}
            source={{ uri: `data:image/jpeg;base64,${product.image}` }}
          />
          <View className="flex flex-1 space-y-3">
            <View className="pl-3">
              <Text className="text-xl">{product.name}</Text>
              <Text className="text-gray-700">{product.description}</Text>
            </View>
            <View className="flex-row justify-between pl-3 items-center">
              <Text className="text-gray-700 text-lg font-bold">
                ${product.price}
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => {
                    if (quantity > 0) {
                      setQuantity((prevQuantity) => prevQuantity - 1);
                    }
                  }}
                  className="p-1 rounded-full"
                  style={{
                    backgroundColor: themeColors.bgColor(
                      quantity > 0 ? 1 : 0.3
                    ),
                  }}
                >
                  <Icon.Minus
                    strokeWidth={2}
                    height={20}
                    width={20}
                    stroke={"white"}
                  />
                </TouchableOpacity>
                <Text className="px-3">{quantity}</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (quantity < product_stock) {
                      setQuantity((prevQuantity) => prevQuantity + 1);
                    }
                  }}
                  className="p-1 rounded-full"
                  style={{
                    backgroundColor: themeColors.bgColor(
                      quantity < product_stock ? 1 : 0.3
                    ),
                  }}
                >
                  <Icon.Plus
                    strokeWidth={2}
                    height={20}
                    width={20}
                    stroke={"white"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
}
