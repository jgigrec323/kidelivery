import { View, Text, Image } from "react-native";
import React from "react";
import CenteredCircle from "@/components/centered-circle";
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
    <SafeAreaView className="flex-1">
      <View className="flex-1 relative bg-white">
        {/* Background Circle */}
        <CenteredCircle />

        {/* Mascot Image */}
        <Image
          className="absolute w-[350px] h-[350px] -translate-x-8 translate-y-8"
          source={require("../../assets/images/mascot.png")}
          resizeMode="contain"
        />

        {/* Logo */}
        <Logo
          className="absolute right-7 top-44"
          textStyle="text-white font-bold text-[30px]"
        />

        {/* Content */}
        <View className="absolute bottom-7 w-full flex items-center px-4">
          <Text className="text-center text-3xl font-medium">
            Livrez avec Confiance
          </Text>
          <Text className="text-center text-3xl font-medium ">
            Expédiez sans Limites
          </Text>
          <Text className="text-center text-[16px] w-4/5 mb-5 text-gray-600">
            Des colis jamais perdus, des délais optimaux, des tarifs
            imbattables.
          </Text>
          <CustomButton text="Commencer" href="/sign-in" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
