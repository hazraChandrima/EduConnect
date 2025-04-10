"use client"
import * as Location from "expo-location"
import * as Device from "expo-device"
import * as SecureStore from "expo-secure-store"
import SuspensionModal from "./components/auth/SuspensionModal"
import { useContext, useEffect, useState, useCallback } from "react"
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
  Linking,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "./styles/Login.styles"
import CustomAlert from "./components/auth/CustomAlert"
import { useAlert } from "./hooks/useAlert"


enum LoginStep {
  EMAIL = 0,
  VERIFY_OTP = 1,
  PASSWORD = 2,
}

// Define the type for context data
export type ContextDataType = {
  deviceId: string
  location: {
    latitude: number
    longitude: number
  }
  permissionStatus: string
  locationEnabled?: boolean
} | null

// Define AuthContext type
type AuthContextType = {
  user: any | null
  isLoading: boolean
  currentEmail: string | null
  isOtpVerified: boolean
  initiateLogin: (email: string) => Promise<boolean>
  verifyLoginOTP: (email: string, code: string) => Promise<boolean>
  completeLogin: (password: string, contextData: ContextDataType) => Promise<void>
  logout: () => Promise<void>
  resetAuthFlow: () => void
  // Suspension related props
  isSuspensionModalVisible: boolean
  suspendedUntil: string | null
  closeSuspensionModal: () => void
}

// Define AlertConfig type
type AlertConfig = {
  title: string
  message: string
  buttons: Array<{
    text: string
    onPress?: () => void
    style?: "default" | "cancel" | "destructive"
  }>
}

// Define AlertHook return type
type AlertHook = {
  showAlert: (config: AlertConfig) => void
  hideAlert: () => void
  isVisible: boolean
  alertConfig: AlertConfig
}

