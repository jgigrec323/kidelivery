import React from "react";
import { TextInput, Button, View, Text, Pressable } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "@/constants/Colors";
import CustomHeader from "@/components/custom-header";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "expo-checkbox"; // Import CheckBox from expo-checkbox
import { communes } from "@/utils/communesGn";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [commune, setCommune] = React.useState("");
  const [quartier, setQuartier] = React.useState(""); // State for quartier
  const [boutiqueAddress, setBoutiqueAddress] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Checkbox states
  const [isTermsAccepted, setIsTermsAccepted] = React.useState(false);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        phoneNumber,
        commune,
        boutiqueAddress,
      });

      await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptPhoneNumberVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/(home)/(tabs)");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Disable the signup button if terms or privacy policy are not accepted
  const isButtonDisabled = !isTermsAccepted || !isPrivacyAccepted;

  if (pendingVerification) {
    return (
      <View>
        <Text>Verify your phone number</Text>
        <TextInput
          value={code}
          placeholder="Code..."
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onPressVerify} />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={100} title="S'inscrire"></CustomHeader>
      <View className="mt-10 px-5">
        <View className=" space-y-5">
          <TextInput
            className="border py-3 px-4 rounded-md text-lg"
            value={firstName}
            placeholder="Nom de la boutique"
            onChangeText={(firstName) => setFirstName(firstName)}
          />
          {/* Commune Picker */}
          <View className="border rounded-md">
            <Picker
              selectedValue={commune}
              onValueChange={(itemValue) => setCommune(itemValue)}
              className="border rounded-md text-lg"
              style={{ borderColor: "red" }}
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

          {/* Quartier Picker */}
          {commune && (
            <View className="border rounded-md">
              <Picker
                selectedValue={quartier}
                onValueChange={(itemValue) => setQuartier(itemValue)}
                className="border rounded-md text-lg"
                style={{ borderColor: "red" }}
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
            multiline={true}
            className="border py-3 px-4 rounded-md text-lg"
            value={boutiqueAddress}
            placeholder="Adresse de la boutique"
            onChangeText={(boutiqueAddress) =>
              setBoutiqueAddress(boutiqueAddress)
            }
          />
        </View>

        <View className="mt-5 space-y-5">
          <TextInput
            className="border py-3 px-4 rounded-md text-lg"
            value={lastName}
            placeholder="Nom complet"
            onChangeText={(lastName) => setLastName(lastName)}
          />
          <TextInput
            className="border py-3 px-4 rounded-md text-lg"
            value={phoneNumber}
            placeholder="Phone Number"
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />
        </View>

        {/* Terms of Service and Privacy Policy Checkboxes */}
        <View className="mt-5">
          <View className="flex flex-row items-center">
            <CheckBox
              value={isTermsAccepted}
              onValueChange={setIsTermsAccepted}
              color={isTermsAccepted ? COLORS.orange : undefined}
            />
            <Text className="ml-2">J'accepte les Conditions d'utilisation</Text>
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
    </SafeAreaView>
  );
}
