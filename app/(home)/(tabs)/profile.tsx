import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/custom-header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { getInitials } from "@/utils/getInitials";
import { router } from "expo-router";

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const initials = getInitials(user?.fullName || "K");

  const toggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

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
      <View className="px-5 mt-8">
        {/* Profile Section */}
        <View className="flex-row items-center mb-8">
          <View className="h-16 w-16 bg-grayLight rounded-full items-center justify-center">
            <Text className="text-2xl font-bold">{initials}</Text>
          </View>
          <Text className="ml-4 text-xl font-bold">{user.fullName}</Text>
        </View>

        {/* Notifications */}
        <View className="flex-row items-center justify-between bg-gray-100 py-1.5 px-4 rounded-md mb-3">
          <View className="flex-row items-center">
            <Ionicons
              name="notifications-outline"
              size={22}
              color={COLORS.black}
            />
            <Text className="text-lg ml-2">Notifications</Text>
          </View>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            thumbColor={COLORS.orange}
            trackColor={{ true: COLORS.orange, false: COLORS.grayDark }}
          />
        </View>

        {/* Comptabilité */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3 flex-row items-center"
          onPress={() => router.navigate("/(home)/(screens)/finances")}
        >
          <Ionicons name="calculator-outline" size={22} color={COLORS.black} />
          <Text className="text-lg ml-3">Comptabilité</Text>
        </TouchableOpacity>

        {/* History */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3 flex-row items-center"
          onPress={() => router.navigate("/(home)/(screens)/history")}
        >
          <Ionicons name="time-outline" size={22} color={COLORS.black} />
          <Text className="text-lg ml-3">Historique</Text>
        </TouchableOpacity>

        {/* Account Settings */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3 flex-row items-center"
          onPress={() => router.navigate("/(home)/(screens)/settings")}
        >
          <Ionicons name="settings-outline" size={22} color={COLORS.black} />
          <Text className="text-lg ml-3">Paramètres du compte</Text>
        </TouchableOpacity>

        {/* Contact Us */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3 flex-row items-center"
          onPress={() => router.navigate("/(home)/(screens)/contactus")}
        >
          <Ionicons name="mail-outline" size={22} color={COLORS.black} />
          <Text className="text-lg ml-3">Contactez nous</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
