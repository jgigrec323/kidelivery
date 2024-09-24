import { View, Text, Pressable } from "react-native";
import React from "react";
import { Href, useRouter } from "expo-router";

interface CustomButtonProps {
  text: string;
  href: Href<string | object>;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, href }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(href);
  };

  return (
    <Pressable
      className="bg-black w-80 py-3 flex items-center rounded-full"
      onPress={handlePress}
    >
      <Text className="text-white font-bold text-2xl">{text}</Text>
    </Pressable>
  );
};

export default CustomButton;
