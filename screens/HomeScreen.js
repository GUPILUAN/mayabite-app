import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import FeaturedRow from "../components/FeaturedRow";
import { getFeatured } from "../constants";

export default function HomeScreen() {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      const data = await getFeatured();
      setFeatured(data);
    };

    fetchFeatured();
  }, []);

  return (
    <SafeAreaView className="bg-white">
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
        <View className="mt-5">
          {featured != null &&
            featured.map((item, index) => {
              return (
                <FeaturedRow
                  key={index}
                  title={item.title}
                  description={item.description}
                  stores={item.stores}
                />
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
