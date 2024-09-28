// App.js (o cualquier componente de React Native)
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import io from "socket.io-client";

export default function TestScreen() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Conectar con el servidor Flask-SocketIO
    const newSocket = io("http://192.168.50.149:8080"); // Cambia la URL si es necesario
    setSocket(newSocket);

    // Escuchar el evento de mensaje
    newSocket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Escuchar la conexión
    newSocket.on("connect", () => {
      console.log("Conectado al servidor");
    });

    // Escuchar la desconexión
    newSocket.on("disconnect", () => {
      console.log("Desconectado del servidor");
    });

    // Cleanup cuando el componente se desmonte
    return () => newSocket.disconnect();
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.send(message); // Enviar el mensaje al servidor
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
