import { View, Text, Image, Button } from "react-native";
import React from "react";
import CenteredCircle from "@/components/centered-circle";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "@/components/logo";
import CustomButton from "@/components/custom-button";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Home = () => {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href={"/(home)/(tabs)"} />;
  }
  return (
    <SafeAreaView>
      <View className="relative bg-white">
        <CenteredCircle></CenteredCircle>
        <Image
          className="absolute w-[350px] h-[350px] -translate-x-8 translate-y-16"
          source={require("../../assets/images/mascot.png")}
          resizeMode="contain"
        ></Image>
        <Logo
          className="absolute right-9 top-52"
          textStyle="text-white font-bold text-[35px]"
        ></Logo>
        <View className=" absolute top-[480] w-full flex justify-center items-center px-4">
          <Text className="text-center text-3xl font-medium">
            Livrez avec Confiance
          </Text>
          <Text className="text-center text-3xl font-medium mb-5">
            Expédiez sans Limites
          </Text>
          <Text className="text-center text-[16px] w-2/3 mb-10">
            Des colis jamais perdus, des délais optimaux, des tarifs
            imbattables.
          </Text>
          <CustomButton text="Commencer" href="/sign-in"></CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
