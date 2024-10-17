import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/custom-header";
import COLORS from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo"; // Using Clerk for authentication
import axios from "axios";
import config from "@/utils/config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setUser } from "@/store/slices/authSlice"; // Action to update Redux state
import { useNavigation } from "expo-router";

const UpdateName = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Fetching user details from Redux authSlice
  const { id, phoneNumber, fullName, shops } = useSelector(
    (state: RootState) => state.auth
  );

  const { user } = useUser(); // Clerk user hook to get the current Clerk user

  const [name, setName] = useState(fullName || ""); // Pre-fill with current name
  const [loading, setLoading] = useState(false);

  // Function to update both Clerk and Backend
  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom ne peut pas être vide.");
      return;
    }

    try {
      setLoading(true);

      // Update the name in Clerk first
      const clerkUser = await user?.update({ firstName: name });

      if (clerkUser) {
        // If Clerk update succeeds, update the backend
        const response = await axios.patch(
          `${config.API_BASE_URL}/users/update`,
          {
            id,
            name,
            phoneNumber,
          }
        );

        if (response.status === 200) {
          Alert.alert("Succès", "Nom mis à jour avec succès !");

          // Dispatch Redux action to update the fullName only
          dispatch(
            setUser({
              id: id || "", // Keep the existing ID
              phoneNumber: phoneNumber || "", // Keep the existing phone number
              fullName: name, // Update the name with the new value
              shops, // Keep the existing shops information
            })
          );
        } else {
          Alert.alert(
            "Erreur",
            "Une erreur est survenue lors de la mise à jour."
          );
        }
      } else {
        Alert.alert("Erreur", "Impossible de mettre à jour le nom dans Clerk.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour.");
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={100} title="Mise à jour du nom" />
      <View className="px-5 mt-8">
        {/* Current Full Name Display */}
        <View>
          <Text className="text-xl mb-1">Nom complet actuel: </Text>
          <Text className="text-xl mb-7 font-bold">{fullName}</Text>
        </View>

        {/* New Name Input */}
        <TextInput
          placeholder="Entrez un nouveau nom"
          value={name}
          onChangeText={setName}
          className="bg-gray-200 py-3 px-4 rounded-md mb-5 text-xl"
        />

        {/* Update Button */}
        <View className="mt-5">
          <TouchableOpacity
            onPress={handleUpdate}
            className="bg-orange py-3 rounded-lg"
          >
            <Text className="text-center text-white font-semibold">
              Valider le changement
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View className="mt-4">
            <ActivityIndicator size="large" color={COLORS.orange} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UpdateName;
