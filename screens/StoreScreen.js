import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import ProductRow from "../components/ProductRow";
import CartBar from "../components/CartBar";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { setStore_ } from "../slices/store_Slice";
import { fetchProducts, selectProducts } from "../slices/productsSlice";
import { useSocket } from "../context/SocketContext";
import { selectTheme } from "../slices/themeSlice";
import { emptyCart, selectCartItems } from "../slices/cartSlice";
import { retrieveData } from "../functions/apiCalls";

export default function StoreScreen() {
  const { params } = useRoute();
  let store = params;
  const [StoreInventory, setStoreInventory] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (store && store._id) {
      dispatch(setStore_({ ...store }));
    }
  }, []);

  const products = useSelector(selectProducts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts(store._id));
  }, [StoreInventory]);

  useEffect(() => {
    const fetchStoreInventory = async () => {
      const data = await retrieveData(`/store/${store._id}`);
      setStoreInventory(data.inventory);
    };

    fetchStoreInventory();
  }, []);

  const productMap = useMemo(() => {
    return products?.reduce((map, product) => {
      map[product._id] = product;
      return map;
    }, {});
  }, [products]);

  useEffect(() => {
    socket.on("storeUpdated", ({ document_id, updated_fields }) => {
      if (document_id === store._id && updated_fields.inventory) {
        setStoreInventory(updated_fields.inventory);
      }
    });

    return () => {
      socket.off("storeUpdated");
    };
  }, [socket]);

  const cartItems = useSelector(selectCartItems);
  const showAlert = () => {
    Alert.alert(
      "Cuidado", // Título de la alerta
      "Si sales de la tienda se borrará tu carrito", // Mensaje de la alerta
      [
        {
          text: "Cancelar", // Botón opcional
          style: "cancel",
        },
        {
          text: "Aceptar", // Botón de confirmación
          onPress: () => {
            dispatch(emptyCart());
            navigation.goBack();
          },
        },
      ],
      { cancelable: true } // Si se puede cancelar al tocar fuera del cuadro
    );
  };

  useEffect(() => {}, []);
  const navigation = useNavigation();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-white" : " text-gray-700";

  const scrollY = useRef(new Animated.Value(0)).current; // Inicializa la referencia animada

  const { height: screenHeight } = Dimensions.get("window");
  const HEADER_EXPANDED_HEIGHT = screenHeight * 0.35; // 35% de la altura de la pantalla
  const HEADER_COLLAPSED_HEIGHT = screenHeight * 0.135; // 13.5% de la altura de la pantalla

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <View className={"flex-1 " + bgColor}>
      <StatusBar style="light" />
      <CartBar />
      <View className="absolute z-10">
        <TouchableOpacity
          onPress={() => {
            if (cartItems.length > 0) {
              showAlert();
            } else {
              navigation.goBack();
            }
          }}
          className=" bg-gray-50 top-14 left-4 p-2 rounded-full shadow"
        >
          <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
        </TouchableOpacity>
      </View>
      <Animated.View style={{ height: headerHeight, overflow: "hidden" }}>
        <Image
          className="w-full h-72"
          source={{ uri: `data:image/jpeg;base64,${store.image}` }}
        />
      </Animated.View>
      <View
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className={"-mt-12 pt-6 " + bgColor}
      >
        <View className="px-5">
          <Text className={"text-3xl font-bold " + textColor}>
            {store.name}
          </Text>
          <View className="flex-row space-x-2 my-1">
            <View className="flex-row items-center space-x-1">
              <Image
                source={require("../assets/images/star.png")}
                className="h-4 w-4"
              />
              <Text
                style={{ color: themeColors.starsColor(store.stars) }}
                className={"text-xs"}
              >
                {store.stars.toFixed(1)}
              </Text>
              <Text className={textColor}>
                ({store.reviews} reviews) •{" "}
                <Text className="font-semibold">{store.category}</Text>
              </Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Icon.MapPin color="gray" width="15" height="15" />
              <Text className={"text-xs " + textColor}>• {""}</Text>
            </View>
          </View>
          <Text className="text-gray-500 mt-2">{store.description}</Text>
        </View>
      </View>

      <View className={bgColor}>
        <Text className={"px-4 py-4 text-2xl font-bold " + textColor}>
          Menu
        </Text>
      </View>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} // Controla la frecuencia de eventos de desplazamiento
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View
          className={"pb-36 " + bgColor}
          style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
        >
          {/* Inventario */}
          {StoreInventory?.map((product, index) => {
            const matchedProduct = productMap?.[product.id];
            return (
              <ProductRow
                product={matchedProduct}
                product_enabled={product.enabled}
                key={index}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
