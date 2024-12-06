import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectStore_ } from "../slices/store_Slice";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { emptyCart } from "../slices/cartSlice";
import { selectTheme } from "../slices/themeSlice";
import { selectOrderActive } from "../slices/orderActiveSlice";
import { putData, retrieveData } from "../functions/apiCalls";
import { StatusBar } from "expo-status-bar";
import { useSocket } from "../context/SocketContext";

export default function DeliveryScreen() {
  const store = useSelector(selectStore_);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-700";
  const order = useSelector(selectOrderActive);

  const [isInArea, setIsInArea] = useState(false);
  const targetLatitude = store.location.latitude;
  const targetLongitude = store.location.longitude;
  const socket = useSocket();

  const [delivery_man, setDelivery_man] = useState({});

  const [delivery_man_location, setDelivery_man_location] = useState(null);

  useEffect(() => {
    const delivery = async () => {
      const response = await retrieveData(`/user/${order.delivery_man}`);
      if (response) setDelivery_man(response);
    };
    delivery();
  }, []);

  useEffect(() => {
    socket.on("delivery_man_location", (data) => {
      if (data.userId === order.delivery_man) {
        setDelivery_man_location(data.location);
      }
    });
    socket.on("handleOrder", (data) => {
      if (data.order.status === "delivered" && data.order._id === order._id) {
        navigation.navigate("Review", store);
      }
    });
    return () => {
      socket.off("handleOrder");
      socket.off("delivery_man_location");
    };
  }, [socket]);

  const cancelOrder = () => {
    Alert.alert("Cancelar orden", "Estas seguro de cancelar tu orden?", [
      {
        text: "Quedarse",
        style: "default",
      },
      {
        text: "Cancelar Orden",
        style: "destructive",
        onPress: async () => {
          dispatch(emptyCart());
          const response = await putData(
            `/order/changestatus/canceled/${order._id}`,
            {}
          );
          if (response.success) {
            navigation.navigate("Home");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1">
      <StatusBar style={"auto"} />
      <MapView
        initialRegion={{
          latitude: targetLatitude,
          longitude: targetLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        className="flex-1"
        mapType="standard"
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton
      >
        <Marker
          image={require("../assets/images/stores/restaurant.png")}
          coordinate={{
            latitude: targetLatitude,
            longitude: targetLongitude,
          }}
          title={store.name}
          description={store.description}
          pinColor={themeColors.bgColor(1)}
        />
        <Marker
          coordinate={{
            latitude: delivery_man_location?.latitude,
            longitude: delivery_man_location?.longitude,
          }}
          image={require("../assets/images/deliveryguy.png")}
          title={"Tu mayabito"}
          pinColor={themeColors.bgColor(1)}
        />
      </MapView>
      <View className={"rounded-t-3xl -mt-12 relative " + bgColor}>
        <View className="flex-row justify-between px-5 pt-10">
          <View>
            <Text className={"text-lg font-semibold " + textColor}>
              {"Ya viene tu pedido"}
            </Text>
            <Text className={"text-3xl font-extrabold " + textColor}>
              Tiempo estimado...
            </Text>
            <Text className={"mt-2 font-semibold " + textColor}>
              Mantén tu celular cerca!
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
            <Text className="text-lg font-bold text-white">
              {delivery_man?.username}
            </Text>
            <Text className="font-semibold text-white">Your delivery man</Text>
          </View>
          <View className="flex-row items-center space-x-3 mr-3">
            <TouchableOpacity
              className="bg-white rounded-full p-2"
              onPress={() => navigation.navigate("Chat", order)}
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
