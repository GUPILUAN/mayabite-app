import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { selectTheme } from "../slices/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectOrderActive, setOrderActive } from "../slices/orderActiveSlice";
import { useSocket } from "../context/SocketContext";
import { putData, retrieveData } from "../functions/apiCalls";
import { emptyCart } from "../slices/cartSlice";

export default function OrderPreparingScreen() {
  const navigation = useNavigation();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const order = useSelector(selectOrderActive);
  const socket = useSocket();
  const dispatch = useDispatch();
  const [activeWorkers, setActiveWorkers] = useState(0);

  useEffect(() => {
    const getWorkers = async () => {
      const response = await retrieveData("/user/active_workers");
      setActiveWorkers(response.count);
    };
    getWorkers();
  });

  useEffect(() => {
    socket.emit("my_order", order._id);

    socket.on("handleOrder", (data) => {
      dispatch(setOrderActive(data.order));
    });
    socket.emit("active_workers");

    socket.on("workers", (data) => {
      setActiveWorkers(data.usersActive);
    });

    return () => {
      socket.off("handleOrder");
      socket.off("workers");
    };
  }, [socket]);

  useEffect(() => {
    if (order.status === "active") {
      navigation.navigate("Delivery");
    }
  }, [order]);

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
          onPress: async () => {
            dispatch(emptyCart());
            const response = await putData(
              `/order/changestatus/canceled/${order._id}`
            );
            if (response.success) {
              navigation.navigate("Home");
            }
          },
        },
      ]
    );
  };

  return (
    <View className={"flex-1 justify-center items-center " + bgColor}>
      <Text className={textColor + " text-center font-medium text-lg mb-3"}>
        En estos momentos hay{" "}
        {activeWorkers == 1
          ? activeWorkers + " repartidor activo"
          : activeWorkers + " repartidores activos"}
      </Text>
      <Image
        source={require("../assets/images/going.gif")}
        className="h-80 w-96 rounded-3xl"
      />
      <TouchableOpacity
        className="items-center justify-center bg-red-400 rounded-2xl p-3 mt-6"
        onPress={cancelOrder}
      >
        <Text className={textColor + " text-center font-bold text-lg"}>
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
