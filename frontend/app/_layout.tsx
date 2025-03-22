import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext"; // Ensure correct path

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" options={{ title: "Login", headerShown: true }} />
        <Stack.Screen name="register" options={{ title: "Register", headerShown: true }} />
        <Stack.Screen name="studentDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="professorDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="adminDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="chatbotScreen" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
