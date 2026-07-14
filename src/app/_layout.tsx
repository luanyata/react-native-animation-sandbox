import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main List Menu */}
        <Stack.Screen name="index" />

        {/* Group Folders */}
        <Stack.Screen name="(sea)" />
        <Stack.Screen name="(apple)/appleInvites" />
      </Stack>
    </GestureHandlerRootView>
  );
}