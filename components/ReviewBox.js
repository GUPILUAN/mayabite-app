import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Icon from "react-native-feather"; // Import all Feather icons
import { replace } from "../functions/NavigationService";
import { useRoute } from "@react-navigation/native";
import { postData } from "../functions/apiCalls";
import { themeColors } from "../theme";

export default function ReviewBox() {
  const { params } = useRoute();
  const store = params;
  const [rating, setRating] = useState(0);

  const handleRate = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const response = await postData(`/store/review/${store._id}`, {
      score: rating,
    });

    console.log(response.success);
    replace("Home");
  };

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center">
      <View className="bg-white shadow-lg rounded-lg p-8 w-80">
        <Text className="text-2xl font-bold mb-4 text-center">
          {"Rate Your Experience from " + store.name}
        </Text>
        <View className="flex-row justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              className="mx-1"
              key={star}
              onPress={() => setRating(star)}
            >
              <Icon.Star
                width={30}
                height={30}
                color={star <= rating ? "#FBBF24" : "#D1D5DB"}
                fill={star <= rating ? "#FBBF24" : "none"}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex justify-center my-1">
          <TouchableOpacity
            className=" text-white px-6 py-2 rounded-lg"
            style={{ backgroundColor: themeColors.bgColor(1) }}
            onPress={() => replace("Home")}
          >
            <Text className="text-white text-center">Skip</Text>
          </TouchableOpacity>
        </View>
        <View className="flex justify-center my-1">
          <TouchableOpacity
            className=" text-white px-6 py-2 rounded-lg "
            onPress={handleRate}
            style={{ backgroundColor: themeColors.bgColor(1) }}
          >
            <Text className="text-white text-center">Rate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
