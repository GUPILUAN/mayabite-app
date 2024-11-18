import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import OrderSelector from "./OrderSelector";
import Searching from "./Searching";
import OrdersDeliverying from "./OrdersDeliverying";
import { useSelector } from "react-redux";
import { selectLocation } from "../slices/locationSlice";
import { useSocket } from "../context/SocketContext";
import { selectUser } from "../slices/userSlice";

export default function DeliveryUser() {
  const [panel, setPanel] = useState("Buscar");

  const handlePanelChange = (newPanel) => {
    setPanel(newPanel);
  };

  const user = useSelector(selectUser);
  const location = useSelector(selectLocation);
  const socket = useSocket();
  useEffect(() => {
    socket.emit("send_my_location", {
      user_id: user._id,
      location: location,
    });
  }, [location, user._id, socket]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <OrderSelector onValueChange={handlePanelChange} />
        {panel === "Buscar" ? <Searching /> : <OrdersDeliverying />}
      </View>
    </SafeAreaView>
  );
}
