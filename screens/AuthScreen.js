import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import * as LocalAuthentication from "expo-local-authentication";
import { StatusBar } from "expo-status-bar";
import { selectTheme } from "../slices/themeSlice";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser, refreshToken, retrieveData } from "../functions/apiCalls";
import { getData, saveData } from "../functions/userKey";
import { selectSettings } from "../slices/settingsSlice";
import { setUser } from "../slices/userSlice";

export default function AuthScreen() {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const [isLogin, setIsLogin] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometrics, setBiometric] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const settings = useSelector(selectSettings);
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);

      if (compatible && enrolled) {
        const biometricsType =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometric(biometricsType);

        const authenticated = await alreadyAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          try {
            await authenticateWithBiometrics();
          } catch (error) {
            Alert.alert(
              "Error de autenticación biométrica",
              "Por favor, intenta con tu contraseña."
            );
          }
        }
      }
    } catch (error) {
      console.error("Error checking biometrics:", error);
    }
  };

  const authenticateWithBiometrics = async () => {
    if (!isBiometricAvailable) return;

    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación con Biométricos",
        fallbackLabel: "Use password",
      });

      if (success) {
        const access_token = await refreshToken("biometrics_token");
        if (!access_token) {
          throw new Error("No se pudo refrescar el token");
        }

        const response = await retrieveData("/user");
        dispatch(setUser(response));
        navigation.navigate("Home");
      } else {
        Alert.alert("Autenticación fallida", "Inténtalo de nuevo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const alreadyAuthenticated = async () => {
    try {
      const token = await getData("access_token");
      return Boolean(token && isBiometricAvailable && settings.isBiometricAuth);
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await loginUser(data, isResetting, isLogin);

      if (
        response.status === 201 ||
        response.data.access_token ||
        response.status === 200
      ) {
        if (!isResetting && response.data.access_token) {
          const { access_token, refresh_token } = response.data;

          await Promise.all([
            access_token && saveData("access_token", access_token),
            refresh_token && saveData("refresh_token", refresh_token),
          ]);

          const user = await retrieveData("/user");
          dispatch(setUser(user));
          navigation.navigate("Home");
        } else if (!isResetting) {
          setSuccessMessage(
            "Registro exitoso. Revisa tu correo electrónico para confirmar tu cuenta."
          );
          setIsLogin(true);
          reset();
        } else {
          setSuccessMessage(
            "Correo electrónico enviado para restablecer contraseña."
          );
          setIsResetting(false);
          reset();
        }
      } else {
        setErrorMessage(response.data.message || "Error al intentar acceder.");
      }
    } catch (error) {
      setErrorMessage("Error de conexión. Inténtalo más tarde.");
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
    setSuccessMessage("");
    reset();
  };

  const toggleResetPassword = () => {
    setIsResetting(isLogin ? !isResetting : false);
    setIsLogin(true);
    setErrorMessage("");
    setSuccessMessage("");
    reset();
  };

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${bgColor}`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -120 : 0}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`flex-1 justify-center p-16 ${bgColor}`}>
          {isLoading && (
            <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
          )}

          <Text className={`font-bold text-xl text-center mb-2 ${textColor}`}>
            {isResetting
              ? "Ingresa tu email"
              : isLogin
                ? "Iniciar Sesión"
                : "Registro"}
          </Text>

          {successMessage && (
            <Text className="text-center mb-8 text-green-600">
              {successMessage}
            </Text>
          )}

          {!isLogin && (
            <>
              <Controller
                control={control}
                name="username"
                rules={{
                  required: "El nombre de usuario es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    placeholder="Nombre de usuario"
                    placeholderTextColor="gray"
                    autoComplete="name"
                    onChangeText={onChange}
                    value={value}
                    className={textColor}
                  />
                )}
              />
              {errors.username && (
                <Text className="mb-8 text-center text-red-700">
                  {errors.username.message}
                </Text>
              )}

              <Controller
                control={control}
                name="phone"
                rules={{
                  required: "El teléfono es obligatorio",
                  pattern: {
                    value: /^\d{10}$/,
                    message:
                      "Ingresa un número de teléfono válido (10 dígitos)",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    placeholder="Teléfono"
                    placeholderTextColor="gray"
                    onChangeText={(text) => onChange(text.replace(/\D/g, ""))}
                    value={value}
                    maxLength={value && value.length >= 10 ? 10 : 12}
                    keyboardType="numeric"
                    className={textColor}
                  />
                )}
              />
              {errors.phone && (
                <Text className="mb-8 text-center text-red-700">
                  {errors.phone.message}
                </Text>
              )}
            </>
          )}

          <Controller
            control={control}
            name="email"
            rules={{
              required: "El correo es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ingresa un correo electrónico válido",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                autoComplete="email"
                keyboardType="email-address"
                placeholder="Correo electrónico"
                placeholderTextColor="gray"
                onChangeText={(text) => onChange(text.trim())}
                value={value}
                autoCapitalize="none"
                className={textColor}
              />
            )}
          />
          {errors.email && (
            <Text className="mb-2 text-center text-red-700">
              {errors.email.message}
            </Text>
          )}

          {!isResetting && (
            <>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    placeholder="Contraseña"
                    placeholderTextColor="gray"
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    className={textColor}
                  />
                )}
              />
              {errors.password && (
                <Text className="mb-2 text-center text-red-700">
                  {errors.password.message}
                </Text>
              )}
            </>
          )}

          {errorMessage && (
            <Text className="mb-2 text-center text-red-700">
              {errorMessage}
            </Text>
          )}

          <View className="relative">
            <LinearGradient
              colors={themeColors.bgColorGradient(1)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="mb-5 rounded-full p-1 shadow top-5 left-2"
            >
              <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                <Text className="text-lg text-white font-bold py-4 text-center">
                  {isResetting
                    ? "Solicitar restablecimiento de contraseña"
                    : isLogin
                      ? "Iniciar Sesión"
                      : "Registrarse"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            {biometrics && isAuthenticated && (
              <View className="flex-auto items-center mt-3">
                <TouchableOpacity onPress={authenticateWithBiometrics}>
                  <Image
                    style={{ width: 45, height: 45 }}
                    source={
                      biometrics.includes(1)
                        ? require("../assets/images/touchid.png")
                        : biometrics.includes(2)
                          ? require("../assets/images/faceid.png")
                          : require("../assets/images/iris.png")
                    }
                    tintColor={themeColors.bgColor(1)}
                  />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity onPress={toggleAuthMode}>
              <Text
                className="mt-4 text-center"
                style={{ color: themeColors.text }}
              >
                {isResetting
                  ? ""
                  : isLogin
                    ? "¿No tienes una cuenta? Regístrate"
                    : "¿Ya tienes cuenta? Inicia sesión"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleResetPassword}>
              <Text
                className="mt-4 text-center"
                style={{ color: themeColors.text }}
              >
                {!isResetting && isLogin
                  ? "¿Olvidaste tu contraseña?"
                  : "Volver"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  inputDark: {
    borderColor: "#444",
  },
});
