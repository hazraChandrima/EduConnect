import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Index() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const { user, isLoading } = authContext;
  const router = useRouter();
  const [isAppMounted, setIsAppMounted] = useState(false);

  useEffect(() => {
    console.log("🟡 Checking navigation...");

    // Ensure the app has mounted before trying to navigate
    const timeout = setTimeout(() => setIsAppMounted(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isAppMounted && !isLoading) {
      if (user) {
        console.log(`✅ User detected (${user.role}), redirecting...`);
        router.replace('/(tabs)/studentDashboard');  // ✅ Ensure this path exists
      } else {
        console.log("🔴 No user, redirecting to login...");
        router.replace('/login');
      }
    }
  }, [isAppMounted, isLoading, user]);

  if (isLoading || !isAppMounted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
}
