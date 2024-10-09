import { View, Text, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/custom-header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const ContactUs = () => {
  const phoneNumber = "+224 123 456 789";
  const email = "contact@kidelivery.com";
  const location = "Conakry, Guinea";

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleLocation = () => {
    // Example link to Google Maps. Replace with your exact location if needed.
    const googleMapsUrl = "https://www.google.com/maps?q=Conakry,+Guinea";
    Linking.openURL(googleMapsUrl);
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={100} title="Nous contacter" />

      <View className="px-5 mt-8">
        {/* Phone Section */}
        <TouchableOpacity
          onPress={handleCall}
          className="flex-row items-center bg-gray-100 py-3 px-4 rounded-md mb-4"
        >
          <Ionicons name="call-outline" size={24} color={COLORS.black} />
          <Text className="ml-3 text-lg">{phoneNumber}</Text>
        </TouchableOpacity>

        {/* Email Section */}
        <TouchableOpacity
          onPress={handleEmail}
          className="flex-row items-center bg-gray-100 py-3 px-4 rounded-md mb-4"
        >
          <Ionicons name="mail-outline" size={24} color={COLORS.black} />
          <Text className="ml-3 text-lg">{email}</Text>
        </TouchableOpacity>

        {/* Location Section */}
        <TouchableOpacity
          onPress={handleLocation}
          className="flex-row items-center bg-gray-100 py-3 px-4 rounded-md mb-4"
        >
          <Ionicons name="location-outline" size={24} color={COLORS.black} />
          <Text className="ml-3 text-lg">{location}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ContactUs;
