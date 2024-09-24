import { View, Text, DimensionValue } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "@/constants/Colors";

interface CustomHeaderProps {
  h?: DimensionValue | undefined;
  title: string;
}
const CustomHeader: React.FC<CustomHeaderProps> = ({ h, title }) => {
  return (
    <LinearGradient
      className="p-5 pt-7 rounded-b-sm"
      colors={[COLORS.grayLight, "#fff"]}
      style={{ height: h ?? 200 }}
    >
      <Text className="text-[30px] font-medium text-orange">{title}</Text>
    </LinearGradient>
  );
};

export default CustomHeader;
