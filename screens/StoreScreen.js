import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import ProductRow from "../components/ProductRow";
import CartBar from "../components/CartBar";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { setStore_ } from "../slices/store_Slice";
import { fetchProducts, selectProducts } from "../slices/productsSlice";

export default function StoreScreen() {
  const { params } = useRoute();
  let store = params;
  //const [products, setProducts_] = useState(null);

  const dispatch = useDispatch();
  const products = useSelector(selectProducts);

  useEffect(() => {
    if (store && store._id) {
      dispatch(setStore_({ ...store }));
    }
  }, []);

  /*useEffect(() => {
    const fetchProducts_ = async () => {
      const data = await getProducts(store._id);
      setProducts_(data);
    };
    fetchProducts_();
  }, []); */

  useEffect(() => {
    dispatch(fetchProducts(store._id));
  }, [dispatch]);

  const navigation = useNavigation();
  return (
    <View>
      <StatusBar style="light" />
      <CartBar className="absolute" />
      <View className="relative">
        <Image
          className="w-full h-72"
          source={{ uri: `data:image/jpeg;base64,${store.image}` }}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-14 left-4 bg-gray-50 p-2 rounded-full shadow"
        >
          <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
        </TouchableOpacity>
      </View>
      <View
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="bg-white -mt-12 pt-6"
      >
        <View className="px-5">
          <Text className="text-3xl font-bold">{store.name}</Text>
          <View className="flex-row space-x-2 my-1">
            <View className="flex-row items-center space-x-1">
              <Image
                source={require("../assets/images/star.png")}
                className="h-4 w-4"
              ></Image>
              <Text
                style={{ color: themeColors.starsColor(store.stars) }}
                className={"text-xs"}
              >
                {store.stars}
              </Text>
              <Text className="text-gray-700">
                ({store.reviews} reviews) •{" "}
                <Text className="font-semibold">{store.category}</Text>
              </Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Icon.MapPin color="gray" width="15" height="15" />
              <Text className="text-gray-700 text-xs">• {store.location}</Text>
            </View>
          </View>
          <Text className="text-gray-500 mt-2">{store.description}</Text>
        </View>
      </View>
      <View className=" bg-white">
        <Text className="px-4 py-4 text-2xl font-bold">Menu</Text>
      </View>
      <ScrollView>
        <View
          className="pb-36 bg-white"
          style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
        >
          {/* Inventario */}
          {products != null &&
            store.inventory.map((product, index) => {
              return (
                <ProductRow
                  product={products.find((p) => {
                    return p._id == product.id;
                  })}
                  product_stock={product.stock}
                  key={index}
                ></ProductRow>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}
