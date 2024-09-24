import { View, Text, StyleProp, ViewStyle } from "react-native";
import React, { FC } from "react";

interface DashboardBlockProps {
  value: Number | string;
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const DashboardBlock: React.FC<DashboardBlockProps> = ({
  containerStyle,
  value,
  title,
}) => {
  return (
    <View
      className="bg-white h-[50px]
    rounded-lg py-2 px-3 flex
     flex-row "
      style={containerStyle}
    >
      <Text className="text-orange font-bold text-3xl mr-2">
        {value as string}
      </Text>
      <Text className="text-xs font-bold text-orange ">{title}</Text>
    </View>
  );
};

export default DashboardBlock;
