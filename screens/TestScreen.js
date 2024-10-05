// App.js (o cualquier componente de React Native)
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSocket } from "../context/SocketContext";

export default function TestScreen() {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("response", (data) => {
        console.log("Respuesta recibida del servidor:", data);
        setMessages((prevMessages) => [...prevMessages, data.data]);
      });
      socket.on("connect", () => {
        console.log("Conectado al servidor ID: " + socket.id);
      });

      return () => {
        socket.off("message"); // Limpieza al desmontar el componente
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.send(message); // Enviar mensaje al servidor
      setMessage(""); // Limpiar el campo de entrada
    }
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>
          Chat en Tiempo Real
        </Text>

        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={{ padding: 5 }}>{item}</Text>}
        />

        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          value={message}
          onChangeText={setMessage}
          placeholder="Escribe tu mensaje"
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}
