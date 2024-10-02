import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/custom-header";
import COLORS from "@/constants/Colors";
import SingleScreen from "../components/single-screen";
import MultipleScreen from "../components/mutliple-screen";
import CargaisonScreen from "../components/cargaison-screen";

const Create = () => {
  const [isTabSelected, setisTabSelected] = useState("Single");
  const tabs = ["Single", "Multiple", "Cargaison"];
  return (
    <SafeAreaView>
      <CustomHeader h={80} title="Nouvelle demande"></CustomHeader>

      <View className="bg-white h-full px-5 pt-3">
        <View className="flex flex-row justify-between">
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              style={{
                backgroundColor:
                  isTabSelected === tab ? "#000" : COLORS.grayLight,
              }}
              className=" w-28 py-2 flex items-center rounded-md"
              onPress={() => {
                setisTabSelected(tab);
              }}
            >
              <Text
                style={{
                  color: isTabSelected === tab ? "#fff" : COLORS.grayDark,
                }}
                className="text-lg font-bold"
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
        {isTabSelected === "Single" && <SingleScreen />}
        {isTabSelected === "Multiple" && <MultipleScreen />}
        {isTabSelected === "Cargaison" && <CargaisonScreen />}
      </View>
    </SafeAreaView>
  );
};

export default Create;
