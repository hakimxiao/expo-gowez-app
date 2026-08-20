import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import "../global.css";

// Prevent the native splash screen from auto-hiding before we're ready.
// Wrapped in try-catch to handle JS reloads where it may already be dismissed.
try {
  SplashScreen.preventAutoHideAsync();
} catch {
  // Native splash already gone (e.g., dev reload) — safe to ignore.
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

LogBox.ignoreLogs(["Clerk:"]);

/**
 * Reusable splash view shown while loading (fonts or Clerk).
 * Mirrors the native splash config in app.json so there's no visible change.
 */
function AppSplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#208AEF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../../assets/images/splash.png")}
        style={{ width: 76, height: 76 }}
        resizeMode="contain"
      />
    </View>
  );
}

/**
 * Inner navigator that lives inside ClerkProvider so it can access Clerk state.
 * Hides the native splash screen only after Clerk is fully initialized,
 * preventing the white-screen flash between native splash dismiss and Clerk ready.
 */
function RootLayoutNav() {
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  // Clerk hasn't finished initializing yet — keep showing the JS splash.
  if (!isLoaded) {
    return <AppSplashScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Jakarta-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    Jakarta: require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  // Fonts still loading — show JS splash so there's no white screen.
  if (!fontsLoaded) {
    return <AppSplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StatusBar style="dark" />
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <RootLayoutNav />
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
