import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { getCategories } from "../constants";

import { useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";

export default function Categories() {
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-500";
  const selected = isDarkMode ? "bg-gray-200" : "bg-gray-700";
  const nonSelected = isDarkMode ? "bg-gray-700" : "bg-gray-200";

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
                    onPress={() => {
                      if (selectedCategory !== category._id) {
                        setSelectedCategory(category._id);
                      } else {
                        setSelectedCategory(null);
                      }
                    }}
                    className={`p-1 rounded-full shadow ${
                      category._id === selectedCategory ? selected : nonSelected
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
                        ? "font-semibold " + textColor
                        : textColor
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
