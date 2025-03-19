import { useContext, useEffect , useState } from 'react';
import { AuthContext } from './AuthContext';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    Alert.alert("Error", "AuthContext is not available");
    return null;
  }

  const { login, user } = authContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      console.log(` User detected (${user.role}), navigating to dashboard...`);
      router.replace(`/(tabs)/${user.role}Dashboard`);
    }
  }, [user]);

  const handleLogin = async () => {
    console.log("Attempting to log in...");
    try {
      await login(email, password);
      console.log("Login successful, waiting for user state update...");
    } catch (error) {
      console.error("Login failed:");
      Alert.alert('Login Failed','Invalid credentials');
    }
  };

  return (
    <View>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password:</Text>
      <TextInput value={password} secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Forgot Password?" onPress={() => router.push('/forgotPassword')} />
    </View>
  );
}
