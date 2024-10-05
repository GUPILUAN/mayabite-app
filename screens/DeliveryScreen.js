import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectStore_ } from "../slices/store_Slice";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { emptyCart } from "../slices/cartSlice";
import { selectTheme } from "../slices/themeSlice";

export default function DeliveryScreen() {
  const store = useSelector(selectStore_);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-gray-200" : " text-gray-700";

  const cancelOrder = () => {
    Alert.alert(
      "Cancelar orden", // Título de la alerta
      "Estas seguro de cancelar tu orden?", // Mensaje de la alerta
      [
        {
          text: "Quedarse",
          style: "default", // Botón de confirmación
        },
        {
          text: "Cancelar Orden",
          style: "destructive", // Botón de confirmación
          onPress: () => {
            dispatch(emptyCart());
            navigation.navigate("Home");
          },
        },
      ]
    );
  };
  return (
    <View className="flex-1">
      <MapView
        initialRegion={{
          latitude: 21.11114,
          longitude: -89.6117,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        className="flex-1"
        mapType="standard"
      >
        <Marker
          coordinate={{
            latitude: 21.11114,
            longitude: -89.6117,
          }}
          title={store.name}
          description={store.description}
          pinColor={themeColors.bgColor(1)}
        />
      </MapView>
      <View className={"rounded-t-3xl -mt-12 relative " + bgColor}>
        <View className="flex-row justify-between px-5 pt-10">
          <View>
            <Text className={"text-lg font-semibold " + textColor}>
              Estimated Arrival
            </Text>
            <Text className={"text-3xl font-extrabold " + textColor}>
              20 minutes
            </Text>
            <Text className={"mt-2 font-semibold " + textColor}>
              Your order is own its way!
            </Text>
          </View>
          <Image
            className="w-28 h-24 rounded-3xl"
            source={require("../assets/images/going.gif")}
          />
        </View>
        <View
          style={{ backgroundColor: themeColors.bgColor(0.8) }}
          className="p-2 flex-row justify-between items-center rounded-full my-5 mx-2"
        >
          <View
            className="rounded-full p-1"
            style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
          >
            <Image
              className="h-16 w-16 rounded-full"
              source={require("../assets/images/deliveryguy.jpg")}
            />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-lg font-bold text-white">User</Text>
            <Text className="font-semibold text-white">Your delivery man</Text>
          </View>
          <View className="flex-row items-center space-x-3 mr-3">
            <TouchableOpacity
              className="bg-white rounded-full p-2"
              onPress={() => navigation.navigate("Chat")}
            >
              <Icon.MessageCircle
                fill={themeColors.bgColor(1)}
                stroke={themeColors.bgColor(1)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white rounded-full p-2"
              onPress={() => cancelOrder()}
              disabled={false}
            >
              <Icon.X strokeWidth={4} stroke={"red"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
