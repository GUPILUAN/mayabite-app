import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import React from "react";
import HomeScreen from "./screens/HomeScreen";
import StoreScreen from "./screens/StoreScreen";
import CartScreen from "./screens/CartScreen";
import OrderPreparingScreen from "./screens/OrderPreparingScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import AuthScreen from "./screens/AuthScreen";
import TestScreen from "./screens/TestScreen";
import ChatScreen from "./screens/ChatScreen";

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ animationTypeForReplace: "pop" }}
        />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false, animation: "slide_from_right" }}
        />
        <Stack.Screen name="Store" component={StoreScreen} />
        <Stack.Screen
          name="Cart"
          options={{ presentation: "modal" }}
          component={CartScreen}
        />
        <Stack.Screen
          name="OrderPreparing"
          options={{ presentation: "fullScreenModal" }}
          component={OrderPreparingScreen}
        />
        <Stack.Screen
          name="Delivery"
          options={{ presentation: "fullScreenModal" }}
          component={DeliveryScreen}
        />
        <Stack.Screen
          name="Chat"
          options={{ presentation: "modal" }}
          component={ChatScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
