import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectStore_ } from "../slices/store_Slice";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { emptyCart } from "../slices/cartSlice";
import { selectTheme } from "../slices/themeSlice";
import { selectOrderActive } from "../slices/orderActiveSlice";
import { putData, retrieveData } from "../functions/apiCalls";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { checkIfInsideArea } from "../functions/userSettings";
import { selectLocation, setLocation } from "../slices/locationSlice";
import { useSocket } from "../context/SocketContext";
import { selectUser } from "../slices/userSlice";
import { replace } from "../functions/NavigationService";

export default function OutDeliveryScreen() {
  const { params } = useRoute();
  const [order, setOrder] = useState(params);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-700";

  const targetLatitude = 21.11106;
  const targetLongitude = -89.61235;

  const [delivery_man, setDelivery_man] = useState({});
  const [store, setStore] = useState({});
  const [storeLocation, setStoreLocation] = useState({});
  const user = useSelector(selectUser);
  const socket = useSocket();
  const [canClick, setCanClick] = useState(false);
  const myLocation = useSelector(selectLocation);

  useEffect(() => {
    const delivery = async () => {
      const response = await retrieveData(`/user/${order.customer}`);
      if (response) setDelivery_man(response);
    };
    const getStore = async () => {
      const response = await retrieveData(`/store/${order.store}`);
      if (response) {
        setStore(response);
        setStoreLocation({
          latitude: response.location.latitude,
          longitude: response.location.longitude,
        });
      }
    };
    getStore();
    delivery();
  }, []);

  useEffect(() => {
    if (socket && order._id) {
      socket.emit("my_order", order._id);

      socket.on("handleOrder", (data) => {
        if (data.order && data.order._id === order._id) {
          if (data.order.status === "canceled") {
            Alert.alert("La orden ha sido cancelada por el usuario");
            replace("Home");
          }
          if (
            data.order.status === "delivered" &&
            data.order._id === order._id
          ) {
            replace("Home");
          }
          setOrder(data.order);
        }
      });

      return () => {
        socket.off("handleOrder");
      };
    }
  }, [socket]);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permiso de ubicación denegado");
          return;
        }

        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Actualiza cada 5 segundos
            distanceInterval: 5, // Solo actualiza si hay un cambio de 5 metros
          },
          (location) => {
            if (location.coords) {
              console.log("ACTUALIZANDO POSICION");
              dispatch(setLocation(location.coords));
            }
          }
        );

        return () => {
          locationSubscription.remove();
        };
      } catch (error) {
        console.error("Error al solicitar la ubicación:", error);
      }
    };

    checkLocation();
  }, [dispatch]);

  useEffect(() => {
    if (myLocation && storeLocation) {
      const inArea = checkIfInsideArea(
        myLocation,
        order.status === "active" ? storeLocation : order.destiny
      );
      setCanClick(inArea);

      socket.emit("send_my_location", {
        user_id: user._id,
        location: myLocation,
      });
    }
  }, [
    myLocation,
    storeLocation,
    order.status,
    order.destiny,
    socket,
    user._id,
  ]);

  const handleRecolect = async () => {
    try {
      await putData(`/order/changestatus/collected/${order._id}`, {});
    } catch (error) {
      console.error("Error updating order status to collected:", error);
    }
  };

  const handleDeliver = async () => {
    try {
      await putData(`/order/changestatus/delivered/${order._id}`, {});
    } catch (error) {
      console.error("Error updating order status to delivered:", error);
    }
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
        //provider={PROVIDER_GOOGLE}
      >
        <Marker
          image={require("../assets/images/stores/restaurant.png")}
          coordinate={{
            latitude: storeLocation?.latitude,
            longitude: storeLocation?.longitude,
          }}
          title={store?.name}
          description={store?.description}
          pinColor={themeColors.bgColor(1)}
        />
        <Marker
          coordinate={{
            latitude: order.destiny.latitude,
            longitude: order.destiny.longitude,
          }}
          title={"DESTINO"}
          description={"Destino de la orden"}
          pinColor={themeColors.bgColor(1)}
        />
        <Marker
          coordinate={{
            latitude: myLocation?.latitude,
            longitude: myLocation?.longitude,
          }}
          image={require("../assets/images/deliveryguy.png")}
          title={"Este eres tu"}
          description={"Hola"}
          pinColor={themeColors.bgColor(1)}
        />
      </MapView>
      <View className={"rounded-t-3xl -mt-12 relative " + bgColor}>
        <View className="flex-row justify-between px-5 pt-10">
          <View>
            <Text className={"text-lg font-semibold " + textColor}>
              {canClick ? "¡Estás dentro del área!" : "Te estás acercando..."}
            </Text>

            <TouchableOpacity
              className={"rounded-3xl p-2"}
              style={{
                backgroundColor: themeColors.bgColor(canClick ? 1 : 0.5),
              }}
              disabled={!canClick}
              onPress={() => {
                if (order.status === "active") {
                  handleRecolect();
                } else {
                  handleDeliver();
                }
              }}
            >
              <Text className={"text-3xl font-extrabold " + textColor}>
                {order.status === "active"
                  ? "Recolectar pedido"
                  : "Entregar pedido"}
              </Text>
            </TouchableOpacity>
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
            <Text className="font-semibold text-white">Entregar a </Text>
            <Text className="text-lg font-bold text-white">
              {delivery_man?.username}
            </Text>
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
              onPress={() => replace("Home")}
              disabled={false}
            >
              <Icon.ArrowLeft strokeWidth={4} stroke={"red"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
