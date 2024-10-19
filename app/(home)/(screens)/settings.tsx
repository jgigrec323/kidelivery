import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/custom-header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Settings = () => {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!isLoaded) {
    return (
      <SafeAreaView className="bg-white h-full">
        <CustomHeader h={100} title="Paramètres" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={100} title="Mon profil" />
      <View className="px-5 mt-8">
        {/* Change Name */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3 flex-row items-center"
          onPress={() => router.navigate("/(home)/(screens)/change-name")}
        >
          <Ionicons name="person-outline" size={22} color={COLORS.black} />
          <Text className="text-lg ml-3">Changer le nom</Text>
        </TouchableOpacity>

        {/* Change Phone Number */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3 flex-row items-center"
          onPress={() => router.navigate("/(home)/(screens)/change-phone")}
        >
          <Ionicons name="call-outline" size={22} color={COLORS.black} />
          <Text className="text-lg ml-3">Changer le numéro</Text>
        </TouchableOpacity>

        {/* Manage Shops */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3 flex-row items-center"
          onPress={() => router.navigate("/(home)/(screens)/manage-shops")}
        >
          <Ionicons name="storefront-outline" size={22} color={COLORS.black} />
          <Text className="text-lg ml-3">Gérer les boutiques</Text>
        </TouchableOpacity>

        {/* Dark Mode */}
        {/* <View className="flex-row items-center justify-between bg-gray-100 py-3 px-4 rounded-md mb-3">
          <View className="flex-row items-center">
            <Ionicons name="moon-outline" size={22} color={COLORS.black} />
            <Text className="text-lg ml-3">Mode Sombre</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            thumbColor={COLORS.orange}
            trackColor={{ true: COLORS.orange, false: COLORS.grayDark }}
          />
        </View> */}

        {/* Deconnecter */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3 flex-row items-center"
          onPress={async () => {
            await signOut();
            router.push("/(auth)/sign-in");
          }}
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.orange} />
          <Text className="text-lg ml-3 text-orange">Déconnecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
