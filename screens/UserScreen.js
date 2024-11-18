import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../slices/userSlice";
import { logOut, putData } from "../functions/apiCalls";
import { selectTheme } from "../slices/themeSlice";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { useSocket } from "../context/SocketContext";
import { selectOrderActive } from "../slices/orderActiveSlice";
import { loadSettings, selectSettings } from "../slices/settingsSlice";

export default function UserScreen() {
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);

  const ordersActive = useSelector(selectOrderActive);

  const [isSwitchDeliveryOn, setIsSwitchDeliveryOn] = useState(
    user.is_delivery_man
  );
  const [isSwitchWorkingOn, setIsSwitchWorkingOn] = useState(user.is_working);
  const isDarkMode = theme === "dark";

  const bgColor = isDarkMode ? "bg-gray-900" : " bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-700";
  const borderColor = isDarkMode ? "border-white" : "border-gray-400";

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const settings = useSelector(selectSettings);

  const handleLogOut = () => {
    if (!hasActiveOrCollectedOrders) {
      const newSettings = { ...settings, isBiometricAuth: false };
      dispatch(loadSettings(newSettings));
      logOut(true);
      dispatch(setUser(null));
    } else {
      Alert.alert("Error", "Tienes ordenes activas!");
    }
  };

  const toggleSwitchDelivery = async () => {
    if (isSwitchWorkingOn) {
      Alert.alert("Error", "Primero debes terminar de entregar");
      return;
    }

    const response = await putData("/user/delivery", {
      status: !isSwitchDeliveryOn,
    });
    if (response.success) {
      dispatch(setUser({ ...user, is_delivery_man: !isSwitchDeliveryOn }));
    } else {
      Alert.alert("Error", "Ha ocurrido un error");
    }
  };

  const toggleSwitchWorking = async () => {
    const response = await putData("/user/working", {
      status: !isSwitchWorkingOn,
    });
    if (response.success) {
      dispatch(setUser({ ...user, is_working: !isSwitchWorkingOn }));
    } else {
      Alert.alert("Error", "Ha ocurrido un error");
    }
  };

  useEffect(() => {
    setIsSwitchDeliveryOn(user.is_delivery_man);
    setIsSwitchWorkingOn(user.is_working);
  }, [user]);

  const hasActiveOrCollectedOrders =
    Array.isArray(ordersActive) &&
    ordersActive.some(
      (order) => order.status === "active" || order.status === "collected"
    );

  return (
    <SafeAreaView className={"flex-1 " + bgColor}>
      <View className="absolute z-10">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          className=" bg-gray-50 top-14 left-4 p-2 rounded-full shadow"
          style={{ backgroundColor: themeColors.bgColor(1) }}
        >
          <Icon.ArrowLeft strokeWidth={3} stroke={"white"} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-evenly items-center">
        <View>
          <TouchableOpacity
            className={
              "self-center p-5 rounded-full h-28 w-28 items-center justify-center " +
              (isDarkMode ? "bg-slate-600" : "bg-black")
            }
          >
            {user.image ? (
              <Image src={user.image}></Image>
            ) : (
              <Icon.User
                height="50"
                width="50"
                strokeWidth={2.5}
                stroke="white"
              />
            )}
          </TouchableOpacity>

          <Text className={"text-2xl font-bold text-center pt-3 " + textColor}>
            {user.username}
          </Text>

          <View className="flex-col my-10 px-6">
            <View
              className={
                "flex-row justify-between space-x-4 items-center my-2 rounded-2xl   p-2 border-b " +
                (isDarkMode
                  ? "bg-slate-700 border-black"
                  : "border-gray-300 bg-slate-100")
              }
            >
              <Text className={textColor + " font-bold text-center"}>
                Ser repartidor
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: themeColors.bgColor(1) }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchDelivery}
                value={isSwitchDeliveryOn}
              />
            </View>

            <View
              className={
                "flex-row justify-between space-x-4 items-center my-2 rounded-2xl   p-2 border-b " +
                (isDarkMode
                  ? "bg-slate-700 border-black"
                  : "border-gray-300 bg-slate-100")
              }
            >
              <Text className={textColor + " font-bold text-center"}>
                Empezar entregas
              </Text>
              <Switch
                trackColor={{
                  false: "#767577",
                  true: themeColors.bgColor(1),
                }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchWorking}
                value={isSwitchWorkingOn}
                disabled={!user.is_delivery_man || hasActiveOrCollectedOrders}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          className="bg-red-500 rounded-3xl p-2"
          onPress={handleLogOut}
        >
          <Text className="text-white font-bold text-center">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
