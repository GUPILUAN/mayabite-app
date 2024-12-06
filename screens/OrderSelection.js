import { View, Text, Image, Alert } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { putData } from "../functions/apiCalls";
import { useSocket } from "../context/SocketContext";
import { selectUser } from "../slices/userSlice";
import { selectLocation } from "../slices/locationSlice";

export default function OrderSelection() {
  const { params } = useRoute();
  let order = params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-white" : " text-black";
  const socket = useSocket();
  const user = useSelector(selectUser);
  const location = useSelector(selectLocation);
  const error_accepting = () => {
    Alert.alert("No se pudo aceptar esta orden :c", [
      {
        text: "OK",
        style: "default",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleAcceptOrder = async () => {
    const response = await putData("/order/accept", { order_id: order._id });
    if (response.success && socket.connected) {
      socket.emit("send_my_location", {
        user_id: user._id,
        location: location,
      });
      navigation.goBack();
    } else {
      error_accepting();
    }
  };

  return (
    <View className={"flex-1 " + bgColor}>
      <StatusBar style="auto" />
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
          <Text className={"text-center text-xl font-bold " + textColor}>
            Order ID
          </Text>
          <Text
            className={
              "text-center " + (isDarkMode ? "text-gray-200" : "text-gray-500")
            }
          >
            {order._id}
          </Text>
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
        <Text className={"flex-1 pl-4 " + textColor}>Delivery in...</Text>
        <TouchableOpacity>
          <Text
            className={"font-bold " + textColor}
            style={{ color: themeColors.bgColor(1) }}
          >
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
        className={"pt-5 " + bgColor}
      >
        {order.products.map(([key, product]) => {
          return (
            <View
              key={key}
              className={
                "flex-row items-center space-x-3 py-2 px-4 rounded-3xl mx-2 mb-3 shadow-md " +
                (isDarkMode ? "bg-gray-800" : "bg-white")
              }
            >
              <Text
                className={"font-bold " + textColor}
                style={themeColors.bgColor(1)}
              >
                {product.count}x
              </Text>
              <Image
                className="h-14 w-14 rounded-full"
                source={{ uri: `data:image/jpeg;base64,${product.image}` }}
              />
              <Text
                className={
                  "flex-1 font-bold " +
                  (isDarkMode ? "text-gray-200" : "text-gray-700")
                }
              >
                {product.name}
              </Text>
              <Text className={"font-semibold text-base " + textColor}>
                ${product.price}
              </Text>
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
          <Text className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
            Subtotal:
          </Text>
          <Text className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
            ${order.total}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
            Delivery Fee:
          </Text>
          <Text className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
            ${10}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text
            className={
              isDarkMode ? "text-gray-200" : "text-gray-700 " + "font-extrabold"
            }
          >
            Total:
          </Text>
          <Text
            className={
              isDarkMode ? "text-gray-200" : "text-gray-700 " + "font-extrabold"
            }
          >
            ${order.total}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={{ backgroundColor: themeColors.bgColor(1) }}
            className="p-3 rounded-full"
            onPress={handleAcceptOrder}
          >
            <Text className="text-white text-center font-bold text-lg">
              Aceptar Orden
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
