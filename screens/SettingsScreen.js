import { View, Text, SafeAreaView, Switch, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as Icon from "react-native-feather";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../slices/themeSlice";
import { TouchableOpacity } from "react-native";
import { themeColors } from "../theme";
import * as LocalAuthentication from "expo-local-authentication";
import { loadSettings, selectSettings } from "../slices/settingsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { retrieveData } from "../functions/apiCalls";
import { saveData } from "../functions/userKey";

export default function SettingsScreen() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const settings = useSelector(selectSettings);
  const [isAutoTheme, setIsAutoTheme] = useState(false);
  const [isBiometricAuth, setIsBiometricAuth] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const bgColor = isDarkMode ? "bg-gray-900" : " bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-700";
  const borderColor = isDarkMode ? "border-white" : "border-gray-400";

  useEffect(() => {
    if (settings.isAutoTheme) {
      setIsAutoTheme(settings.isAutoTheme);
    }
  }, [settings]);

  useEffect(() => {
    setIsBiometricAuth(settings.isBiometricAuth);
  }, [settings]);

  useEffect(() => {
    setIsSwitchOn(theme === "light");
  }, [theme]);

  useEffect(() => {
    const saveSettings = async (newSettings) => {
      try {
        if (newSettings) {
          await AsyncStorage.setItem("userSettings", newSettings);
        }
      } catch (e) {
        console.error("Error saving settings:", e);
      }
    };
    saveSettings(JSON.stringify(settings));
  }, [settings]);

  const toggleSwitch = () => {
    setIsSwitchOn((previousState) => !previousState);
    const newTheme = !isSwitchOn ? "light" : "dark";
    const newSetting = {
      isSwitchOn: !isSwitchOn,
      theme: newTheme,
      isAutoTheme: isAutoTheme,
      isBiometricAuth: isBiometricAuth,
    };
    if (theme !== newSetting.theme) {
      dispatch(loadSettings(newSetting));
    }
  };

  const setAuto = () => {
    setIsAutoTheme((previousState) => !previousState);
    const newTheme = isAutoTheme ? theme : "auto";
    const newSetting = {
      isSwitchOn: theme === "light",
      theme: newTheme,
      isAutoTheme: !isAutoTheme,
      isBiometricAuth: isBiometricAuth,
    };
    dispatch(loadSettings(newSetting));
  };

  const setBiometrics = () => {
    setIsBiometricAuth((previousState) => !previousState);
    const newSetting = {
      ...settings,
      isBiometricAuth: !isBiometricAuth,
    };
    dispatch(loadSettings(newSetting));
  };

  const activateBiometrics = () => {
    Alert.alert(
      "Activacion de biometricos", // Título de la alerta
      "Estás apúnto de activar la autenticación por biometricos", // Mensaje de la alerta
      [
        {
          text: "Aceptar",
          style: "default",
          onPress: async () => {
            await authenticateWithBiometrics();
          },
        },
        {
          text: "Cancelar",
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    const checkBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
    };
    checkBiometrics();
  }, []);

  const authenticateWithBiometrics = async () => {
    if (isBiometricAvailable) {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación con Biométricos.",
      });

      if (success) {
        // Activa los biometricos
        const { biometrics_token } = await retrieveData("/user/biometrics");
        await saveData("biometrics_token", biometrics_token);
        setBiometrics();
      } else {
        Alert.alert("Autenticación fallida", "Inténtalo de nuevo.");
      }
    }
  };

  return (
    <SafeAreaView className={"flex-1 " + bgColor}>
      <View className="absolute z-10">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          className=" bg-gray-50 top-14 left-4 p-2 rounded-full shadow"
          style={{ backgroundColor: themeColors.bgColor(1) }}
        >
          <Icon.ArrowLeft strokeWidth={3} stroke={"white"} />
        </TouchableOpacity>
      </View>

      <View className={"flex-1 flex-col items-center mt-14 " + bgColor}>
        <View>
          <Text className={textColor + " font-extrabold text-4xl"}>
            Ajustes
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("User")}>
          <View
            style={{ backgroundColor: themeColors.bgColor(1) }}
            className="p-3 rounded-full flex-row items-center mt-10"
          >
            <Icon.User
              height="20"
              width="20"
              strokeWidth={2.5}
              stroke="white"
            />
            <Text className="font-bold px-4 text-white">Mi cuenta</Text>
          </View>
        </TouchableOpacity>
        {isBiometricAvailable && (
          <TouchableOpacity
            onPress={() => {
              if (!isBiometricAuth) {
                activateBiometrics();
              } else {
                setBiometrics();
              }
            }}
          >
            <View
              style={{ backgroundColor: themeColors.bgColor(1) }}
              className="p-3 rounded-full flex-row items-center mt-3"
            >
              {isBiometricAuth ? (
                <Icon.Eye
                  height="20"
                  width="20"
                  strokeWidth={2.5}
                  stroke="white"
                />
              ) : (
                <Icon.EyeOff
                  height="20"
                  width="20"
                  strokeWidth={2.5}
                  stroke="white"
                />
              )}
              <Text className="font-bold px-4 text-white ">Biometricos</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View className="justify-between p-4 relative z-10">
        <View className="flex-row justify-end space-x-4 items-center bottom-1">
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isSwitchOn ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isSwitchOn}
            disabled={isAutoTheme}
          />
          <TouchableOpacity
            className={`rounded-full px-4 py-2 ${
              isAutoTheme
                ? isDarkMode
                  ? "bg-gray-200"
                  : "bg-slate-600"
                : isDarkMode
                  ? "bg-gray-600"
                  : "bg-slate-200"
            }`}
            onPress={setAuto}
          >
            <View className="flex-row items-center">
              <Text
                className={`mr-2 ${
                  isDarkMode === isAutoTheme ? "text-black" : "text-white"
                }`}
              >
                Auto
              </Text>
              {isDarkMode ? (
                <Icon.Moon
                  size={24}
                  color={isDarkMode === isAutoTheme ? "black" : "white"}
                />
              ) : (
                <Icon.Sun
                  size={24}
                  color={isDarkMode === isAutoTheme ? "black" : "white"}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
