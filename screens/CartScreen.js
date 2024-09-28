import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { useSelector } from "react-redux";
import { selectStore_ } from "../slices/store_Slice";
import { selectProducts } from "../slices/productsSlice";

export default function CartScreen() {
  const navigation = useNavigation();
  let store = useSelector(selectStore_);
  let products = useSelector(selectProducts);

  return (
    <View className="bg-white flex-1">
      {/* go back */}
      <View className="relative py-4 shadow-sm">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: themeColors.bgColor(1) }}
          className="absolute z-10 rounded-full p-1 shadow top-5 left-2"
        >
          <Icon.ArrowLeft strokeWidth={3} stroke={"white"} />
        </TouchableOpacity>
        <View>
          <Text className="text-center text-xl font-bold">Your cart</Text>
          <Text className="text-center text-gray-500">{store.name}</Text>
        </View>
      </View>
      {/* delivery time */}
      <View
        style={{ backgroundColor: themeColors.bgColor(0.2) }}
        className="flex-row px-4 items-center"
      >
        <Image
          source={require("../assets/images/deliveryguy.png")}
          className=" w-20 h-20 rounded-full"
        />
        <Text className="flex-1 pl-4">Delivery in...</Text>
        <TouchableOpacity>
          <Text className="font-bold" style={{ color: themeColors.bgColor(1) }}>
            Change
          </Text>
        </TouchableOpacity>
      </View>
      {/* cart items */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
        className="bg-white pt-5"
      >
        {products != null &&
          products.map((product, index) => {
            return (
              <View
                key={index}
                className="flex-row items-center space-x-3 py-2 px-4 bg-white rounded-3xl mx-2 mb-3 shadow-md"
              >
                <Text className="font-bold" style={themeColors.bgColor(1)}>
                  2 x
                </Text>
                <Image
                  className="h-14 w-14 rounded-full"
                  source={{ uri: `data:image/jpeg;base64,${product.image}` }}
                />
                <Text className="flex-1 font-bold text-gray-700">
                  {product.name}
                </Text>
                <Text className="font-semibold text-base">
                  ${product.price}
                </Text>
                <TouchableOpacity
                  className="p-1 rounded-full"
                  style={{ backgroundColor: themeColors.bgColor(1) }}
                >
                  <Icon.Minus
                    strokeWidth={2}
                    height={20}
                    width={20}
                    stroke={"white"}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
      {/*Totals */}
      <View
        style={{ backgroundColor: themeColors.bgColor(0.2) }}
        className="p-6 px-8 rounded-t-3xl space-y-4"
      >
        <View className="flex-row justify-between">
          <Text className="text-gray-700 ">Subtotal:</Text>
          <Text className="text-gray-700 ">$20</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-700 ">Delivery Fee:</Text>
          <Text className="text-gray-700 ">$2</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-700 font-extrabold">Total:</Text>
          <Text className="text-gray-700 font-extrabold ">$22</Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("OrderPreparing")}
            style={{ backgroundColor: themeColors.bgColor(1) }}
            className="p-3 rounded-full"
          >
            <Text className="text-white text-center font-bold text-lg">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
