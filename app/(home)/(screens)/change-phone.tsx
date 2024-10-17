import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-expo"; // Clerk hook
import axios from "axios";
import config from "@/utils/config"; // Your backend config
import COLORS from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import CustomHeader from "@/components/custom-header";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePhoneScreen = () => {
  const dispatch = useDispatch();
  const { isLoaded, user } = useUser(); // Clerk user hook

  // Fetching user details from Redux authSlice
  const { id, fullName } = useSelector((state: RootState) => state.auth);

  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePhone = async () => {
    if (!newPhoneNumber.trim()) {
      Alert.alert("Erreur", "Le numéro de téléphone ne peut pas être vide.");
      return;
    }

    try {
      setLoading(true);

      // Create a new phone number for the user
      const phoneNumber = await user?.createPhoneNumber({
        phoneNumber: newPhoneNumber,
      });

      // Prepare the verification
      await phoneNumber?.prepareVerification();

      setPendingVerification(true);
    } catch (err) {
      setError(
        "Le code de vérification n'a pas été envoyé. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded || !user) return;

    try {
      setLoading(true);

      // Attempt to verify the phone number
      const phoneVerifyAttempt = await user.phoneNumbers[0].attemptVerification(
        {
          code,
        }
      );

      if (phoneVerifyAttempt.verification.status === "verified") {
        // Phone number verified successfully
        Alert.alert("Succès", "Numéro de téléphone mis à jour avec succès!");

        // Optionally, send the updated phone number to your backend
        const response = await axios.patch(
          `${config.API_BASE_URL}/users/update`,
          {
            id,
            phoneNumber: newPhoneNumber,
          }
        );

        if (response.status === 200) {
          // Update the phone number in Redux state
          dispatch(
            setUser({
              id: id || "",
              phoneNumber: newPhoneNumber,
              fullName: fullName || "",
              shops: response.data.shops,
            })
          );
        }
      } else {
        Alert.alert(
          "Erreur",
          "Vérification incomplète. Veuillez vérifier le code."
        );
      }
    } catch (err) {
      setError("La vérification a échoué. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="bg-white h-full">
        <CustomHeader
          h={120}
          title="Vérifiez votre nouveau numéro de téléphone"
        />
        <View className="pt-8 px-7">
          <TextInput
            className="mb-8 border py-3 px-4 rounded-md text-lg"
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
          />
          <Pressable
            className={`bg-black w-full py-3 mb-7 flex items-center rounded-md ${
              !code ? "opacity-50" : ""
            }`}
            onPress={onPressVerify}
            disabled={!code}
          >
            <Text className="text-white text-xl">Vérifier</Text>
          </Pressable>

          {loading && <ActivityIndicator size="large" color={COLORS.orange} />}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={120} title="Changer le numéro de téléphone" />
      <View className="px-5 mt-8">
        {/* New Phone Number Input */}
        <TextInput
          placeholder="Entrez un nouveau numéro de téléphone"
          value={newPhoneNumber}
          onChangeText={setNewPhoneNumber}
          keyboardType="phone-pad"
          className="bg-gray-200 py-3 px-4 rounded-md mb-8 text-xl"
        />

        {/* Update Button */}
        <Pressable
          onPress={handleUpdatePhone}
          className="bg-orange py-3 rounded-lg"
        >
          <Text className="text-center text-white font-semibold">
            Valider le changement
          </Text>
        </Pressable>

        {loading && (
          <View className="mt-4">
            <ActivityIndicator size="large" color={COLORS.orange} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChangePhoneScreen;
