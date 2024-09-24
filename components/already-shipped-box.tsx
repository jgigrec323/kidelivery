import React from "react";
import { Feather } from "@expo/vector-icons";
import COLORS from "@/constants/Colors";
import { Text, View } from "react-native";

const AlreadyShippedBox = () => {
  return (
    <View className="bg-grayLight flex flex-row justify-between items-start py-3 px-4 rounded-lg">
      <View className="flex flex-row items-center">
        <View className="bg-[#D1D1D1] p-2 rounded-full mr-5">
          <Feather name="box" size={22} color="black" />
        </View>
        <View>
          <Text className="text-lg font-bold">MacBook Pro</Text>
          <Text className="font-bold text-grayDark text-[12px]">
            #JKLO25496
          </Text>
        </View>
      </View>
      <View
        style={{ backgroundColor: COLORS.green }}
        className="px-5 py-0.5 rounded-3xl "
      >
        <Text className="text-[12px] ">Expédié</Text>
      </View>
    </View>
  );
};

export default AlreadyShippedBox;
