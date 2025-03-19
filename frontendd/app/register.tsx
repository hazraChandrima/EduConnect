import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function RegisterScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    Alert.alert("Error", "AuthContext is not available");
    return null;
  }

  const { login, user } = authContext;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      console.log(`User registered (${user.role}), navigating to dashboard...`);
      router.replace(`/(tabs)/${user.role}Dashboard`);
    }
  }, [user]);

  const handleRegister = async () => {
    console.log("Attempting to register...");
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log("Registration successful, now logging in...");
      await login(email, password); // Automatically logs in after registration
    } catch (error) {
      console.error("Registration failed:");
      Alert.alert('Registration Failed','Please try again');
    }
  };

  return (
    <View>
      <Text>Name:</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password:</Text>
      <TextInput value={password} secureTextEntry onChangeText={setPassword} />
      
      <Text>Role:</Text>
      <TextInput value={role} onChangeText={setRole} />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
