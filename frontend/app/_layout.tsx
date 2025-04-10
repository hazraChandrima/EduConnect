import { Stack } from "expo-router"
import { AuthProvider } from "./context/AuthContext"

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ title: "Login", headerShown: true }} />
        <Stack.Screen name="forgotPassword" options={{ title: "Forgot Password", headerShown: true }} />
        <Stack.Screen name="resetPassword" options={{ title: "Reset Password", headerShown: true }} />
        <Stack.Screen name="[role]" options={{ headerShown: false }} />
        <Stack.Screen name="chatbotScreen" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  )
}
