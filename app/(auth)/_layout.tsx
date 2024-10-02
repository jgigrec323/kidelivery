import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(home)/(tabs)"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Se connecter",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "S'inscrire",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
