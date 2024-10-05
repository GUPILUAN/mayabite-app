import React, { createContext, useContext, useEffect, useState } from "react";
import { initiateSocket, getSocket, disconnectSocket } from "../socket";

const SocketContext = createContext(null);
export const SocketProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    initiateSocket();
    setSocketInstance(getSocket());

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
