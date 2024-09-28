import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";
import { loginUser } from "../constants";

export default function AuthScreen() {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLogin, setIsLogin] = useState(true); // Cambia entre login y registro
  const [isResetting, setIsResetting] = useState(false); // Cambia entre login y registro
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    const response = await loginUser(data, isResetting, isLogin);
    if (
      response.status === 201 ||
      response.data.access_token ||
      response.status === 200
    ) {
      if (!isResetting && response.data.access_token) {
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
      setErrorMessage(response.data.message);
    } else {
      setErrorMessage("Error al intentar acceder.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={-120}
    >
      <View className="flex-1 justify-center p-16 bg-white">
        <Text className="font-bold text-xl text-center mb-2">
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
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize={true}
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
                  onChangeText={onChange}
                  value={value}
                  maxLength={10}
                />
              )}
            />
            {errors.username && (
              <Text className="mb-8 text-center text-red-700">
                {errors.username.message}
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
              placeholder="Correo electrónico"
              onChangeText={onChange}
              value={value}
              autoCapitalize={false}
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
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.username && (
              <Text className="mb-2 text-center text-red-700">
                {errors.username.message}
              </Text>
            )}
          </>
        )}

        {errors.password && (
          <Text className="mb-2 text-center text-red-700">
            {errors.password.message}
          </Text>
        )}

        {/* Mostrar mensajes de error */}
        {errorMessage ? (
          <Text className="mb-2 text-center text-red-700">{errorMessage}</Text>
        ) : null}

        <View className="relative">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="mb-5 rounded-full p-1 shadow top-5 left-2"
            style={{ backgroundColor: themeColors.bgColorGradient(1) }}
          >
            <Text className="text-lg text-white font-bold py-4 text-center">
              {isResetting
                ? "Solicitar restablecimiento de contraseña"
                : isLogin
                  ? "Iniciar Sesión"
                  : "Registrarse"}
            </Text>
          </TouchableOpacity>

          {/* Cambiar entre registro e inicio de sesión */}
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
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
            }}
          >
            <Text
              className="mt-4 text-center"
              style={{ color: themeColors.text }}
            >
              {!isResetting && isLogin ? "¿Olvidaste tu contraseña?" : "Volver"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
