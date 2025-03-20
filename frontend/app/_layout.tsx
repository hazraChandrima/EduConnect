import { Stack } from 'expo-router';
import { AuthProvider } from './AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
