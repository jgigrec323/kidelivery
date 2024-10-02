import * as React from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/custom-header";
import COLORS from "@/constants/Colors";

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [verifying, setVerifying] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  // Handle form submission to start phone login
  async function handleSubmit() {
    if (!isLoaded || !signIn) return;

    setLoading(true);
    setError(null);

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: phone,
      });

      // Check for phone code factor support
      const phoneCodeFactor = supportedFirstFactors?.find(
        (factor) => factor.strategy === "phone_code"
      );

      if (phoneCodeFactor) {
        const { phoneNumberId } = phoneCodeFactor;

        // Send OTP to user
        await signIn.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });

        setVerifying(true);
      }
    } catch (err) {
      setError(
        "Le code de vérification n'a pas été envoyé. Veuillez réessayer."
      );
      console.error(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  // Handle OTP verification
  async function handleVerification() {
    if (!isLoaded || !signIn) return;

    setLoading(true);
    setError(null);

    try {
      // Attempt to verify the OTP code
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      // Set session active and redirect if sign-in is complete
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/(home)/(tabs)");
      } else {
        setError("Vérification incomplète. Veuillez vérifier le code.");
      }
    } catch (err) {
      setError("La vérification a échoué. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  // Form for OTP verification
  if (verifying) {
    return (
      <SafeAreaView className="bg-white h-full">
        <CustomHeader h={120} title="Vérifiez votre numéro de téléphone" />
        <View className="pt-8 px-7">
          <TextInput
            className="mb-8 border py-3 px-4 rounded-md text-lg"
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
            keyboardType="phone-pad"
          />
          {error && (
            <Text className="mt-2" style={{ color: "red" }}>
              {error}
            </Text>
          )}
          <Pressable
            className={`bg-black w-full py-3 mb-7 flex items-center rounded-md ${
              !code ? "opacity-50" : ""
            }`}
            onPress={handleVerification}
            disabled={!code}
          >
            <Text className="text-white text-xl">Vérifier</Text>
          </Pressable>
        </View>

        {loading && <ActivityIndicator size="large" color={COLORS.orange} />}
      </SafeAreaView>
    );
  }

  // Form for phone number input
  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={100} title="Se connecter" />
      <View className="mt-10 px-5">
        <TextInput
          className="border py-3 px-4 rounded-md text-lg"
          value={phone}
          placeholder="Entrez votre numéro de téléphone"
          onChangeText={(phone) => setPhone(phone)}
          keyboardType="phone-pad"
        />
        {error && (
          <Text className="mt-2" style={{ color: "red" }}>
            {error}
          </Text>
        )}

        <Pressable
          className={`mt-8 bg-black w-full py-3 mb-7 flex items-center rounded-md `}
          onPress={handleSubmit}
        >
          <Text className="text-white text-xl">Continuer</Text>
        </Pressable>
        <View className="mt-5 flex flex-row justify-center gap-2">
          <Text className="text-lg">Pas encore de compte ?</Text>
          <Link href="/sign-up">
            <Text className="text-orange text-lg">S'inscrire</Text>
          </Link>
        </View>
        {loading && <ActivityIndicator />}
      </View>
    </SafeAreaView>
  );
}
