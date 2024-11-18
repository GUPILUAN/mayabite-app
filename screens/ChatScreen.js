import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
  Alert,
  RefreshControl,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { useSocket } from "../context/SocketContext";
import { retrieveData } from "../functions/apiCalls";
import { selectTheme } from "../slices/themeSlice";

export default function ChatScreen() {
  const socket = useSocket();
  const navigation = useNavigation();
  const { params } = useRoute();
  const flatListRef = useRef(null);
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);

  const [order, setOrder] = useState(params);
  const [messages, setMessages] = useState(params?.messages || []);
  const [inputMessage, setInputMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherUser, setOtherUser] = useState({});
  const [isUserInConversation, setIsUserInConversation] = useState(false);

  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : "bg-[#f2f2ff]";
  const textColor = isDarkMode ? "text-white" : "text-gray-700";

  const currentUser = {
    id: user._id,
    name: user.username,
  };

  const getTime = useCallback((date) => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  }, []);

  const sendMessage = useCallback(() => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) {
      return setInputMessage("");
    }

    try {
      const time = getTime(new Date());
      socket.emit("message", {
        room: order._id,
        sender: currentUser.id,
        message: trimmedMessage,
        time: time,
      });
      setInputMessage("");
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el mensaje. Inténtalo de nuevo.");
    }
  }, [inputMessage, order._id, currentUser.id, socket]);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [orderData, userData] = await Promise.all([
        retrieveData(`/order/${order._id}`),
        retrieveData(
          `/user/${order.customer === user._id ? order.delivery_man : order.customer}`
        ),
      ]);

      setOrder(orderData);
      setMessages(orderData.messages);
      setOtherUser(userData);
    } catch (error) {
      setError("Error al cargar los datos del chat");
      Alert.alert("Error", "No se pudieron cargar los mensajes");
    } finally {
      setIsLoading(false);
    }
  }, [order._id, user._id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!refreshing) {
      scrollToBottom();
    }
  }, [messages, refreshing, scrollToBottom]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinConversation", {
      user_id: user._id,
      conversation_id: order._id,
    });

    const handleUserStatus = (data) => {
      if (data.userId !== user._id && data.conversation_id === order._id) {
        setIsUserInConversation(data.isInConversation);
      }
      if (data.count == 2) {
        setIsUserInConversation(true);
      }
    };

    const handleResponse = (data) => {
      setMessages((prevMessages) => [...prevMessages, data.data]);
    };

    socket.on("userStatus", handleUserStatus);
    socket.on("response", handleResponse);

    return () => {
      socket.emit("leaveConversation", {
        user_id: user._id,
        conversation_id: order._id,
      });
      socket.off("userStatus", handleUserStatus);
      socket.off("response", handleResponse);
    };
  }, [socket, user._id, order._id]);

  const makePhoneCall = useCallback((phoneNumber) => {
    if (!phoneNumber) {
      return Alert.alert("Error", "Número de teléfono no disponible");
    }

    Linking.canOpenURL(`tel:${phoneNumber}`)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            "Error",
            "Las llamadas telefónicas no están soportadas en este dispositivo"
          );
        } else {
          return Linking.openURL(`tel:${phoneNumber}`);
        }
      })
      .catch((error) => {
        Alert.alert("Error", "No se pudo realizar la llamada");
        console.error("Error al intentar hacer la llamada:", error);
      });
  }, []);

  const renderMessage = useCallback(
    ({ item }) => (
      <TouchableWithoutFeedback>
        <View className="mt-1">
          <View
            className={`max-w-[80%] ${
              item.sender === currentUser.id
                ? "self-end bg-orange-400"
                : "self-start bg-gray-600"
            } mx-2 p-2 rounded-xl ${
              item.sender === currentUser.id ? "rounded-bl-xl" : "rounded-br-xl"
            }`}
          >
            <Text className="text-white text-lg">{item.message}</Text>
            <Text className="text-[#dfe4ea] text-base self-end">
              {item.time}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    ),
    [currentUser.id]
  );

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${bgColor}`}>
        <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${bgColor}`}>
        <Text className={textColor}>{error}</Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-orange-400 rounded-lg"
          onPress={fetchData}
        >
          <Text className="text-white">Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={70}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className={`flex-1 ${bgColor}`}>
            {/* Header */}
            <View
              className="flex-row items-center justify-between px-3 py-2"
              style={{ backgroundColor: themeColors.bgColor(1) }}
            >
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="pr-2"
                  onPress={() => navigation.goBack()}
                >
                  <Icon.ArrowLeftCircle stroke="white" strokeWidth={2} />
                </TouchableOpacity>
                <Image
                  className="h-10 w-10 rounded-full mx-2"
                  source={{
                    uri:
                      otherUser?.avatar ||
                      "https://randomuser.me/api/portraits/lego/1.jpg",
                  }}
                />
                <View className="pl-2 justify-center">
                  <Text className="text-white font-bold text-lg">
                    {otherUser?.username || "Usuario"}
                  </Text>
                  <View className="flex-row items-center justify-start">
                    <Text className="text-white font-light">
                      {isUserInConversation
                        ? "En la conversación"
                        : "Fuera de la conversación"}{" "}
                    </Text>
                    <Text
                      className={`${
                        isUserInConversation ? "text-green-400" : "text-red-500"
                      } text-4xl`}
                    >
                      •
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                className="pl-2"
                onPress={() => makePhoneCall(otherUser?.phone)}
              >
                <Icon.Phone stroke="white" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => `${item._id || index}`}
              className="flex-col-reverse pb-2"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[themeColors.bgColor(1)]}
                />
              }
              onContentSizeChange={scrollToBottom}
              onLayout={scrollToBottom}
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              windowSize={10}
            />

            {/* Message Input */}
            <View className="py-2 bg-slate-600 rounded-t-2xl">
              <View className="flex-row mx-3 bg-white rounded-md">
                <TextInput
                  value={inputMessage}
                  className="h-10 flex-1 px-2"
                  placeholder="Escribe un mensaje..."
                  placeholderTextColor="#666"
                  onChangeText={setInputMessage}
                  onSubmitEditing={sendMessage}
                  multiline={false}
                  returnKeyType="send"
                />
                <TouchableOpacity
                  className="px-2 justify-center"
                  onPress={sendMessage}
                  disabled={!inputMessage.trim()}
                >
                  <Icon.Send
                    stroke={
                      inputMessage.trim() ? themeColors.bgColor(1) : "#ccc"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
