import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Icon from "react-native-feather";

export default function OrderCard({ order }) {
  const statusColors = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    collected: "bg-blue-500",
    canceled: "bg-red-500",
    delivered: "bg-gray-500",
  };
  const orderDate = new Date(order.date);

  const formattedDate = orderDate.toLocaleString();

  const [count, setCount] = useState(0);

  useEffect(() => {
    let total = 0;
    order.products.map(([key, product]) => {
      total = total + product.count;
    });
    setCount(total);
  }, []);

  return (
    <View
      className={
        "mx-auto my-4 p-4 border rounded-lg shadow-lg min-w-full " +
        (order.status === "canceled" || order.status === "delivered"
          ? "bg-orange-400"
          : "bg-slate-500")
      }
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-100">
          Order ID: {order._id.slice(0, 6)}
        </Text>
        <View className={`px-2 py-1 rounded ${statusColors[order.status]}`}>
          <Text className="text-white">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
      </View>
      <View className="mb-2">
        <Text className="text-sm text-gray-100">Total Items:</Text>
        <Text className="text-lg font-medium text-gray-100">{count}</Text>
      </View>
      <View className="mb-2 flex-row items-center">
        <Icon.ShoppingBag
          color="#fff"
          width={16}
          height={16}
          className="mr-2"
        />
        <Text className="text-sm text-gray-100">
          Pick-up: {order.destiny.latitude}
        </Text>
      </View>
      <View className="mb-2 flex-row items-center">
        <Icon.MapPin color="#fff" width={16} height={16} className="mr-2" />
        <Text className="text-sm text-gray-100">
          Drop-off: {order.destiny.latitude}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Icon.Clock color="#fff" width={16} height={16} className="mr-2" />
        <Text className="text-sm text-gray-100">Date: {formattedDate}</Text>
      </View>
    </View>
  );
}
