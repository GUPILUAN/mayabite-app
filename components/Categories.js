import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { getCategories } from "../constants";

export default function Categories() {
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/*Categories*/}
      <View className="mt-4 ">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="overflow-visible"
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {categories != null &&
            categories.map((category, index) => {
              // Si es categoría de tienda, renderiza el botón, de lo contrario, nada
              return category.is_store_category ? (
                <View
                  key={index}
                  className="flex justify-center items-center mr-6"
                >
                  <TouchableOpacity
                    onPress={() => setSelectedCategory(category._id)}
                    className={`p-1 rounded-full shadow ${
                      category._id === selectedCategory
                        ? "bg-gray-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <Image
                      style={{ width: 45, height: 45 }}
                      source={category.image}
                    />
                  </TouchableOpacity>
                  <Text
                    className={`text-sm ${
                      category._id === selectedCategory
                        ? "font-semibold text-gray-800"
                        : "text-gray-500"
                    }`}
                  >
                    {category.name}
                  </Text>
                </View>
              ) : null; // Si no es categoría de tienda, no renderiza nada
            })}
        </ScrollView>
      </View>
    </>
  );
}
