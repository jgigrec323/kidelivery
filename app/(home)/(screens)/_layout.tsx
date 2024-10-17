import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="history"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="finances"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="contactus"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="change-name"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="change-phone"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="manage-shops"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
