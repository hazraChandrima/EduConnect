import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import forgotResetPassStyle from "./styles/Forgot_ResetPassword.style";
import { APP_CONFIG } from "@/app-config";

const API_BASE_URL = APP_CONFIG.API_BASE_URL;


export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams() as { token: string };
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState("");


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };


  const validatePassword = (value: string): void => {
    const length: boolean = value.length >= 8;
    const hasDigit: boolean = /\d/.test(value);
    const hasLowerCase: boolean = /[a-z]/.test(value);

    if (!length) {
      setPasswordError("Password must be at least 8 characters!");
    } else if (!hasDigit) {
      setPasswordError("Password must include at least one digit!");
    } else if (!hasLowerCase) {
      setPasswordError("Password must include at least one lowercase letter!");
    } else {
      setPasswordError("");
    }
  };


  useEffect(() => {
    const isPasswordsMatch = () => {
      if(newPassword != confirmPassword){
        setPasswordsMatch("Passwords do not match");
      } else {
        setPasswordsMatch("");
      }
    }

    isPasswordsMatch();
  }, [confirmPassword]);


  const handleResetPassword = async () => {
    // Validation
    if (!newPassword.trim()) {
      setTimeout(() => {
        Alert.alert("Invalid Input", "Please enter a new password.");
      }, 100);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordsMatch("Passwords do not match");
      setTimeout(() => {
        Alert.alert(
          "Password Mismatch",
          "Your passwords do not match. Please try again."
        );
      }, 100);
      return;
    }

    if (passwordError) {
      setTimeout(() => {
        console.log("Password must be at least 8 characters long.");
        Alert.alert(
          "Weak Password",
          "Password must be at least 8 characters long."
        );
      }, 100);
      return;
    }

    setIsLoading(true);

    try {
      console.log(token, newPassword);
      const response = await fetch(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setTimeout(() => {
        console.log("password reset successfully.");
        Alert.alert(
          "Success",
          "Your password has been reset successfully. Please log in with your new password.",
          [{ text: "OK", onPress: () => router.replace("/login") }]
        );
      }, 100);
    } catch (error) {
      setTimeout(() => {
        console.log(
          "Something went wrong. The link may have expired. Please try again"
        );
        Alert.alert(
          "Error",
          "Something went wrong. The link may have expired. Please try again."
        );
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <SafeAreaView style={forgotResetPassStyle.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={forgotResetPassStyle.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={forgotResetPassStyle.scrollContent}>
          <View style={forgotResetPassStyle.formContainer}>
            <Text style={forgotResetPassStyle.headerText}>Reset Password</Text>
            <Text style={forgotResetPassStyle.subHeaderText}>
              Create a new password for your account
            </Text>

            {/* New Password Input */}
            <View style={forgotResetPassStyle.inputContainer}>
              <Text style={forgotResetPassStyle.inputLabel}>New Password</Text>
              <View style={forgotResetPassStyle.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={forgotResetPassStyle.inputIcon}
                />
                <TextInput
                  style={forgotResetPassStyle.input}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    validatePassword(text);
                  }}
                  secureTextEntry={!passwordVisible}
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={forgotResetPassStyle.eyeIcon}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={forgotResetPassStyle.container}>
              {passwordError && (
                <Text style={forgotResetPassStyle.errorText}>
                  {passwordError}
                </Text>
              )}
              <Text style={forgotResetPassStyle.instructionText}>
                Password should be at least 8 characters including a number and
                a lowercase letter.
              </Text>
            </View>

            {/* Confirm Password Input */}
            <View style={forgotResetPassStyle.inputContainer}>
              <Text style={forgotResetPassStyle.inputLabel}>
                Confirm Password
              </Text>
              <View style={forgotResetPassStyle.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={forgotResetPassStyle.inputIcon}
                />
                <TextInput
                  style={forgotResetPassStyle.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!confirmPasswordVisible}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={toggleConfirmPasswordVisibility}
                  style={forgotResetPassStyle.eyeIcon}
                >
                  <Ionicons
                    name={
                      confirmPasswordVisible ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {passwordsMatch && (
                <Text style={forgotResetPassStyle.errorText}>
                  {passwordsMatch}
                </Text>
              )}
            </View>

            {/* Reset Password Button */}
            <TouchableOpacity
              style={[
                forgotResetPassStyle.primaryButton,
                (!newPassword || isLoading || !!passwordError || !!passwordsMatch) && forgotResetPassStyle.disabledButton]}
              onPress={handleResetPassword}
              disabled={!newPassword || isLoading || !!passwordError || !!passwordsMatch}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={forgotResetPassStyle.primaryButtonText}>
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={forgotResetPassStyle.linkContainer}>
              <Text style={forgotResetPassStyle.linkText}>
                Remembered your password?
              </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={forgotResetPassStyle.link}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
