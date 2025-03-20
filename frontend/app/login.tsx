import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useRouter } from "expo-router";
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
import styles from "./styles/Login.styles";


export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    Alert.alert("Error", "AuthContext is not available");
    return null;
  }

  const { login, user } = authContext;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    const isAllFilled = !!(
      email.trim() &&
      password.trim()
    );

  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      console.log(`User detected (${user.role}), navigating to dashboard...`);
      router.replace(`/(tabs)/${user.role}Dashboard`);
    }
  }, [user]);

  const handleLogin = async () => {
    // Input validation
    if (!email.trim() || !password.trim()) {
      console.log("Validation failed, showing alert");
      setTimeout(() => {
        Alert.alert("Invalid Input", "Email and password are required.");
      }, 100);
      return;
    }

    setIsLoading(true);
    console.log("Attempting to log in...");

    try {
      await login(email, password);
      console.log("Login successful, waiting for user state update...");
    } catch (error) {
      console.error("Login failed:");
      setTimeout(() => {
        Alert.alert("Login Failed", "Invalid credentials");
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.headerText}>Welcome Back</Text>
            <Text style={styles.subHeaderText}>Sign in to continue</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => router.push("/forgotPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (!isAllFilled || isLoading) && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={!isAllFilled || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>


            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Test Alert Button - Uncomment for debugging */}
            {/* <TouchableOpacity 
              style={styles.testButton} 
              onPress={() => {
                console.log("Test alert button pressed");
                setTimeout(() => Alert.alert("Test", "This is a test alert"), 100);
              }}
            >
              <Text style={styles.testButtonText}>Test Alert</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
