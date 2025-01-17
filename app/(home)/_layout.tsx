import { NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <NavigationContainer>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(screens)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </NavigationContainer>
  );
}
