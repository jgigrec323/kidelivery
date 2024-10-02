import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/custom-header";
import COLORS from "@/constants/Colors";

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  // If the user data is not loaded yet, show a loading indicator
  if (!isLoaded) {
    return (
      <SafeAreaView className="bg-white h-full">
        <CustomHeader h={100} title="Profil" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView className="bg-white h-full">
        <CustomHeader h={100} title="Profil" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg">Vous n'êtes pas connecté.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Display user details
  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={100} title="Profil" />
      <View className="p-5">
        <Text className="text-xl font-bold">Bienvenue, {user.firstName}!</Text>
        <View className="mt-5 space-y-3">
          <Text className="text-lg">Nom complet: {user.fullName}</Text>

          <Text className="text-lg">
            Numéro de téléphone: {user.phoneNumbers[0]?.phoneNumber}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
