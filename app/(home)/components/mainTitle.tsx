import { View, Text } from "react-native";
import React from "react";

interface MainTitleProps {
  title: string;
}

const MainTitle: React.FC<MainTitleProps> = ({ title }) => {
  return (
    <View>
      <Text className="font-bold text-xl">{title}</Text>
    </View>
  );
};

export default MainTitle;
