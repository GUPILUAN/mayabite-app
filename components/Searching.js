import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { useSocket } from "../context/SocketContext";
import { retrieveData } from "../functions/apiCalls";
import { ScrollView } from "react-native";
import { themeColors } from "../theme";
import { selectTheme } from "../slices/themeSlice";
import { useNavigation } from "@react-navigation/native";
import OrderCard from "./OrderCard";

export default function Searching() {
  const socket = useSocket();
  const [orders, setOrders] = useState([]);
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const navigation = useNavigation();
  const bgColor = isDarkMode ? "bg-gray-900" : " bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-700";

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await retrieveData("/order/all_pending");
      const ordenes = data.filter((order) => order.customer !== user._id);
      ordenes.sort((a, b) => new Date(a.date) - new Date(b.date));
      setOrders(ordenes);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    socket.on("getPendingOrders", (data) => {
      const ordenes = data.orders;
      ordenes.sort((a, b) => new Date(a.date) - new Date(b.date));
      setOrders(ordenes);
    });
    return () => {
      socket.off("getPendingOrders");
    };
  }, [socket]);

  return (
    <View>
      <Text
        className={
          "overflow-auto m-5 font-light pl-5 text-3xl text-center " + textColor
        }
      >
        Hola {user.username}! 😁
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {orders.length > 0 ? (
          orders.map((order, index) => {
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleString();
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("Selection", order)}
                key={index}
                className="w-11/12 self-center"
              >
                <OrderCard order={order} />
              </TouchableOpacity>
            );
          })
        ) : (
          <View
            className={
              "flex-row items-center p-3 rounded-3xl shadow-2xl mb-3 mx-2 bg-slate-200 justify-center"
            }
            style={{ elevation: 5 }}
          >
            <Text
              className="text-xl font-bold self-center"
              style={{ color: themeColors.bgColor(1) }}
            >
              No hay pedidos pendientes
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
