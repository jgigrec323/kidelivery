import { View, Text, Pressable } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import COLORS from "@/constants/Colors";
import ProgressBar from "./progress-bar";
import { useSelector } from "react-redux";
import { selectMostRecentInTransitParcel } from "@/store/slices/parcelSlice";
const BeingShippedBox = () => {
  const mostRecentInTransitParcel = useSelector(
    selectMostRecentInTransitParcel
  );

  if (!mostRecentInTransitParcel) {
    return (
      <View className="flex justify-center items-center h-16">
        <Text>Aucune livraison en cours</Text>
      </View>
    );
  }

  return (
    <View className="bg-black rounded-[30px] py-[15px] px-7">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-white font-bold text-lg">#JKLO258496</Text>
        <Pressable
          style={{ backgroundColor: COLORS.grayDark, columnGap: 5 }}
          className="flex flex-row justify-center items-center  rounded-full w-20 h-5"
        >
          <Text className="text-white text-xs">Suivre</Text>
          <Entypo name="chevron-right" size={12} color="white" />
        </Pressable>
      </View>
      <View>
        <ProgressBar></ProgressBar>
        <View className="flex flex-row justify-between mt-4">
          <View>
            <Text style={{ color: COLORS.grayDark }}>15 Mai 2024</Text>
            <Text style={{ color: COLORS.white }}>Kaloum</Text>
          </View>
          <View className="flex items-end">
            <Text style={{ color: COLORS.grayDark }}>
              Estimated: 16 Mai 2024
            </Text>
            <Text style={{ color: COLORS.white }}>Coyah</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BeingShippedBox;
