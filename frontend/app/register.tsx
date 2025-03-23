// This is a Node.js script to show the enhanced registration screen code
// You should copy this into your React Native project

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
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "./styles/Register.styles";

// Define the registration steps
enum RegistrationStep {
  INITIAL_INFO = 0,
  VERIFY_EMAIL = 1,
  CREATE_PASSWORD = 2,
  COMPLETE = 3,
}

// Define the interface for registration data
interface RegistrationData {
  name: string;
  email: string;
  password: string;
  role: string;
  verificationCode: string;
}

export default function RegisterScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    Alert.alert("Error", "AuthContext is not available");
    return null;
  }

  const { login, user } = authContext;

  // State for registration data
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: "",
    email: "",
    password: "",
    role: "student",
    verificationCode: "",
  });

  // State for UI control
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.INITIAL_INFO);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Animation value for progress bar
  const [progressAnim] = useState(new Animated.Value(0));

  // Role options
  const roleOptions = ["student", "professor", "admin"];

  // Update progress bar when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep / 3) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // Handle countdown for resend code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if user is authenticated
  useEffect(() => {
    if (user && !isRedirecting && currentStep === RegistrationStep.COMPLETE) {
      setIsRedirecting(true);
      console.log(`User registered (${user.role}), navigating to dashboard...`);
      router.replace(`/${user.role}Dashboard`);
    }
  }, [user, currentStep]);

  // Check if initial form is filled
  const isInitialFormFilled = !!(
    registrationData.name.trim() &&
    registrationData.email.trim() &&
    registrationData.role.trim()
  );

  // Check if verification code is filled
  const isVerificationCodeFilled = !!(
    registrationData.verificationCode.trim().length === 6
  );

  // Check if password is filled
  const isPasswordFilled = !!(
    registrationData.password.trim().length >= 6
  );

  // Handle input changes
  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle initial form submission (name, email, role)
  const handleInitialSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registrationData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Send request to initiate registration and send verification code
      const response = await fetch(
        "http://192.168.224.247:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: registrationData.name.trim(),
            email: registrationData.email.trim(),
            password: "temporary_" + Math.random().toString(36).substring(2),
            role: registrationData.role.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate registration");
      }

      setCurrentStep(RegistrationStep.VERIFY_EMAIL);

      // Start countdown for resend
      setResendDisabled(true);
      setCountdown(60);

      Alert.alert(
        "Verification Code Sent",
        "Please check your email for the verification code."
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Initial registration failed:", errorMessage);
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://192.168.224.247:3000/api/auth/verifyEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            code: registrationData.verificationCode.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid verification code");
      }

      // Move to password creation step
      setCurrentStep(RegistrationStep.CREATE_PASSWORD);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Verification failed:", errorMessage);
      Alert.alert("Verification Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Re-send the initial registration request to trigger a new verification code
      const response = await fetch(
        "http://192.168.224.247:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: registrationData.name.trim(),
            email: registrationData.email.trim(),
            role: registrationData.role.trim(),
            password: "temporary_" + Math.random().toString(36).substring(2),
            // Send a temporary password that will be updated later
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification code");
      }

      // Start countdown for resend
      setResendDisabled(true);
      setCountdown(60);

      Alert.alert(
        "Verification Code Sent",
        "A new verification code has been sent to your email."
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Resend code failed:", errorMessage);
      Alert.alert("Failed to Resend Code", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password submission and complete registration
  const handleCompleteRegistration = async () => {
    setIsLoading(true);
    try {
      // Update the user's password
      const response = await fetch(
        "http://192.168.224.247:3000/api/auth/updatePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: registrationData.email.trim(),
            password: registrationData.password.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      // Move to complete step
      setCurrentStep(RegistrationStep.COMPLETE);

      // Log in the user
      await login(registrationData.email, registrationData.password, true);

      Alert.alert(
        "Registration Complete",
        "Your account has been created successfully!"
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Complete registration failed:", errorMessage);
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Render progress bar
  const renderProgressBar = () => {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
            },
          ]}
        />
      </View>
    );
  };

  // Render step indicator
  // const renderStepIndicator = () => {
  //   return (
  //     <View style={styles.stepIndicatorContainer}>
  //       {[0, 1, 2].map((step) => (
  //         <View
  //           key={step}
  //           style={[
  //             styles.stepDot,
  //             currentStep >= step ? styles.stepDotActive : {},
  //           ]}
  //         >
  //           {currentStep > step && (
  //             <Ionicons name="checkmark" size={12} color="white" />
  //           )}
  //         </View>
  //       ))}
  //     </View>
  //   );
  // };

  // Render initial form (name, email, role)
  const renderInitialForm = () => {
    return (
      <>
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
              value={registrationData.name}
              onChangeText={(value) => handleInputChange("name", value)}
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
              value={registrationData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
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
                  registrationData.role === option && styles.roleOptionSelected,
                ]}
                onPress={() => handleInputChange("role", option)}
              >
                <Text
                  style={[
                    styles.roleText,
                    registrationData.role === option && styles.roleTextSelected,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            (!isInitialFormFilled || isLoading) && styles.disabledButton,
          ]}
          onPress={handleInitialSubmit}
          disabled={!isInitialFormFilled || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </>
    );
  };

  // Render verification form
  const renderVerificationForm = () => {
    return (
      <>
        <Text style={styles.headerText}>Verify Your Email</Text>
        <Text style={styles.subHeaderText}>
          We've sent a verification code to {registrationData.email}
        </Text>

        {/* Verification Code Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Verification Code</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="key-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={registrationData.verificationCode}
              onChangeText={(value) => handleInputChange("verificationCode", value)}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            (!isVerificationCodeFilled || isLoading) && styles.disabledButton,
          ]}
          onPress={handleVerifyCode}
          disabled={!isVerificationCodeFilled || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          {resendDisabled ? (
            <Text style={styles.countdownText}>Resend in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentStep(RegistrationStep.INITIAL_INFO)}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={20} color="#5c51f3" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </>
    );
  };

  // Render password form
  const renderPasswordForm = () => {
    return (
      <>
        <Text style={styles.headerText}>Create Password</Text>
        <Text style={styles.subHeaderText}>
          Your email has been verified. Now create a secure password.
        </Text>

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
              value={registrationData.password}
              onChangeText={(value) => handleInputChange("password", value)}
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
          <Text style={styles.passwordHint}>
            Password must be at least 6 characters
          </Text>
        </View>

        {/* Complete Registration Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            (!isPasswordFilled || isLoading) && styles.disabledButton,
          ]}
          onPress={handleCompleteRegistration}
          disabled={!isPasswordFilled || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Complete Registration</Text>
          )}
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentStep(RegistrationStep.VERIFY_EMAIL)}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={20} color="#5c51f3" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </>
    );
  };

  // Render completion screen
  const renderCompletionScreen = () => {
    return (
      <View style={styles.completionContainer}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        <Text style={styles.completionHeader}>Registration Complete!</Text>
        <Text style={styles.completionText}>
          Your account has been created successfully. You will be redirected to your dashboard.
        </Text>
        <ActivityIndicator size="large" color="#5c51f3" style={styles.redirectLoader} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            {/* Progress Bar and Step Indicator */}
            {currentStep < RegistrationStep.COMPLETE && (
              <>
                {renderProgressBar()}
                {/* {renderStepIndicator()} */}
              </>
            )}

            {/* Render the appropriate form based on current step */}
            {currentStep === RegistrationStep.INITIAL_INFO && renderInitialForm()}
            {currentStep === RegistrationStep.VERIFY_EMAIL && renderVerificationForm()}
            {currentStep === RegistrationStep.CREATE_PASSWORD && renderPasswordForm()}
            {currentStep === RegistrationStep.COMPLETE && renderCompletionScreen()}

            {/* Login Link - show only on initial step */}
            {currentStep === RegistrationStep.INITIAL_INFO && (
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}