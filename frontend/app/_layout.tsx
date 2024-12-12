import "@expo/metro-runtime";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "../global.css";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
