import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);

  const navigation = useNavigation();

  const { width, height } = Dimensions.get("window");

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={-160}
      >
        <View style={styles.imageContainer}>
          <Image source={require("../../assets/img/Login-Top.png")} />
        </View>

        <View style={styles.container}>
          <Text style={styles.title} className="">
            Bienvenido
          </Text>
          <TextInput
            style={[styles.formInput, isFocused1 && styles.inputFocused]}
            placeholder="Ingresa tu correo"
            onFocus={() => setIsFocused1(true)}
            onBlur={() => setIsFocused1(false)}
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.formInput, isFocused2 && styles.inputFocused]}
            placeholder="Ingresa tu contraseña"
            secureTextEntry={true}
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(false)}
          />
          <Pressable
            style={({ pressed }) => [
              styles.olvideContraseña,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.textLink}>Olvide mi contraseña :(</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.buttonContainer,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <LinearGradient
              colors={["#fa6910", "#faac0e"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Entrar</Text>
            </LinearGradient>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.crearCuenta,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => navigation.navigate("CreateAccount")}
          >
            <Text style={styles.textLink}>Crear nueva cuenta</Text>
          </Pressable>
          <StatusBar style="auto" />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 7,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 4,
    justifyContent: "flex-end",
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 32,
    marginBottom: 20,
  },
  formInput: {
    fontFamily: "Poppins-Regular",
    fontSize: 17,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    width: 300,
    marginBottom: 10,
  },
  inputFocused: {
    borderColor: "#000000",
  },
  submitButtonText: {
    fontFamily: "Poppins-Regular",
    fontSize: 17,
    color: "#FFFFFF",
  },
  submitButton: {
    borderRadius: 25,
    paddingTop: 12,
    paddingBottom: 12,
    minWidth: 300,
    borderRadius: 25,
    alignItems: "center",
  },
  textLink: {
    color: "#00000077",
    fontSize: 15,
  },
  olvideContraseña: {
    width: 290,
    alignItems: "center",
    marginTop: -2,
    marginBottom: 40,
  },
  crearCuenta: {
    marginTop: 15,
  },
});
