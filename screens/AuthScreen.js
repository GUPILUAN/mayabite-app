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
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";
import { getAccessToken, loginUser, storeToken } from "../constants";
import { useSelector } from "react-redux";
import * as LocalAuthentication from "expo-local-authentication";
import { StatusBar } from "expo-status-bar";
import { selectTheme } from "../slices/themeSlice";
import { LinearGradient } from "expo-linear-gradient";

export default function AuthScreen() {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLogin, setIsLogin] = useState(true); // Cambia entre login y registro
  const [isResetting, setIsResetting] = useState(false); // Para resetear la contraseña
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometrics, setBiometric] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function loginBiometrics() {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
      const biometricsType =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      setBiometric(biometricsType);
      const authenticated = await alreadyAuthenticated();
      setIsAuthenticated(authenticated);
      if (isAuthenticated) {
        await authenticateWithBiometrics();
      }
    }
    loginBiometrics();
  }, [isAuthenticated]);

  const authenticateWithBiometrics = async () => {
    if (isBiometricAvailable) {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación con Biométricos.",
      });

      if (success) {
        // Redirige al usuario a la pantalla Home
        navigation.navigate("Home");
      } else {
        Alert.alert("Autenticación fallida", "Inténtalo de nuevo.");
      }
    }
  };

  const alreadyAuthenticated = async () => {
    const token = await getAccessToken();
    return token !== null && isBiometricAvailable;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await loginUser(data, isResetting, isLogin);
    if (
      response.status === 201 ||
      response.data.access_token ||
      response.status === 200
    ) {
      if (!isResetting && response.data.access_token) {
        // Almacenar el token de forma segura
        await storeToken(response.data.access_token);
        setSuccessMessage("");
        setErrorMessage("");
        navigation.navigate("Home"); // Redirigir a Home si es login exitoso
      } else if (!isResetting) {
        // Mostrar mensaje de éxito para el registro y que confirme el correo
        setSuccessMessage(
          "Registro exitoso. Revisa tu correo electrónico para confirmar tu cuenta."
        );
        setIsLogin(true); // Cambiar a la pantalla de login
        setErrorMessage("");
      } else {
        setSuccessMessage(
          "Correo electrónico enviado para restablecer contraseña."
        );
        setErrorMessage("");
        setIsResetting(false); // Cambiar a la pantalla de login
      }
    } else if (response.data.message) {
      setSuccessMessage("");
      setErrorMessage(response.data.message);
    } else {
      setSuccessMessage("");
      setErrorMessage("Error al intentar acceder.");
    }
    setLoading(false);
  };

  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : " bg-white";
  const textColor = isDarkMode ? "text-white" : " text-black";

  return (
    <KeyboardAvoidingView
      className={"flex-1 " + bgColor}
      behavior="padding"
      keyboardVerticalOffset={-120}
    >
      <StatusBar style="auto" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={"flex-1 justify-center p-16 " + bgColor}>
          {isLoading && (
            <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
          )}

          <Text className={"font-bold text-xl text-center mb-2 " + textColor}>
            {isResetting
              ? "Ingresa tu email"
              : isLogin
                ? "Iniciar Sesión"
                : "Registro"}
          </Text>

          {/* Mostrar mensaje de éxito cuando el registro sea exitoso */}
          {successMessage ? (
            <Text className="text-center mb-8 text-green-600">
              {successMessage}
            </Text>
          ) : null}

          {/* Campo de username, solo visible en el registro */}
          {!isLogin && (
            <>
              <Controller
                control={control}
                name="username"
                rules={{ required: "El nombre de usuario es obligatorio" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    placeholderTextColor="gray"
                    autoComplete="name"
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize={true}
                    autoCorrect={true}
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
                rules={{ required: "El telefono de usuario es obligatorio" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Telefono"
                    placeholderTextColor="gray"
                    onChangeText={(text) => {
                      const filteredText = text.replace(/\s/g, "");
                      onChange(filteredText);
                    }}
                    autoCapitalize={false}
                    value={value}
                    maxLength={value && value.length >= 10 ? 10 : 12}
                    autoComplete="tel"
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

          {/* Campo de email */}
          <Controller
            control={control}
            name="email"
            rules={{ required: "El correo es obligatorio" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                autoComplete="email"
                keyboardType="email-address"
                placeholder="Correo electrónico"
                placeholderTextColor="gray"
                onChangeText={(text) => {
                  const filteredText = text.replace(/\s/g, "");
                  onChange(filteredText);
                }}
                value={value}
                autoCapitalize={false}
                className={textColor}
              />
            )}
          />
          {errors.email && (
            <Text className="mb-2 text-center text-red-700">
              {errors.email.message}
            </Text>
          )}

          {/* Campo de password */}
          {!isResetting && (
            <>
              <Controller
                control={control}
                name="password"
                rules={{ required: "La contraseña es obligatoria" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
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

          {/* Mostrar mensajes de error */}
          {errorMessage ? (
            <Text className="mb-2 text-center text-red-700">
              {errorMessage}
            </Text>
          ) : null}

          <View className="relative">
            <LinearGradient
              colors={themeColors.bgColorGradient(1)} // Usa los colores del gradiente
              start={{ x: 0, y: 0 }} // Punto de inicio (esquina superior izquierda)
              end={{ x: 1, y: 1 }} // Punto de finalización (esquina inferior derecha)
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
            {
              biometrics && isAuthenticated ? (
                <View className="flex-auto items-center mt-3">
                  <TouchableOpacity
                    onPress={async () => await authenticateWithBiometrics()}
                  >
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
              ) : null /* Mostrar el botón de autenticación biométrica */
            }
            {/* Cambiar entre registro e inicio de sesión */}
            <TouchableOpacity
              onPress={() => {
                setIsLogin(!isLogin);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
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
            {/* Cambiar a recuperar contraseña */}
            <TouchableOpacity
              onPress={() => {
                setIsResetting(isLogin ? !isResetting : false);
                setIsLogin(true);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
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
});
