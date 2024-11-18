import { View, Text, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectOrderActive, setOrderActive } from "../slices/orderActiveSlice";
import { useEffect } from "react";
import { retrieveData } from "../functions/apiCalls";
import { themeColors } from "../theme";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { selectTheme } from "../slices/themeSlice";
import OrderCard from "./OrderCard";

export default function OrdersDeliverying() {
  const dispatch = useDispatch();
  const ordersActive = useSelector(selectOrderActive);

  useEffect(() => {
    const getOrders = async () => {
      const response = await retrieveData("/order/getall/delivery_man");

      const sortedOrders = response.orders
        .filter(
          (order) => order.status !== "canceled" && order.status !== "delivered"
        )
        .sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        })
        .concat(
          response.orders
            .filter(
              (order) =>
                order.status === "delivered" || order.status === "canceled"
            )
            .sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })
        );

      dispatch(setOrderActive(sortedOrders));
    };

    getOrders();
  }, [dispatch]);

  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const navigation = useNavigation();
  const bgColor = isDarkMode ? "bg-gray-900" : " bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-700";

  return (
    <View className="flex-auto">
      <Text
        className={
          "overflow-auto m-5 font-light pl-5 text-3xl text-center " + textColor
        }
      >
        Tus ordenes
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {ordersActive?.length > 0 ? (
          ordersActive.map((order, index) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.replace("OutDelivery", order)}
                key={index}
                disabled={
                  order.status === "canceled" || order.status === "delivered"
                }
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
              No has tenido ningun pedido
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
