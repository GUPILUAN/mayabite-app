import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-white">
      <StatusBar style="auto" />
      <SearchBar />
      <Categories />
    </SafeAreaView>
  );
}
