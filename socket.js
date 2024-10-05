import { SOCKET_URL } from "@env";
import io from "socket.io-client";

let socket;

export const initiateSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"], // Usa WebSockets
      reconnection: true, // Habilita la reconexión automática
      reconnectionAttempts: 5, // Número de intentos de reconexión
      reconnectionDelay: 2000, // Tiempo entre intentos
    });

    socket.on("connect", () => {
      console.log("Conectado al servidor Socket.IO");
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
    });

    socket.on("reconnect_attempt", () => {
      console.log("Intentando reconectar...");
    });

    socket.on("reconnect", () => {
      console.log("Reconectado exitosamente");
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect(); // Cierra la conexión
    console.log("Socket desconectado");
  }
};

export const getSocket = () => socket;
