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
import { useNavigation } from "@react-navigation/native";
import { getInitials } from "@/utils/getInitials";

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const navigation = useNavigation();
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
          <Text className="text-lg">Notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            thumbColor={COLORS.orange}
            trackColor={{ true: COLORS.orange, false: COLORS.grayDark }}
          />
        </View>

        {/* Account Settings */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3"
          onPress={() => navigation.navigate("AccountSettings")}
        >
          <Text className="text-lg">Paramètres du compte</Text>
        </TouchableOpacity>

        {/* My Contacts */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3"
          onPress={() => navigation.navigate("MyContacts")}
        >
          <Text className="text-lg">Mes contacts</Text>
        </TouchableOpacity>

        {/* Contact Us */}
        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-md mb-3"
          onPress={() => navigation.navigate("ContactUs")}
        >
          <Text className="text-lg">Contactez nous</Text>
        </TouchableOpacity>

        {/* Log Out and Delete Account Buttons */}
        {/*  <TouchableOpacity className="bg-red-500 py-3 px-4 rounded-md mb-3">
          <Text className="text-lg text-white text-center">Se déconnecter</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-red-500 py-3 px-4 rounded-md">
          <Text className="text-lg text-white text-center">
            Supprimer mon compte
          </Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default Profile;
