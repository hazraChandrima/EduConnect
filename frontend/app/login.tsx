"use client"

import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./context/AuthContext"
import { useRouter } from "expo-router"
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
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "./styles/Login.styles"


enum LoginStep {
  EMAIL = 0,
  VERIFY_OTP = 1,
  PASSWORD = 2,
}

export default function LoginScreen() {
  const authContext = useContext(AuthContext)
  const router = useRouter()

  if (!authContext) {
    Alert.alert("Error", "AuthContext is not available")
    return null
  }

  const { user, isLoading: contextLoading, requestLoginOTP, verifyLoginOTP, login, resetAuthFlow } = authContext
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<LoginStep>(LoginStep.EMAIL)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Animation value for progress bar
  const [progressAnim] = useState(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep / 2) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }, [currentStep])

  // Handle countdown for resend code
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setResendDisabled(false)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // Redirect if user is authenticated
  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true)
      console.log(`User detected (${user.role}), navigating to dashboard...`)
      router.replace(`/${user.role}Dashboard`)
    }
  }, [user])

  // Reset auth flow when component unmounts
  useEffect(() => {
    return () => {
      resetAuthFlow()
    }
  }, [])

  const isEmailFilled = !!email.trim()
  const isOtpFilled = !!otpCode.trim() && otpCode.length === 6
  const isPasswordFilled = !!password.trim()


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleEmailSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      const success = await requestLoginOTP(email.trim())

      if (success) {
        // Move to OTP verification step
        setCurrentStep(LoginStep.VERIFY_OTP)

        // Start countdown for resend
        setResendDisabled(true)
        setCountdown(60)

        Alert.alert("Verification Code Sent", "Please check your email for the verification code.")
      } else {
        Alert.alert("Error", "Failed to send verification code. Please try again.")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("Login OTP request failed:", errorMessage)
      Alert.alert("Login Failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setIsLoading(true)
    try {
      const success = await verifyLoginOTP(email.trim(), otpCode.trim())

      if (success) {
        setCurrentStep(LoginStep.PASSWORD)
      } else {
        Alert.alert("Error", "Invalid verification code. Please try again.")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("OTP verification failed:", errorMessage)
      Alert.alert("Verification Failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    try {
      const success = await requestLoginOTP(email.trim())

      if (success) {
        setResendDisabled(true)
        setCountdown(60)

        Alert.alert("Verification Code Sent", "A new verification code has been sent to your email.")
      } else {
        Alert.alert("Error", "Failed to resend verification code. Please try again.")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("Resend code failed:", errorMessage)
      Alert.alert("Failed to Resend Code", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }


  const handleCompleteLogin = async () => {
    setIsLoading(true)
    console.log("Attempting to log in...")

    try {
      await login(email, password, true)
      console.log("Login successful, waiting for user state update...")
    } catch (error) {
      console.error("Login failed:")
      setTimeout(() => {
        Alert.alert("Login Failed", "Invalid credentials")
      }, 100)
    } finally {
      setIsLoading(false)
    }
  }

  // Render progress bar
  const renderProgressBar = () => {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    })

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
    )
  }

  // Render email step
  const renderEmailStep = () => {
    return (
      <>
        <Text style={styles.headerText}>Welcome Back</Text>
        <Text style={styles.subHeaderText}>Enter your email to continue</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
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

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.loginButton, (!isEmailFilled || isLoading || contextLoading) && styles.disabledButton]}
          onPress={handleEmailSubmit}
          disabled={!isEmailFilled || isLoading || contextLoading}
        >
          {isLoading || contextLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  // Render OTP verification step
  const renderOtpStep = () => {
    return (
      <>
        <Text style={styles.headerText}>Verify Your Email</Text>
        <Text style={styles.subHeaderText}>We've sent a verification code to {email}</Text>

        {/* OTP Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Verification Code</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={otpCode}
              onChangeText={setOtpCode}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.loginButton, (!isOtpFilled || isLoading || contextLoading) && styles.disabledButton]}
          onPress={handleVerifyOtp}
          disabled={!isOtpFilled || isLoading || contextLoading}
        >
          {isLoading || contextLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          {resendDisabled ? (
            <Text style={styles.countdownText}>Resend in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp} disabled={isLoading || contextLoading}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setCurrentStep(LoginStep.EMAIL)
            resetAuthFlow()
          }}
          disabled={isLoading || contextLoading}
        >
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </>
    )
  }

  // Render password step
  const renderPasswordStep = () => {
    return (
      <>
        <Text style={styles.headerText}>Enter Password</Text>
        <Text style={styles.subHeaderText}>
          Your identity has been verified. Please enter your password to continue.
        </Text>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => router.push("/forgotPassword")}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, (!isPasswordFilled || isLoading || contextLoading) && styles.disabledButton]}
          onPress={handleCompleteLogin}
          disabled={!isPasswordFilled || isLoading || contextLoading}
        >
          {isLoading || contextLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentStep(LoginStep.VERIFY_OTP)}
          disabled={isLoading || contextLoading}
        >
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            {/* Progress Bar */}
            {renderProgressBar()}

            {/* Render the appropriate step */}
            {currentStep === LoginStep.EMAIL && renderEmailStep()}
            {currentStep === LoginStep.VERIFY_OTP && renderOtpStep()}
            {currentStep === LoginStep.PASSWORD && renderPasswordStep()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

