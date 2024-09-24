import React from "react";
import { View } from "react-native";

const ProgressBar = () => {
  return (
    <View className="mt-4 min-w-full h-2 bg-white relative">
      {/* The progress bar */}
      <View className="bg-orange w-1/2 h-full"></View>

      {/* Rounded element at the start */}
      <View className="rounded-full h-3 w-3 absolute left-0 top-1/2 -translate-x-1 -translate-y-1.5 bg-orange"></View>

      {/* Rounded element in the middle */}
      <View className="rounded-full h-3 w-3 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1.5 bg-white"></View>

      {/* Rounded element at the end */}
      <View className="rounded-full h-3 w-3 absolute right-0 top-1/2 translate-x-1 -translate-y-1.5 bg-white"></View>
    </View>
  );
};

export default ProgressBar;