export default function LoginScreen() {
  const authContext = useContext(AuthContext) as AuthContextType | null
  const router = useRouter()
  const { showAlert, hideAlert, isVisible, alertConfig } = useAlert() as AlertHook

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<LoginStep>(LoginStep.EMAIL)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [progressAnim] = useState(new Animated.Value(0))
  const [otpError, setOtpError] = useState("")
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<string>("undetermined")
  const [locationFunctionallyEnabled, setLocationFunctionallyEnabled] = useState(true)
  const [contextData, setContextData] = useState<ContextDataType>(null)

  // Initialize state variables with default values
  const [locationPreferenceLoaded, setLocationPreferenceLoaded] = useState(false)

  // Custom alert states
  const [showLocationSettingsModal, setShowLocationSettingsModal] = useState(false)
  const [locationSettingsOptions, setLocationSettingsOptions] = useState<AlertConfig>({
    title: "",
    message: "",
    buttons: [],
  })

  useEffect(() => {
    console.log("[DEBUG] locationFunctionallyEnabled changed to:", locationFunctionallyEnabled)

    // Force re-render of relevant UI components
    const refreshLocationStatus = async () => {
      const data = await getContextData()
      setContextData(data)
    }

    refreshLocationStatus()
  }, [locationFunctionallyEnabled])

  useEffect(() => {
    const loadLocationPreference = async () => {
      try {
        if (Platform.OS === "web") {
          const savedPref = localStorage.getItem("locationEnabled")
          setLocationFunctionallyEnabled(savedPref !== "false")
        } else {
          const savedPref = await SecureStore.getItemAsync("locationEnabled")
          setLocationFunctionallyEnabled(savedPref !== "false")
        }

        // Get current permission status
        try {
          const { status } = await Location.getForegroundPermissionsAsync()
          setLocationPermissionStatus(status)
          console.log("Initial location permission status:", status)
        } catch (error) {
          console.error("Error getting location permission status:", error)
          setLocationPermissionStatus("error")
        }
      } catch (error) {
        console.error("Error loading location preference:", error)
      } finally {
        setLocationPreferenceLoaded(true) // Mark that the preference has been loaded
      }
    }

    loadLocationPreference()
  }, [])

  // Function to save the user's location preference
  const saveLocationPreference = async (enabled: boolean) => {
    try {
      console.log(`[DEBUG] Setting location preference to: ${enabled}`)
      // For web
      if (Platform.OS === "web") {
        localStorage.setItem("locationEnabled", enabled ? "true" : "false")
      }
      // For native platforms
      else {
        await SecureStore.setItemAsync("locationEnabled", enabled ? "true" : "false")
      }
      setLocationFunctionallyEnabled(enabled)
      console.log(`[DEBUG] Location functionally enabled state updated to: ${enabled}`)

      const updatedContextData = await getContextData()
      console.log("[DEBUG] Updated context data after preference change:", updatedContextData)
      setContextData(updatedContextData)
    } catch (error) {
      console.error("[ERROR] Error saving location preference:", error)
    }
  }

  useEffect(() => {
    const fetchContextData = async () => {
      const data = await getContextData()
      setContextData(data)
    }

    fetchContextData()
  }, [])

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep / 2) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }, [currentStep, progressAnim])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setResendDisabled(false)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const resetAuthFlow = useCallback(() => {
    setEmail("")
    setPassword("")
    setOtpCode("")
    setEmailError("")
    setPasswordError("")
    setOtpError("")
    setCurrentStep(LoginStep.EMAIL)
  }, [])

  const { user, isLoading: contextLoading, initiateLogin, verifyLoginOTP, completeLogin } = authContext || {}


  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      console.log(`User detected (${user.role}), navigating to dashboard...`);
      router.replace(`/${user.role}/${user.userId}` as never);
    }
  }, [user, isRedirecting]);


  useEffect(() => {
    return () => {
      resetAuthFlow()
    }
  }, [resetAuthFlow])

  useEffect(() => {
    if (email.trim() === "") {
      setEmailError("")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }, [email])

  const isEmailFilled = !!email.trim() && !emailError
  const isOtpFilled = !!otpCode.trim() && otpCode.length === 6
  const isPasswordFilled = !!password.trim()

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const toggleLocationPermission = async () => {
    try {
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync()
      console.log("Current permission status:", currentStatus)

      if (currentStatus === "granted") {
        if (Platform.OS === "web") {
          setLocationSettingsOptions({
            title: "Location Settings",
            message: "How would you like to manage location access?",
            buttons: [
              {
                text: "Disable In App",
                onPress: async () => {
                  console.log("[DEBUG] User selected: Disable In App")
                  await saveLocationPreference(false)
                  setLocationFunctionallyEnabled(false)

                  showAlert({
                    title: "Location Disabled",
                    message:
                      "Location tracking has been disabled within the app. The app will not collect your location data.",
                    buttons: [{ text: "OK" }],
                  })

                  const updatedData = await getContextData()
                  console.log("[DEBUG] Context data after disabling:", updatedData)
                },
              },
              {
                text: "Open Help",
                onPress: () => {
                  window.open("https://support.google.com/chrome/answer/114662", "_blank")
                },
              },
              {
                text: "Keep Enabled",
                onPress: async () => {
                  console.log("[DEBUG] User selected: Keep Enabled")
                  await saveLocationPreference(true)
                  setLocationFunctionallyEnabled(true)
                  const updatedData = await getContextData()
                  console.log("[DEBUG] Context data after keeping enabled:", updatedData)
                },
              },
            ],
          })
          setShowLocationSettingsModal(true)
        } else {
          Alert.alert("Location Settings", "How would you like to manage location access?", [
            {
              text: "Disable In App",
              onPress: async () => {
                console.log("[DEBUG] User selected: Disable In App")
                await saveLocationPreference(false)
                setLocationFunctionallyEnabled(false)

                Alert.alert(
                  "Location Disabled",
                  "Location tracking has been disabled within the app. The app will not collect your location data.",
                )
                const updatedData = await getContextData()
                console.log("[DEBUG] Context data after disabling:", updatedData)
              },
            },
            {
              text: "Open System Settings",
              onPress: () => {
                Linking.openSettings()
              },
            },
            {
              text: "Keep Enabled",
              style: "cancel",
              onPress: async () => {
                console.log("[DEBUG] User selected: Keep Enabled")
                await saveLocationPreference(true)
                setLocationFunctionallyEnabled(true)
                const updatedData = await getContextData()
                console.log("[DEBUG] Context data after keeping enabled:", updatedData)
              },
            },
          ])
        }
        return
      }

      if (Platform.OS === "web") {
        setShowPermissionModal(true)
      } else {
        if (currentStatus === "denied") {
          Alert.alert(
            "Location Permission Required",
            "This app needs your location to provide personalized services and security.",
            [
              { text: "Not Now", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
              {
                text: "Try Again",
                onPress: async () => {
                  const { status } = await Location.requestForegroundPermissionsAsync()
                  setLocationPermissionStatus(status)
                  if (status === "granted") {
                    saveLocationPreference(true)
                  }
                  console.log("New permission status:", status)
                },
              },
            ],
          )
        } else {
          const { status } = await Location.requestForegroundPermissionsAsync()
          setLocationPermissionStatus(status)
          if (status === "granted") {
            saveLocationPreference(true)
          }
          console.log("New permission status:", status)
        }
      }
    } catch (error) {
      console.error("Error requesting permission:", error)
    }
  }

  const handleEmailSubmit = async () => {
    if (!authContext) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      const success = await authContext.initiateLogin(email.trim())

      if (success) {
        setCurrentStep(LoginStep.VERIFY_OTP)
        setResendDisabled(true)
        setCountdown(60)

        if (Platform.OS === "web") {
          showAlert({
            title: "Verification Code Sent",
            message: "Please check your email for the verification code.",
            buttons: [{ text: "OK" }],
          })
        } else {
          Alert.alert("Verification Code Sent", "Please check your email for the verification code.")
        }
      } else {
        setEmailError("The email you've entered either does not exist or is not registered. Please contact the admin for help.")

        if (Platform.OS === "web") {
          showAlert({
            title: "Error",
            message: "Failed to send verification code. Please try again.",
            buttons: [{ text: "OK" }],
          })
        } else {
          Alert.alert("Error", "Failed to send verification code. Please try again.")
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("Login OTP request failed:", errorMessage)

      if (Platform.OS === "web") {
        showAlert({
          title: "Login Failed",
          message: errorMessage,
          buttons: [{ text: "OK" }],
        })
      } else {
        Alert.alert("Login Failed", errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (text: string) => {
    setEmail(text)
  }

  const handleVerifyOtp = async () => {
    if (!authContext) return

    setIsLoading(true)
    setOtpError("") // Clear previous error

    try {
      const success = await authContext.verifyLoginOTP(email.trim(), otpCode.trim())

      if (success) {
        setCurrentStep(LoginStep.PASSWORD)
      } else {
        setOtpError("Invalid verification code. Please try again.")
      }
    } catch (error) {
      console.error("OTP verification failed:", error)
      setOtpError("Verification failed. Please check the code or try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!authContext) return

    setIsLoading(true)
    try {
      const success = await authContext.initiateLogin(email.trim())

      if (success) {
        setResendDisabled(true)
        setCountdown(60)

        if (Platform.OS === "web") {
          showAlert({
            title: "Verification Code Sent",
            message: "A new verification code has been sent to your email.",
            buttons: [{ text: "OK" }],
          })
        } else {
          Alert.alert("Verification Code Sent", "A new verification code has been sent to your email.")
        }
      } else {
        if (Platform.OS === "web") {
          showAlert({
            title: "Error",
            message: "Failed to resend verification code. Please try again.",
            buttons: [{ text: "OK" }],
          })
        } else {
          Alert.alert("Error", "Failed to resend verification code. Please try again.")
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("Resend code failed:", errorMessage)

      if (Platform.OS === "web") {
        showAlert({
          title: "Failed to Resend Code",
          message: errorMessage,
          buttons: [{ text: "OK" }],
        })
      } else {
        Alert.alert("Failed to Resend Code", errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteLogin = async () => {
    if (!authContext) return

    setIsLoading(true)
    console.log("Attempting to log in...")
    setPasswordError("")

    try {
      const contextDataForLogin = await getContextData()
      console.log("Context Data for login:", contextDataForLogin)
      console.log("Location enabled status:", locationFunctionallyEnabled)
      console.log("Permission status:", locationPermissionStatus)

      // Add a visual indicator during login to show location status
      if (
        contextDataForLogin &&
        contextDataForLogin.location.latitude === 0 &&
        contextDataForLogin.location.longitude === 0
      ) {
        console.log("Logging in with zeroed location (disabled or unavailable)")
      } else {
        console.log("Logging in with actual location data")
      }

      if (!contextDataForLogin) {
        throw new Error("Unable to get device context data")
      }

      await authContext.completeLogin(password, contextDataForLogin)
      console.log("Login successful, waiting for user state update...")
    } catch (error) {
      console.error("Login failed:", error)
      setPasswordError("Login Failed, invalid credentials")

      if (Platform.OS === "web") {
        setTimeout(() => {
          showAlert({
            title: "Login Failed",
            message: "Invalid credentials",
            buttons: [{ text: "OK" }],
          })
        }, 100)
      } else {
        setTimeout(() => {
          Alert.alert("Login Failed", "Invalid credentials")
        }, 100)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getDeviceId = async (): Promise<string> => {
    if (Platform.OS === "web") {
      // Use localStorage for web instead of SecureStore
      let deviceId = localStorage.getItem("deviceId")

      if (!deviceId) {
        deviceId = `web-${Math.random().toString(36).substring(2, 15)}`
        localStorage.setItem("deviceId", deviceId)
      }

      return deviceId
    }

    // For native platforms, use SecureStore as before
    try {
      let deviceId = await SecureStore.getItemAsync("deviceId")

      if (!deviceId) {
        const deviceInfo =
          Device.osInternalBuildId ||
          Device.modelId ||
          Device.deviceName ||
          `device-${Math.random().toString(36).substring(2, 15)}`

        await SecureStore.setItemAsync("deviceId", deviceInfo as string)
        deviceId = deviceInfo as string
      }

      return deviceId ?? "unknown-device-id"
    } catch (error) {
      console.error("Error accessing secure storage:", error)
      return "unknown-device-id"
    }
  }

  const getContextData = async (): Promise<ContextDataType> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync()
      console.log("[DEBUG] Current permission status:", status)
      console.log("[DEBUG] Functionally enabled:", locationFunctionallyEnabled)
      setLocationPermissionStatus(status)

      const deviceId = await getDeviceId()

      // Check both conditions with explicit logging
      if (status !== "granted") {
        console.log("[DEBUG] Location access unavailable: Permission not granted")
        return {
          deviceId,
          location: { latitude: 0, longitude: 0 },
          permissionStatus: status,
          locationEnabled: false,
        }
      }

      if (!locationFunctionallyEnabled) {
        console.log("[DEBUG] Location access disabled in-app by user preference")
        return {
          deviceId,
          location: { latitude: 0, longitude: 0 },
          permissionStatus: status,
          locationEnabled: false,
        }
      }

      console.log("[DEBUG] Getting actual location coordinates...")
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })

        console.log("[DEBUG] Location retrieved successfully")
        return {
          deviceId,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          permissionStatus: status,
          locationEnabled: true,
        }
      } catch (locationError) {
        console.error("[ERROR] Error getting current position:", locationError)
        return {
          deviceId,
          location: { latitude: 0, longitude: 0 },
          permissionStatus: status,
          locationEnabled: false,
        }
      }
    } catch (error) {
      console.error("[ERROR] Error fetching context data:", error)
      return {
        deviceId: await getDeviceId(),
        location: { latitude: 0, longitude: 0 },
        permissionStatus: "error",
        locationEnabled: false,
      }
    }
  }

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

  const renderPermissionModal = () => {
    if (!showPermissionModal) return null

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Location Permission Required</Text>
          <Text style={styles.modalText}>
            This app needs your location to provide personalized services and enhanced security.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowPermissionModal(false)
                saveLocationPreference(false)
              }}
            >
              <Text style={styles.modalButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowPermissionModal(false)
                if (Platform.OS === "web") {
                  window.open("https://support.google.com/chrome/answer/114662", "_blank")
                }
              }}
            >
              <Text style={styles.modalButtonText}>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.primaryButton]}
              onPress={async () => {
                setShowPermissionModal(false)
                try {
                  const { status } = await Location.requestForegroundPermissionsAsync()
                  setLocationPermissionStatus(status)

                  // If granted, also enable functionally
                  if (status === "granted") {
                    saveLocationPreference(true)
                  }

                  // Refresh context data after permission change
                  const data = await getContextData()
                  setContextData(data)
                } catch (error) {
                  console.error("Error requesting location permission:", error)
                }
              }}
            >
              <Text style={styles.primaryButtonText}>Enable</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const renderEmailStep = () => {
    return (
      <>
        <Text style={styles.headerText}>Welcome Back</Text>
        <Text style={styles.subHeaderText}>Enter your email to continue</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={20} color={emailError ? "#ff3b30" : "#666"} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        {/* Enhanced Location Permission Button */}
        <TouchableOpacity
          style={[
            styles.permissionButton,
            locationPermissionStatus === "granted" && locationFunctionallyEnabled
              ? styles.permissionButtonEnabled
              : styles.permissionButtonDisabled,
          ]}
          onPress={toggleLocationPermission}
        >
          <View style={styles.permissionButtonContent}>
            <Ionicons
              name={
                locationPermissionStatus === "granted" && locationFunctionallyEnabled ? "location" : "location-outline"
              }
              size={20}
              color={locationPermissionStatus === "granted" && locationFunctionallyEnabled ? "#4caf50" : "#5c6bc0"}
            />
            <Text style={styles.permissionButtonText}>
              {locationPermissionStatus === "granted" && locationFunctionallyEnabled
                ? "Location Access Enabled"
                : locationPermissionStatus === "granted" && !locationFunctionallyEnabled
                  ? "Location Disabled (In App)"
                  : "Enable Location Access"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.loginButton, (!isEmailFilled || isLoading || contextLoading) && styles.disabledButton]}
          onPress={handleEmailSubmit}
          disabled={!isEmailFilled || isLoading || !!contextLoading}
        >
          {isLoading || contextLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        {/* <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View> */}
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
          {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.loginButton, (!isOtpFilled || isLoading || contextLoading) && styles.disabledButton]}
          onPress={handleVerifyOtp}
          disabled={!isOtpFilled || isLoading || !!contextLoading}
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
            <TouchableOpacity onPress={handleResendOtp} disabled={isLoading || !!contextLoading}>
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
          disabled={isLoading || !!contextLoading}
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
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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

  const renderLocationStatusButton = () => {
    const getStatusColor = () => {
      if (locationPermissionStatus === "granted" && locationFunctionallyEnabled) {
        return "#4caf50" // Green - fully enabled
      } else if (locationPermissionStatus === "granted" && !locationFunctionallyEnabled) {
        return "#ff9800" // Orange - permission granted but disabled in app
      } else if (locationPermissionStatus === "denied") {
        return "#f44336" // Red - denied
      } else {
        return "#9e9e9e" // Gray - undetermined
      }
    }

    const getStatusText = () => {
      if (locationPermissionStatus === "granted" && locationFunctionallyEnabled) {
        return "Location enabled"
      } else if (locationPermissionStatus === "granted" && !locationFunctionallyEnabled) {
        return "Location disabled (in app)"
      } else if (locationPermissionStatus === "denied") {
        return "Location denied"
      } else {
        return "Enable location"
      }
    }

    return (
      <TouchableOpacity
        style={[
          styles.locationStatusButton,
          { borderColor: getStatusColor(), backgroundColor: `${getStatusColor()}10` },
        ]}
        onPress={() => {
          console.log("[DEBUG] Location status button pressed")
          console.log(
            "[DEBUG] Current states - Permission:",
            locationPermissionStatus,
            "Enabled:",
            locationFunctionallyEnabled,
          )
          toggleLocationPermission()
        }}
      >
        <Ionicons
          name={locationFunctionallyEnabled ? "location" : "location-outline"}
          size={16}
          color={getStatusColor()}
        />

        <Text style={[styles.locationStatusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
      </TouchableOpacity>
    )
  }

  // Initialize alert states outside the conditional block
  let customAlertComponent = null
  let locationSettingsAlertComponent = null

  if (Platform.OS === "web") {
    customAlertComponent = (
      <CustomAlert
        visible={isVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
      />
    )

    locationSettingsAlertComponent = (
      <CustomAlert
        visible={showLocationSettingsModal}
        title={locationSettingsOptions.title}
        message={locationSettingsOptions.message}
        buttons={locationSettingsOptions.buttons}
        onClose={() => setShowLocationSettingsModal(false)}
      />
    )
  }

  if (!authContext) {
    if (Platform.OS === "web") {
      showAlert({
        title: "Error",
        message: "AuthContext is not available",
        buttons: [{ text: "OK" }],
      })
    } else {
      Alert.alert("Error", "AuthContext is not available")
    }
    return null
  }

  const { isSuspensionModalVisible, suspendedUntil, closeSuspensionModal } = authContext

  return (
    <SafeAreaView style={styles.container}>
      {renderPermissionModal()}

      <SuspensionModal
        isVisible={isSuspensionModalVisible}
        suspendedUntil={suspendedUntil}
        onClose={closeSuspensionModal}
      />

      {/* Custom Alert for web */}
      {Platform.OS === "web" && (
        <>
          {customAlertComponent}
          {locationSettingsAlertComponent}
        </>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            {renderLocationStatusButton()}

            {renderProgressBar()}

            {currentStep === LoginStep.EMAIL && renderEmailStep()}
            {currentStep === LoginStep.VERIFY_OTP && renderOtpStep()}
            {currentStep === LoginStep.PASSWORD && renderPasswordStep()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
