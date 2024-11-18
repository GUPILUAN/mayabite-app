import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";
import {
  addToCart,
  removeAllFromCart,
  removeFromCart,
  selectCartItemsById,
} from "../slices/cartSlice";

function ProductRow({ product, product_enabled }) {
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-700";
  const itemsInCart = useSelector((state) =>
    selectCartItemsById(state, product?._id)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!product_enabled) {
      dispatch(removeAllFromCart({ id: product?._id })); // Limpia el carrito cuando se desactiva el producto
    }
  }, [product_enabled, dispatch, product]);

  const handleIncrease = () => dispatch(addToCart(product));
  const handleDecrease = () => dispatch(removeFromCart({ id: product._id }));

  if (!product) {
    return (
      <View
        style={{ elevation: 10 }}
        className={
          "flex-row items-center justify-center p-3 rounded-3xl shadow-2xl mb-3 mx-2 " +
          bgColor
        }
      >
        <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
      </View>
    );
  }

  return (
    <View
      className={
        "flex-row items-center p-3 rounded-3xl shadow-2xl mb-3 mx-2 " + bgColor
      }
      style={{ elevation: 5 }}
    >
      <Image
        className="rounded-3xl"
        style={{
          height: 100,
          width: 100,
          opacity: product_enabled ? 1 : 0.5,
        }}
        source={{ uri: `data:image/jpeg;base64,${product.image}` }}
      />
      <View
        className="flex flex-1 space-y-3"
        style={{ opacity: product_enabled ? 1 : 0.4 }}
      >
        <View className="pl-3">
          <Text className={"text-xl " + (isDarkMode ? "text-white" : "")}>
            {product.name}
          </Text>
          <Text className={textColor}>{product.description}</Text>
        </View>
        <View className="flex-row justify-between pl-3 items-center">
          <Text className={"text-lg font-bold text-center " + textColor}>
            ${product.price}
          </Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleDecrease}
              className="p-1 rounded-full "
              style={{
                backgroundColor: themeColors.bgColor(
                  itemsInCart.length > 0 ? 1 : 0.3
                ),
                elevation: product_enabled && itemsInCart.length > 0 ? 2 : 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity:
                  product_enabled && itemsInCart.length > 0 ? 0.5 : 0,
                shadowRadius: product_enabled && itemsInCart.length > 0 ? 2 : 0,
              }}
              disabled={!itemsInCart.length || !product_enabled}
            >
              <Icon.Minus
                strokeWidth={2}
                height={20}
                width={20}
                stroke={"white"}
              />
            </TouchableOpacity>
            <Text className={"px-3 " + textColor}>{itemsInCart.length}</Text>
            <TouchableOpacity
              onPress={handleIncrease}
              className="p-1 rounded-full"
              style={{
                backgroundColor: themeColors.bgColor(product_enabled ? 1 : 0.3),
                elevation: product_enabled ? 2 : 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity: product_enabled ? 0.5 : 0,
                shadowRadius: product_enabled ? 2 : 0,
              }}
              disabled={!product_enabled}
            >
              <Icon.Plus
                strokeWidth={2}
                height={20}
                width={20}
                stroke={"white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default React.memo(ProductRow);
