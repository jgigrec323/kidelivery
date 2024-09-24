import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, Button, View, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/custom-header";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={150} title="Se connecter"></CustomHeader>
      <View className="mt-10 px-5">
        <TextInput
          className="border py-3 px-4 rounded-md border-gray-300 text-lg"
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          value={password}
          className="mt-5 mb-10 border py-3 px-4 rounded-md border-gray-300 text-lg"
          placeholder="Password..."
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <Pressable
          className="bg-black w-full py-3 mb-7 flex items-center rounded-md"
          onPress={onSignInPress}
        >
          <Text className="text-white text-xl">Se connecter</Text>
        </Pressable>
        <View className="mt-5 flex flex-row justify-center gap-2">
          <Text className="text-lg">Pas encore de compte ?</Text>
          <Link href="/sign-up">
            <Text className="text-orange text-lg">S'inscrire</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
