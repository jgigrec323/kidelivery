import COLORS from "@/constants/Colors";
import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  progress: number; // A number between 0 and 100 representing the progress percentage
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Ensure the progress is between 0 and 100
  const validatedProgress = Math.min(Math.max(progress, 0), 100);

  // Determine the position of the rounded elements based on progress
  const isNearStart = validatedProgress <= 10;
  const isNearEnd = validatedProgress >= 90;
  const isInMiddle = validatedProgress > 10 && validatedProgress < 90;

  return (
    <View className="mt-4 min-w-full h-2 bg-white relative">
      {/* The progress bar */}
      <View
        className="bg-orange h-full"
        style={{ width: `${validatedProgress}%` }}
      ></View>

      {/* Rounded element at the start */}
      <View className="rounded-full h-3 w-3 absolute left-0 top-1/2 -translate-x-1 -translate-y-1.5 bg-orange"></View>

      {/* Rounded element in the middle */}
      <View
        className="rounded-full h-3 w-3 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1.5"
        style={{ backgroundColor: isNearEnd ? COLORS.orange : COLORS.white }}
      ></View>

      {/* Rounded element at the end */}
      <View
        className="rounded-full h-3 w-3 absolute right-0 top-1/2 translate-x-1 -translate-y-1.5"
        style={{ backgroundColor: isNearEnd ? COLORS.orange : COLORS.white }}
      ></View>
    </View>
  );
};

export default ProgressBar;
