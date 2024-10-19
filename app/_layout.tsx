import * as SecureStore from "expo-secure-store";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/store";

export default function RootLayout() {
  const tokenCache = {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key);

        return item;
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  return (
    <Provider store={store}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </ClerkProvider>
    </Provider>
  );
}
