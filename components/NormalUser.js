import { ActivityIndicator, ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Categories from "./Categories";
import { retrieveData } from "../functions/apiCalls";
import { selectTheme } from "../slices/themeSlice";
import { useSelector } from "react-redux";
import { themeColors } from "../theme";
import FeaturedRow from "./FeaturedRow";
import { checkIfInsideArea } from "../functions/userSettings";
import { selectLocation } from "../slices/locationSlice";

export default function NormalUser() {
  const [featured, setFeatured] = useState(null);
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const [isInsideUniversity, setIsInsideUniversity] = useState(false);
  const location = useSelector(selectLocation);

  useEffect(() => {
    const fetchFeatured = async () => {
      const data = await retrieveData("/featured/getfrom");
      setFeatured(data);
    };
    fetchFeatured();

    setIsInsideUniversity(checkIfInsideArea(location));
  }, []);

  if (!featured) {
    return (
      <View className={"flex-1 justify-center items-center " + bgColor}>
        <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
      </View>
    );
  }

  return (
    <>
      <SearchBar location={isInsideUniversity ? "U.Anáhuac M" : "Mérida YUC"} />
      <Categories />
      {/*Main*/}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View className={"mt-5 "}>
          {featured.map((item, index) => {
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
    </>
  );
}
