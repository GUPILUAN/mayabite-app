import Navigation from "./navigation";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { setTheme } from "./slices/themeSlice";
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  // Cambia el tema global basado en el modo del dispositivo
  useEffect(() => {
    dispatch(setTheme(colorScheme));
  }, [colorScheme]);

  return (
    <SocketProvider>
      <Navigation />
    </SocketProvider>
  );
};

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
