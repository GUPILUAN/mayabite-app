import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from "react-redux";
import { selectStore_ } from "../slices/store_Slice";
import { StatusBar } from "expo-status-bar";
import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
} from "../slices/cartSlice";
import { selectTheme } from "../slices/themeSlice";
import { postData, retrieveData } from "../functions/apiCalls";
import { setOrderActive } from "../slices/orderActiveSlice";
import { selectLocation } from "../slices/locationSlice";
import { checkIfInsideArea, getLocation } from "../functions/userSettings";

export default function CartScreen() {
  const navigation = useNavigation();
  let store = useSelector(selectStore_);
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-white" : " text-black";

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const deliveryFee = 10;

  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    getLocation(dispatch);
    const products = cartItems.reduce((group, product) => {
      if (group[product._id]) {
        // Si ya existe el producto en el grupo, incrementa el contador
        group[product._id].count += 1;
      } else {
        // Si no existe, lo añadimos con un contador inicial de 1
        group[product._id] = { ...product, count: 1 };
      }

      return group;
    }, {});

    setGroupedProducts(products); // Actualiza el estado con los productos agrupados y contadores
    if (cartItems.length <= 0) {
      navigation.goBack();
    }
  }, [cartItems]);

  const handleDecrease = (product) => {
    dispatch(removeFromCart({ id: product._id }));
    const products = cartItems.reduce((group) => {
      if (group[product._id]) {
        // Si ya existe el producto en el grupo, incrementa el contador
        group[product._id].count -= 1;
      }
      return group;
    }, {});
    setGroupedProducts(products);
  };

  const location = useSelector(selectLocation);

  const handleCreatingOrder = async () => {
    if (!checkIfInsideArea(location)) {
      const response = await postData("/order/create", {
        products: Object.entries(groupedProducts),
        total: cartTotal + deliveryFee,
        store: store._id,
        destiny: location,
      });
      if (response.success) {
        const newOrder = await retrieveData(`/order/${response.id}`);
        if (newOrder) {
          dispatch(setOrderActive(newOrder));
          navigation.navigate("OrderPreparing");
        }
      } else {
        alert(response.message);
      }
    } else {
      Alert.alert(
        "IMPOSIBLE",
        "Necesitas estar dentro del campus para realizar ordenes"
      );
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
            Your cart
          </Text>
          <Text
            className={
              "text-center " + (isDarkMode ? "text-gray-200" : "text-gray-500")
            }
          >
            {store.name}
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
        {Object.entries(groupedProducts).map(([key, product]) => {
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

              <TouchableOpacity
                className="p-1 rounded-full"
                style={{ backgroundColor: themeColors.bgColor(1) }}
                onPress={() => handleDecrease(product)}
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
          <Text className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
            Subtotal:
          </Text>
          <Text className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
            ${cartTotal}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
            Delivery Fee:
          </Text>
          <Text className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
            ${deliveryFee}
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
            ${cartTotal + deliveryFee}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={handleCreatingOrder}
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
