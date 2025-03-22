import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
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
import styles from "./styles/Register.styles";


export default function RegisterScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    Alert.alert("Error", "AuthContext is not available");
    return null;
  }

  const { login, user } = authContext;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [role, setRole] = useState("student");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isAllFilled = !!(
    name.trim() &&
    email.trim() &&
    password.trim() &&
    role.trim()
  );

  // Role options
  const roleOptions = ["student", "professor", "admin"];

  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      console.log(`User registered (${user.role}), navigating to dashboard...`);
      router.replace(`/${user.role}Dashboard`);
    }
  }, [user]);



  const handleRegister = async (): Promise<void> => {
    setIsLoading(true); // Start loading spinner
    console.log("Attempting to register...");

    try {
      const response = await fetch(
        "http://192.168.224.247:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(), // Added `.trim()` to password for safety
            role: role.trim(),
          }),
        }
      );

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("Registration successful, now logging in...");
      await login(email, password);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Registration failed:", errorMessage);
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false); // Stop loading spinner in all cases
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
            <Text style={styles.headerText}>Create Account</Text>
            <Text style={styles.subHeaderText}>
              Please fill in your details to register
            </Text>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

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
                  placeholder="Create a password"
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

            {/* Role Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleContainer}>
                {roleOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.roleOption,
                      role === option && styles.roleOptionSelected,
                    ]}
                    onPress={() => setRole(option)}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        role === option && styles.roleTextSelected,
                      ]}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                (!isAllFilled || isLoading) && styles.disabledButton,
              ]}
              onPress={handleRegister}
              disabled={!isAllFilled || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity>


            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}