import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { themeColors } from "../theme";
import { getStore } from "../constants";
import * as Icon from "react-native-feather";
import { useNavigation } from "@react-navigation/native";

export default function StoreCard({ item }) {
  /* const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      const data = await getStore(item.id);
      setStore(data);
    };

    fetchStore();
  }, []);
*/

  const navigation = useNavigation();

  return (
    <View
      style={{
        shadowColor: themeColors.bgColor(0.2),
        shadowRadius: 7,
      }}
      className="mr-6 bg-white rounded-3xl shadow-lg"
    >
      {item != null ? (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate("Store", { ...item })}
            className="bg-white rounded-lg p-3 mr-2"
          >
            <Image
              className="h-36 w-64 rounded-3xl"
              source={{ uri: `data:image/jpeg;base64,${item.image}` }}
            />
            <View className="px-3 pb-4 space-y-2">
              <Text className="text-lg font-bold pt-2">{item.name}</Text>
              <View className="flex-row items-center space-x-1">
                <Image
                  source={require("../assets/images/star.png")}
                  className="h-4 w-4"
                ></Image>
                <Text
                  style={{ color: themeColors.starsColor(item.stars) }}
                  className={"text-xs"}
                >
                  {item.stars.toFixed(1)}
                </Text>
                <Text className="text-gray-700">
                  ({item.reviews} reviews) •{" "}
                  <Text className="font-semibold">{item.category}</Text>
                </Text>
              </View>
              <View className="flex-row items-center space-x-1">
                <Icon.MapPin color="gray" width="15" height="15" />
                <Text className="text-gray-700 text-xs">• {item.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}
