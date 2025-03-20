import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link.');
      }

      Alert.alert('Success', 'Reset link sent to your email.');
    } catch (error) {
      Alert.alert('Error','Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text>Enter your email to reset your password:</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
      <Button title="Send Reset Link" onPress={handleForgotPassword} disabled={isLoading} />
    </View>
  );
}
