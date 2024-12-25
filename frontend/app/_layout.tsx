import { router, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://9c0e2e7557f8e22a775a5ff43b743036@o4508518477463552.ingest.us.sentry.io/4508518478970880",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === null) {
        await AsyncStorage.setItem("hasLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null; // or a loading spinner
  }

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen
            name="Screens/Welcome/OnboardingScreens"
            options={{ title: "Onboarding" }}
          />
        ) : (
          <>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen
              name="Screens/Login/LoginScreen"
              options={{ title: "Login" }}
            />
            <Stack.Screen
              name="Screens/Register/RegisterScreen"
              options={{ title: "Register" }}
            />
            <Stack.Screen
              name="Screens/Home/HomeScreen"
              options={{ title: "HomeScreen" }}
            />
            <Stack.Screen
              name="Screens/Record/RecordScreen"
              options={{ title: "RecordScreen" }}
            />
            <Stack.Screen
              name="Screens/Stored/StoredScreen"
              options={{ title: "StoredScreen" }}
            />
          </>
        )}
      </Stack>
    </PaperProvider>
  );
}
