import { Pressable, Text, View } from "react-native";
import React from "react";
import Dashboard from "../components/dashboard";
import MainTitle from "../components/mainTitle";
import BeingShippedBox from "@/components/being-shipped-box";
import COLORS from "@/constants/Colors";
import AlreadyShippedBox from "@/components/already-shipped-box";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView>
      <View className="bg-white h-full">
        <Dashboard />
        <View className="pt-4 px-4">
          <View style={{ display: "flex", rowGap: 10 }}>
            <MainTitle title="En cours d'expédition"></MainTitle>
            <BeingShippedBox></BeingShippedBox>
            <View className="flex flex-row justify-between items-center">
              <MainTitle title="Historique"></MainTitle>
              <Pressable>
                <Text style={{ color: COLORS.grayDark }}>Voir tout</Text>
              </Pressable>
            </View>
            <View style={{ rowGap: 10 }} className="">
              <AlreadyShippedBox></AlreadyShippedBox>
              <AlreadyShippedBox></AlreadyShippedBox>
              <AlreadyShippedBox></AlreadyShippedBox>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
