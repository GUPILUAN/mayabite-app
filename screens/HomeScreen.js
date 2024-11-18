import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";

import { selectUser, setUser } from "../slices/userSlice";
import NormalUser from "../components/NormalUser";
import DeliveryUser from "../components/DeliveryUser";
import { Alert, Text } from "react-native";
import { putData, retrieveData } from "../functions/apiCalls";
import { useNavigation } from "@react-navigation/native";
import { setOrderActive } from "../slices/orderActiveSlice";
import { setStore_ } from "../slices/store_Slice";

export default function HomeScreen() {
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-white" : " text-black";
  const user = useSelector(selectUser);
  const now = new Date();
  const lastLogin = new Date(user.last_login);
  const [wasNotified, setWasNotified] = useState(now > lastLogin);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIsOrderActive = async () => {
      let response;
      if (user.is_working) {
        response = await retrieveData("/order/active/delivery_man");
      } else {
        response = await retrieveData("/order/active/customer");
      }

      if (response.orders.length > 0) {
        if (!user.is_working) {
          dispatch(setOrderActive(response.orders[0]));

          const store = await retrieveData(
            `/store/${response.orders[0].store}`
          );
          dispatch(setStore_(store));

          navigation.navigate(
            response.orders[0].status === "pending"
              ? "OrderPreparing"
              : "Delivery"
          );
          return;
        }
        dispatch(setOrderActive(response.orders));
      }
    };
    checkIsOrderActive();
  }, []);

  const askForParticipation = () => {
    Alert.alert(
      "Participar como repartidor",
      "¡Hola! ¿Te gustaría unirte al equipo de reparto? (puedes cambiar esta opción en ajustes más adelante)",
      [
        {
          text: "Aceptar",
          style: "default",
          onPress: async () => {
            const response = await putData("/user/delivery", {
              status: true,
            });
            if (response) {
              dispatch(setUser({ ...user, is_delivery_man: true }));
              navigation.navigate("User");
            } else {
              Alert.alert(
                "Error",
                "Ha ocurrido un error al unirte al equipo de reparto"
              );
            }
          },
        },
        {
          text: "Cancelar",
          style: "destructive",
        },
      ]
    );
    setWasNotified(true);
  };

  if (now < lastLogin && !wasNotified) {
    askForParticipation();
  }

  return (
    <SafeAreaView className={bgColor + " w-full h-screen"}>
      {!user.is_working ? <NormalUser /> : <DeliveryUser />}
    </SafeAreaView>
  );
}
