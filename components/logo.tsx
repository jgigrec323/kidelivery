import { View, Text } from "react-native";
import React from "react";

const Logo = ({ ...props }) => {
  return (
    <View {...props}>
      <Text className={props.textStyle}>Kidelivery.</Text>
    </View>
  );
};

export default Logo;
