import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  AppState,
} from "react-native";
import { deleteData, getData } from "../functions/userKey";
import { useNavigation } from "@react-navigation/native";
import { loadSettings, selectSettings } from "../slices/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { themeColors } from "../theme";
import { selectTheme } from "../slices/themeSlice";
import * as LocalAuthentication from "expo-local-authentication";
import { retrieveData } from "../functions/apiCalls";
import { setUser } from "../slices/userSlice";
import { selectLocation } from "../slices/locationSlice";
import * as Location from "expo-location";
import { getLocation } from "../functions/userSettings";

export default function AuthLoadingScreen() {
  const navigation = useNavigation();
  const settings = useSelector(selectSettings);
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : "bg-white";
  const location = useSelector(selectLocation);

  const checkLocationPermission = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      const { status: requestStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (requestStatus === "granted") {
        await getLocation(dispatch);
      } else {
        showPermissionAlert();
      }
    }
    await getLocation(dispatch);
  };

  const showPermissionAlert = () => {
    Alert.alert(
      "Permiso requerido",
      "La aplicación necesita acceder a tu ubicación. Por favor, habilita el permiso en la configuración.",
      [{ text: "Abrir configuración", onPress: openSettings }]
    );
  };

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getData("access_token");

      const bio_token = await getData("biometrics_token");
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (bio_token === null || !compatible || !enrolled) {
        const newSettings = { ...settings, isBiometricAuth: false };
        if (bio_token) {
          await deleteData("biometrics_token");
        }
        dispatch(loadSettings(newSettings));
      }

      if (token) {
        const response = await retrieveData("/user");
        if (response) {
          dispatch(setUser(response));
          navigation.replace("Home");
        }
      } else {
        navigation.replace("Auth");
      }
    };

    if (location !== null) {
      checkLoginStatus();
    } else {
      checkLocationPermission();

      const subscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState === "active") {
            checkLocationPermission();
          }
        }
      );

      return () => subscription.remove();
    }
  }, [location]);

  return (
    <View
      className={bgColor}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
    </View>
  );
}
