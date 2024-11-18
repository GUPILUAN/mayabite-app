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
import ChatScreen from "./screens/ChatScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UserScreen from "./screens/UserScreen";
import { navigationRef } from "./functions/NavigationService";
import OrderSelection from "./screens/OrderSelection";
import OutDeliveryScreen from "./screens/OutDeliveryScreen";
import RateScreen from "./screens/RateScreen";

export default function Navigation() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="AuthLoading"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ gestureEnabled: false, animation: "slide_from_left" }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ gestureEnabled: false, animation: "fade" }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="User"
          component={UserScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Review"
          component={RateScreen}
          options={{ presentation: "fullScreenModal" }}
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
          options={{ gestureEnabled: false, presentation: "fullScreenModal" }}
          component={DeliveryScreen}
        />
        <Stack.Screen
          name="OutDelivery"
          options={{ gestureEnabled: false, presentation: "fullScreenModal" }}
          component={OutDeliveryScreen}
        />
        <Stack.Screen
          name="Chat"
          options={{ presentation: "modal" }}
          component={ChatScreen}
        />
        <Stack.Screen
          name="Selection"
          options={{ presentation: "modal" }}
          component={OrderSelection}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
