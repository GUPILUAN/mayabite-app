import Navigation from "./navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { setTheme } from "./slices/themeSlice";
import { SocketProvider } from "./context/SocketContext";
import { saveSettingsToStorage } from "./functions/userSettings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadSettings, selectSettings } from "./slices/settingsSlice";
import { StatusBar } from "expo-status-bar";
const App = () => {
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();

  useEffect(() => {
    const loadStoredSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem("userSettings");
        if (savedSettings === null) {
          saveSettingsToStorage(
            { theme: colorScheme, isAutoTheme: false, isBiometricsAuth: false },
            colorScheme
          );
        } else {
          const parsedSettings = JSON.parse(savedSettings);
          dispatch(loadSettings(parsedSettings));
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    };
    loadStoredSettings();
  }, [colorScheme]);

  const settings = useSelector(selectSettings);
  useEffect(() => {
    if (settings.theme === "auto") {
      dispatch(setTheme(colorScheme));
    } else {
      dispatch(setTheme(settings.theme));
    }
  }, [settings, colorScheme, dispatch]);

  const statusbarColor =
    settings.theme === "light"
      ? "dark"
      : settings.theme === "dark"
        ? "light"
        : "auto";
  return (
    <SocketProvider>
      <StatusBar style={statusbarColor} />
      <Navigation />
    </SocketProvider>
  );
};

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
