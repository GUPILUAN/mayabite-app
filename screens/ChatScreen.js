import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
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
  const user = useSelector(selectUser);
  const { params } = useRoute();
  const [order, setOrder] = useState(params);
  const theme = useSelector(selectTheme);
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-black" : "bg-[#f2f2ff]";
  const textColor = isDarkMode ? "text-white" : " text-gray-700";

  const [currentUser] = useState({
    id: user._id,
    name: user.username,
  });

  const [messages, setMessages] = useState([...order.messages]);

  const [inputMessage, setInputMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  function getTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
  }

  function sendMessage() {
    if (inputMessage === "") {
      return setInputMessage("");
    }
    let t = getTime(new Date());
    socket.emit("message", {
      room: order._id,
      sender: currentUser.id,
      message: inputMessage,
      time: t,
    });
    setInputMessage("");
  }

  // Función para manejar la recarga
  const onRefresh = () => {
    setRefreshing(true);
    // Simular una carga de datos
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: user._id,
          message: "New message after refresh!",
          time: getTime(new Date()),
        },
      ]);
      setRefreshing(false);
    }, 2000); // Simula un retraso de 2 segundos
  };

  const flatListRef = useRef(null);

  useEffect(() => {
    if (!refreshing) scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    flatListRef.current.scrollToEnd({ animated: true });
  };

  const [otherUser, setOtherUser] = useState({});

  useEffect(() => {
    const getOtherUser = async () => {
      const response = await retrieveData(
        `/user/${order.customer === user._id ? order.delivery_man : order.customer}`
      );
      setOtherUser(response);
    };
    const getOrder = async () => {
      const response = await retrieveData(`/order/${order._id}`);
      setOrder(response);
      setMessages(response.messages);
    };
    getOrder();
    getOtherUser();
  }, []);

  const [isUserInConversation, setIsUserInConversation] = useState(false);
  useEffect(() => {
    socket.emit("joinConversation", {
      user_id: user._id,
      conversation_id: order._id,
    });

    socket.on("userStatus", (data) => {
      if (data.userId !== user._id && data.conversation_id === order._id) {
        setIsUserInConversation(data.isInConversation);
      }
      if (data.count == 2) {
        setIsUserInConversation(true);
      }
    });

    socket.on("response", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.data]);
    });

    return () => {
      socket.emit("leaveConversation", {
        user_id: user._id,
        conversation_id: order._id,
      });
      socket.off("userStatus");
    };
  }, [socket]);

  const makePhoneCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.error("Error al intentar hacer la llamada:", err)
    );
  };
  return (
    <SafeAreaView className={"flex-1 " + bgColor}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={70}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className={"flex-1 " + bgColor}>
            {/* Header */}
            <View
              className="flex-row items-center justify-between px-3 py-2 "
              style={{ backgroundColor: themeColors.bgColor(1) }}
            >
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="pr-2"
                  onPress={() => navigation.goBack()}
                >
                  <Icon.ArrowLeftCircle stroke={"white"} strokeWidth={2} />
                </TouchableOpacity>
                <Image
                  className="h-10 w-10 rounded-full mx-2"
                  source={{
                    uri: "https://randomuser.me/api/portraits/lego/1.jpg",
                  }}
                />
                <View className="pl-2 justify-center">
                  <Text className="text-white font-bold text-lg">
                    {otherUser?.username}
                  </Text>
                  <View className="flex-row items-center justify-start">
                    <Text className="text-white font-light">
                      {isUserInConversation
                        ? "En la conversación"
                        : "Fuera de la conversación"}{" "}
                    </Text>
                    <Text
                      className={
                        (isUserInConversation
                          ? "text-green-400"
                          : "text-red-500") + " text-4xl"
                      }
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
              className="flex-col-reverse pb-2"
              ref={flatListRef}
              data={messages}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback>
                  <View className="mt-1">
                    <View
                      className={`max-w-[${Dimensions.get("screen").width * 0.8}px] ${
                        item.sender === currentUser.id
                          ? "self-end bg-orange-400"
                          : "self-start bg-gray-600"
                      } mx-2 p-2 rounded-xl ${
                        item.sender === currentUser.id
                          ? "rounded-bl-xl"
                          : "rounded-br-xl"
                      }`}
                    >
                      <Text className="text-white text-lg">{item.message}</Text>
                      <Text className="text-[#dfe4ea] text-base self-end">
                        {item.time}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={null}
                  colors={["#3a6ee8"]}
                />
              }
            />

            {/* Message Input */}
            <View className="py-2 bg-slate-600 rounded-t-2xl">
              <View className="flex-row mx-3 bg-white rounded-md">
                <TextInput
                  value={inputMessage}
                  className="h-10 flex-1 px-2"
                  placeholder="Message"
                  onChangeText={(text) => setInputMessage(text)}
                  onSubmitEditing={() => sendMessage()}
                />
                <TouchableOpacity
                  className="px-2 justify-center"
                  onPress={() => sendMessage()}
                >
                  <Icon.Send stroke={themeColors.bgColor(1)} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
