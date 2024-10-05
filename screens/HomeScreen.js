import { StatusBar } from "expo-status-bar";
import { ScrollView, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import FeaturedRow from "../components/FeaturedRow";
import { getFeatured } from "../constants";
import { useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";
import { themeColors } from "../theme";

export default function HomeScreen() {
  const [featured, setFeatured] = useState(null);
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-white" : " text-black";

  useEffect(() => {
    const fetchFeatured = async () => {
      const data = await getFeatured();
      setFeatured(data);
    };
    fetchFeatured();
  }, []);

  return (
    <SafeAreaView className={bgColor + " w-full h-screen"}>
      <StatusBar style="auto" />
      <SearchBar />
      <Categories />

      {/*Main*/}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View className={"mt-5 "}>
          {featured ? (
            featured.map((item, index) => {
              return (
                <FeaturedRow
                  key={index}
                  title={item.title}
                  description={item.description}
                  stores={item.stores}
                />
              );
            })
          ) : (
            <View
              className={
                "w-full h-screen flex justify-center items-center " + bgColor
              }
            >
              <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
