import React, { useState } from "react";
import axios from "axios";
import {
  TextInput,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "@/constants/Colors";
import CustomHeader from "@/components/custom-header";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "expo-checkbox"; // Import CheckBox from expo-checkbox
import { communes } from "@/utils/communesGn";
import config from "@/utils/config";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [shopName, setShopName] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [commune, setCommune] = useState("");
  const [quartier, setQuartier] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);

  const validateForm = () => {
    // Ensure no field is empty
    if (
      !shopName ||
      !name ||
      !phoneNumber ||
      !commune ||
      !quartier ||
      !shopAddress
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return false;
    }

    // Check if the phone number starts with the Guinea country code +224
    /* if (!phoneNumber.startsWith("+224")) {
      Alert.alert(
        "Erreur",
        "Le numéro de téléphone doit commencer par +224 (Guinée)."
      );
      return false;
    } */

    // Ensure terms and privacy policy are accepted
    if (!isTermsAccepted || !isPrivacyAccepted) {
      Alert.alert(
        "Erreur",
        "Vous devez accepter les Conditions d'utilisation et la Politique de confidentialité."
      );
      return false;
    }

    return true;
  };

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      await signUp.create({
        phoneNumber,
        firstName: name, // Set Clerk's firstName to the user's full name
      });

      await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(
        "Le code de vérification n'a pas été envoyé. Veuillez réessayer."
      );
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      setIsLoading(true);
      const completeSignUp = await signUp.attemptPhoneNumberVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        // Send the user details to your backend
        //+15555550100
        const result = await axios.post(
          `${config.API_BASE_URL}/users/register`,
          {
            name,
            phoneNumber,
            shopName,
            shopCommune: commune,
            shopQuartier: quartier,
            shopAddress,
          }
        );

        await setActive({ session: completeSignUp.createdSessionId });

        if (result.status === 200) router.push("/(home)/(tabs)"); // Navigate to the next page
      } else {
        setError("Vérification incomplète. Veuillez vérifier le code.");
      }
    } catch (err) {
      setError("La vérification a échoué. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !isTermsAccepted || !isPrivacyAccepted;

  if (pendingVerification) {
    return (
      <SafeAreaView className="bg-white h-full">
        <CustomHeader h={120} title="Vérifiez votre numéro de téléphone" />
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
        </View>

        {isLoading && <ActivityIndicator size="large" color={COLORS.orange} />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={100} title="S'inscrire" />
      <ScrollView>
        <View className="mt-10 px-5">
          <View className="space-y-5">
            <TextInput
              className="border py-3 px-4 rounded-md text-lg"
              value={shopName}
              placeholder="Nom de la boutique"
              onChangeText={setShopName}
            />
            <View className="border rounded-md">
              <Picker
                selectedValue={commune}
                onValueChange={setCommune}
                className="border rounded-md text-lg"
              >
                <Picker.Item label="Sélectionner une commune" value="" />
                {communes.map((commune) => (
                  <Picker.Item
                    label={commune.name}
                    value={commune.name}
                    key={commune.name}
                  />
                ))}
              </Picker>
            </View>

            {commune && (
              <View className="border rounded-md">
                <Picker
                  selectedValue={quartier}
                  onValueChange={setQuartier}
                  className="border rounded-md text-lg"
                >
                  <Picker.Item label="Sélectionner un quartier" value="" />
                  {communes
                    .find((c) => c.name === commune)
                    ?.quartiers.map((quartier) => (
                      <Picker.Item
                        label={quartier}
                        value={quartier}
                        key={quartier}
                      />
                    ))}
                </Picker>
              </View>
            )}

            <TextInput
              multiline
              className="border py-3 px-4 rounded-md text-lg"
              value={shopAddress}
              placeholder="Adresse de la boutique"
              onChangeText={setShopAddress}
            />
          </View>

          <View className="mt-5 space-y-5">
            <TextInput
              className="border py-3 px-4 rounded-md text-lg"
              value={name}
              placeholder="Nom complet"
              onChangeText={setName}
            />
            <TextInput
              className="border py-3 px-4 rounded-md text-lg"
              value={phoneNumber}
              placeholder="Numéro de téléphone (+224)"
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View className="mt-5">
            <View className="flex flex-row items-center">
              <CheckBox
                value={isTermsAccepted}
                onValueChange={setIsTermsAccepted}
                color={isTermsAccepted ? COLORS.orange : undefined}
              />
              <Text className="ml-2">
                J'accepte les Conditions d'utilisation
              </Text>
            </View>

            <View className="flex flex-row items-center mt-3">
              <CheckBox
                value={isPrivacyAccepted}
                onValueChange={setIsPrivacyAccepted}
                color={isPrivacyAccepted ? COLORS.orange : undefined}
              />
              <Text className="ml-2">
                J'accepte la Politique de confidentialité
              </Text>
            </View>
          </View>

          <Pressable
            className={`mt-8 bg-black w-full py-3 mb-7 flex items-center rounded-md ${
              isButtonDisabled ? "opacity-50" : ""
            }`}
            onPress={onSignUpPress}
            disabled={isButtonDisabled}
          >
            <Text className="text-white text-xl">S'inscrire</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
