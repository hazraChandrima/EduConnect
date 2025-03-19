import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      Alert.alert('Success', 'Password reset successfully. Please log in.');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text>Enter your new password:</Text>
      <TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="New Password" />
      <Button title="Reset Password" onPress={handleResetPassword} disabled={isLoading} />
    </View>
  );
}
