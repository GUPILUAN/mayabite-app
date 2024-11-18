import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";
import { LinearGradient } from "expo-linear-gradient";

export default function AnimatedSwitch({ onValueChange }) {
  const [active, setActive] = useState("Buscar");
  const [animatedValue] = useState(new Animated.Value(0));
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";

  const handlePress = (button) => {
    setActive(button);
    onValueChange(button);
    Animated.timing(animatedValue, {
      toValue: button === "Buscar" ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const interpolatedLeft = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  return (
    <View className={"items-center justify-start "}>
      <View style={styles.switchContainer(isDarkMode)}>
        <Animated.View
          style={[styles.animatedBg, { left: interpolatedLeft }]}
        />

        <LinearGradient
          colors={["rgba(0, 0, 0, 0.15)", "transparent", "rgba(0, 0, 0, 0.15)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.innerShadowVertical}
        />

        <LinearGradient
          colors={["rgba(0, 0, 0, 0.1)", "transparent", "rgba(0, 0, 0, 0.1)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.innerShadowHorizontal}
        />

        <TouchableOpacity
          style={[styles.button, active === "Buscar" && styles.activeButton]}
          onPress={() => handlePress("Buscar")}
        >
          <Text
            style={[
              styles.text,
              active === "Buscar" ? styles.activeText : styles.inactiveText,
            ]}
          >
            Nuevas Ordenes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, active === "Activas" && styles.activeButton]}
          onPress={() => handlePress("Activas")}
        >
          <Text
            style={[
              styles.text,
              active === "Activas" ? styles.activeText : styles.inactiveText,
            ]}
          >
            Entregando...
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: (isDarkMode) => ({
    flexDirection: "row",
    backgroundColor: isDarkMode ? "#362e1d" : "#fff",
    borderRadius: 25,
    width: 300,
    height: 50,
    position: "relative",
    overflow: "hidden",
  }),
  animatedBg: {
    position: "absolute",
    width: "50%",
    height: "100%",
    backgroundColor: "#fbe8c4",
    borderRadius: 25,
    zIndex: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  innerShadowVertical: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    zIndex: -1,
  },
  innerShadowHorizontal: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: -1,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeButton: {},
  activeText: {
    color: "#4A90E2",
  },
  inactiveText: {
    color: "#F5A623",
  },
});
