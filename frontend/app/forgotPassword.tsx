import { useState } from "react";
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
import { useRouter } from "expo-router";
import forgotResetPassStyle from "./styles/Forgot_ResetPassword.style";
import { APP_CONFIG } from "@/app-config";


const API_BASE_URL = APP_CONFIG.API_BASE_URL


export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  const handleForgotPassword = async () => {
    // Validate email
    if (!email.trim()) {
      setTimeout(() => {
        Alert.alert("Invalid Input", "Please enter your email address.");
      }, 100);
      return;
    }

    setIsLoading(true);
    setSuccessMessage(""); // Clear previous success message
    setEmailError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link.");
      }

      setSuccessMessage("Password reset instructions have been sent to your email.");

      // setTimeout(() => {
      //   Alert.alert(
      //     "Success",
      //     "Password reset instructions have been sent to your email.",
      //     [{ text: "OK", onPress: () => router.back() }]
      //   );
      // }, 100);


    } 
    
    catch (error) {
      setEmailError(
        "The email you've entered is either invalid or does not exist."
      );
      console.log("Something went wrong");
      setTimeout(() => {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={forgotResetPassStyle.container}>
      <TouchableOpacity
        style={forgotResetPassStyle.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#4b5563" />
        <Text style={forgotResetPassStyle.backButtonText}>Back</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={forgotResetPassStyle.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={forgotResetPassStyle.scrollContent}>
          <View style={forgotResetPassStyle.formContainer}>
            <Text style={forgotResetPassStyle.headerText}>Forgot Password</Text>
            <Text style={forgotResetPassStyle.subHeaderText}>
              Enter your email and we'll send you instructions to reset your
              password
            </Text>

            {/* Email Input */}
            <View style={forgotResetPassStyle.inputContainer}>
              <Text style={forgotResetPassStyle.inputLabel}>Email</Text>
              <View style={forgotResetPassStyle.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={forgotResetPassStyle.inputIcon}
                />
                <TextInput
                  style={forgotResetPassStyle.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? (
                <Text style={forgotResetPassStyle.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Send Reset Link Button */}
            <TouchableOpacity
              style={forgotResetPassStyle.primaryButton}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={forgotResetPassStyle.primaryButtonText}>
                  Send Reset Link
                </Text>
              )}
            </TouchableOpacity>

            {/* Success Message */}
            {successMessage ? (
              <Text
                style={{ color: "green", marginTop: 15, textAlign: "center" }}
              >
                {successMessage}
              </Text>
            ) : null}

            {/* Login Link */}
            <View style={forgotResetPassStyle.linkContainer}>
              <Text style={forgotResetPassStyle.linkText}>
                Remembered your password?
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={forgotResetPassStyle.link}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
