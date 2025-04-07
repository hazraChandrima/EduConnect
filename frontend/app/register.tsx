import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { useContext, useEffect, useState, useCallback } from "react";
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
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles/Register.styles";
import CustomAlert from "./components/CustomAlert";
import { useAlert } from "./hooks/useAlert";
import { APP_CONFIG } from "@/app-config";

const API_BASE_URL = APP_CONFIG.API_BASE_URL;


enum RegistrationStep {
  INITIAL_INFO = 0,
  VERIFY_EMAIL = 1,
  CREATE_PASSWORD = 2,
  COMPLETE = 3,
}

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  role: string;
  verificationCode: string;
}

// Define the type for context data
export interface ContextDataType {
  deviceId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  permissionStatus: string;
  locationEnabled?: boolean;
}

export default function RegisterScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { showAlert, hideAlert, isVisible, alertConfig } = useAlert();

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: "",
    email: "",
    password: "",
    role: "student",
    verificationCode: "",
  });

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.INITIAL_INFO);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [progressAnim] = useState(new Animated.Value(0));
  const [locationFunctionallyEnabled, setLocationFunctionallyEnabled] = useState(true);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<string>("undetermined");
  const [contextData, setContextData] = useState<ContextDataType | null>(null);

  const roleOptions = ["student", "professor", "admin"];

  // Load location preferences on component mount
  useEffect(() => {
    const loadLocationPreference = async () => {
      try {
        if (Platform.OS === 'web') {
          const savedPref = localStorage.getItem("locationEnabled");
          setLocationFunctionallyEnabled(savedPref !== "false");
        } else {
          const savedPref = await SecureStore.getItemAsync("locationEnabled");
          setLocationFunctionallyEnabled(savedPref !== "false");
        }

        // Get current permission status
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          setLocationPermissionStatus(status);
          console.log('Initial location permission status:', status);
        } catch (error) {
          console.error('Error getting location permission status:', error);
          setLocationPermissionStatus('error');
        }
      } catch (error) {
        console.error('Error loading location preference:', error);
      }
    };

    loadLocationPreference();
  }, []);

  // Get device ID from secure storage or generate a new one
  const getDeviceId = useCallback(async (): Promise<string> => {
    if (Platform.OS === 'web') {
      // Use localStorage for web instead of SecureStore
      let deviceId = localStorage.getItem("deviceId");

      if (!deviceId) {
        deviceId = `web-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("deviceId", deviceId);
      }

      return deviceId;
    }

    // For native platforms, use SecureStore
    try {
      let deviceId = await SecureStore.getItemAsync("deviceId");

      if (!deviceId) {
        const generatedId = `${Platform.OS}-${Math.random().toString(36).substring(2, 15)}`;
        deviceId = generatedId;
        await SecureStore.setItemAsync("deviceId", deviceId);
      }

      return deviceId;
    } catch (error) {
      console.error("Error getting device ID:", error);
      return `${Platform.OS}-fallback-${Date.now()}`;
    }
  }, []);

  // Get context data including location if permitted
  const getContextData = useCallback(async (): Promise<ContextDataType> => {
    try {
      // Get the device ID first
      const deviceId = await getDeviceId();

      // Check location permission status
      const { status } = await Location.getForegroundPermissionsAsync();
      console.log("[DEBUG] Current permission status:", status);
      setLocationPermissionStatus(status);

      // If location is not enabled (either by permission or user preference), return basic context
      if (status !== "granted" || !locationFunctionallyEnabled) {
        return {
          deviceId,
          location: { latitude: 0, longitude: 0 },
          permissionStatus: status,
          locationEnabled: false,
        };
      }

      // If location is enabled and permitted, get current position
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        return {
          deviceId,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          permissionStatus: status,
          locationEnabled: true,
        };
      } catch (locationError) {
        console.error("[ERROR] Error getting current position:", locationError);
        return {
          deviceId,
          location: { latitude: 0, longitude: 0 },
          permissionStatus: status,
          locationEnabled: false,
        };
      }
    } catch (error) {
      console.error("[ERROR] Error fetching context data:", error);

      // Return fallback context data with device ID
      const deviceId = await getDeviceId().catch(() => "unknown-device");
      return {
        deviceId,
        location: { latitude: 0, longitude: 0 },
        permissionStatus: "error",
        locationEnabled: false,
      };
    }
  }, [locationFunctionallyEnabled, getDeviceId]);

  // Fetch context data on component mount
  useEffect(() => {
    const fetchContextData = async () => {
      const data = await getContextData();
      setContextData(data);
    };

    fetchContextData();
  }, [getContextData]);

  // Validate email on change
  useEffect(() => {
    if (registrationData.email.trim() === "") {
      setEmailError("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }, [registrationData.email]);

  // Validate password function
  const validatePassword = useCallback((value: string): boolean => {
    const length: boolean = value.length >= 8;
    const hasDigit: boolean = /\d/.test(value);
    const hasLowerCase: boolean = /[a-z]/.test(value);

    if (!length) {
      setPasswordError("Password must be at least 8 characters!");
      return false;
    } else if (!hasDigit) {
      setPasswordError("Password must include at least one digit!");
      return false;
    } else if (!hasLowerCase) {
      setPasswordError("Password must include at least one lowercase letter!");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  }, []);

  // Handle resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle redirect after successful registration
  useEffect(() => {
    if (authContext?.user && !isRedirecting && currentStep === RegistrationStep.COMPLETE) {
      setIsRedirecting(true);
      console.log(`User registered (${authContext.user.role}), navigating to dashboard...`);
      router.replace(`/${authContext.user.role}Dashboard`);
    }
  }, [authContext?.user, currentStep, router, isRedirecting]);

  // Update progress animation when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep / 3) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim]);

  // Handle input changes
  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate password on change if we're updating the password field
    if (field === "password") {
      validatePassword(value);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync();

      if (currentStatus !== 'granted') {
        if (Platform.OS === 'web') {
          showAlert({
            title: "Location Permission",
            message: "This app uses your location for security purposes. Please enable location services in your browser.",
            buttons: [
              { text: "Later", style: "cancel" },
              {
                text: "Enable",
                onPress: async () => {
                  try {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    setLocationPermissionStatus(status);
                    if (status === 'granted') {
                      setLocationFunctionallyEnabled(true);
                      if (Platform.OS === 'web') {
                        localStorage.setItem("locationEnabled", "true");
                      } else {
                        await SecureStore.setItemAsync("locationEnabled", "true");
                      }
                      // Refresh context data
                      const data = await getContextData();
                      setContextData(data);
                    }
                  } catch (error) {
                    console.error("Error requesting location permission:", error);
                  }
                }
              }
            ]
          });
        } else {
          Alert.alert(
            "Location Permission",
            "This app uses your location for security purposes. Please enable location services.",
            [
              { text: "Later", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
              {
                text: "Enable",
                onPress: async () => {
                  const { status } = await Location.requestForegroundPermissionsAsync();
                  setLocationPermissionStatus(status);
                  if (status === 'granted') {
                    setLocationFunctionallyEnabled(true);
                    await SecureStore.setItemAsync("locationEnabled", "true");
                    // Refresh context data
                    const data = await getContextData();
                    setContextData(data);
                  }
                }
              }
            ]
          );
        }
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  // Handle initial form submission (name, email, role)
  const handleInitialSubmit = async () => {
    if (!isInitialFormFilled || !!emailError) {
      return;
    }

    // Request location permission before proceeding
    if (locationPermissionStatus !== 'granted') {
      await requestLocationPermission();
    }

    // Refresh context data
    if (!contextData) {
      const data = await getContextData();
      setContextData(data);
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
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
            contextData: contextData, // Send context data with registration
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

      if (Platform.OS === 'web') {
        showAlert({
          title: "Verification Code Sent",
          message: "Please check your email for the verification code.",
          buttons: [{ text: "OK" }]
        });
      } else {
        Alert.alert(
          "Verification Code Sent",
          "Please check your email for the verification code."
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Initial registration failed:", errorMessage);

      if (Platform.OS === 'web') {
        showAlert({
          title: "Registration Failed",
          message: errorMessage,
          buttons: [{ text: "OK" }]
        });
      } else {
        Alert.alert("Registration Failed", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async () => {
    if (!isVerificationCodeFilled) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/verifyEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            code: registrationData.verificationCode.trim(),
            email: registrationData.email.trim(), // Add email to help identify the verification
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

      if (Platform.OS === 'web') {
        showAlert({
          title: "Verification Failed",
          message: errorMessage,
          buttons: [{ text: "OK" }]
        });
      } else {
        Alert.alert("Verification Failed", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    if (resendDisabled) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/resendVerification`, // Use a dedicated endpoint if available
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: registrationData.email.trim(),
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

      if (Platform.OS === 'web') {
        showAlert({
          title: "Verification Code Sent",
          message: "A new verification code has been sent to your email.",
          buttons: [{ text: "OK" }]
        });
      } else {
        Alert.alert(
          "Verification Code Sent",
          "A new verification code has been sent to your email."
        );
      }
    } catch (error) {
      // Fallback to the registration endpoint if resendVerification doesn't exist
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/register`,
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
              contextData: contextData, // Send context data with registration
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

        if (Platform.OS === 'web') {
          showAlert({
            title: "Verification Code Sent",
            message: "A new verification code has been sent to your email.",
            buttons: [{ text: "OK" }]
          });
        } else {
          Alert.alert(
            "Verification Code Sent",
            "A new verification code has been sent to your email."
          );
        }
      } catch (secondError) {
        const errorMessage =
          secondError instanceof Error ? secondError.message : "Unknown error occurred";
        console.error("Resend code failed:", errorMessage);

        if (Platform.OS === 'web') {
          showAlert({
            title: "Failed to Resend Code",
            message: errorMessage,
            buttons: [{ text: "OK" }]
          });
        } else {
          Alert.alert("Failed to Resend Code", errorMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };




  const handleCompleteRegistration = async () => {
    // Validate password once more before submission
    if (!validatePassword(registrationData.password)) {
      return;
    }

    const freshContextData = await getContextData();
    setContextData(freshContextData);

    setIsLoading(true);
    try {
      // Update the user's password
      const response = await fetch(
        `${API_BASE_URL}/api/auth/updatePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: registrationData.email.trim(),
            password: registrationData.password.trim(),
            contextData: freshContextData, // Send updated context data
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      try {
        if (authContext?.login && freshContextData) {
          await authContext.login(
            registrationData.email,
            registrationData.password,
            freshContextData,
            true
          );
        }

        // Move to complete step
        setCurrentStep(RegistrationStep.COMPLETE);

        if (Platform.OS === 'web') {
          showAlert({
            title: "Registration Complete",
            message: "Your account has been created successfully!",
            buttons: [{ text: "OK" }]
          });
        } else {
          Alert.alert(
            "Registration Complete",
            "Your account has been created successfully!"
          );
        }
      } catch (loginError) {
        console.error("Auto-login failed:", loginError);
        // Even if login fails, consider registration complete
        setCurrentStep(RegistrationStep.COMPLETE);

        if (Platform.OS === 'web') {
          showAlert({
            title: "Registration Complete",
            message: "Your account has been created successfully. Please log in manually.",
            buttons: [{ text: "OK" }]
          });
        } else {
          Alert.alert(
            "Registration Complete",
            "Your account has been created successfully. Please log in manually."
          );
        }
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Complete registration failed:", errorMessage);

      if (Platform.OS === 'web') {
        showAlert({
          title: "Registration Failed",
          message: errorMessage,
          buttons: [{ text: "OK" }]
        });
      } else {
        Alert.alert("Registration Failed", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };





  // Check if initial form is filled properly
  const isInitialFormFilled = !!(
    registrationData.name.trim() &&
    registrationData.email.trim() &&
    registrationData.role.trim() &&
    !emailError
  );

  // Check if verification code is filled
  const isVerificationCodeFilled = !!(
    registrationData.verificationCode.trim().length === 6
  );

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

  // Render location status indicator
  const renderLocationStatus = () => {
    const getStatusColor = () => {
      if (locationPermissionStatus === 'granted' && locationFunctionallyEnabled) {
        return "#4caf50"; // Green - fully enabled
      } else if (locationPermissionStatus === 'granted' && !locationFunctionallyEnabled) {
        return "#ff9800"; // Orange - permission granted but disabled in app
      } else if (locationPermissionStatus === 'denied') {
        return "#f44336"; // Red - denied
      } else {
        return "#9e9e9e"; // Gray - undetermined
      }
    };

    const getStatusText = () => {
      if (locationPermissionStatus === 'granted' && locationFunctionallyEnabled) {
        return "Location enabled (recommended)";
      } else if (locationPermissionStatus === 'granted' && !locationFunctionallyEnabled) {
        return "Location disabled (in app)";
      } else if (locationPermissionStatus === 'denied') {
        return "Location denied (recommended for security)";
      } else {
        return "Enable location (recommended)";
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.locationStatusButton || {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            borderWidth: 1,
            marginBottom: 15,
            alignSelf: 'center',
            borderColor: getStatusColor(),
            backgroundColor: `${getStatusColor()}10`
          }
        ]}
        onPress={requestLocationPermission}
      >
        <Ionicons
          name={locationFunctionallyEnabled ? "location" : "location-outline"}
          size={16}
          color={getStatusColor()}
        />

        <Text style={[styles.locationStatusText || { fontSize: 14, marginLeft: 8, color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </TouchableOpacity>
    );
  };

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
          <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={20} color={emailError ? "#ff3b30" : "#666"} style={styles.inputIcon} />
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
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
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

        {/* Location Status */}
        {renderLocationStatus()}

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
          <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={passwordError ? "#ff3b30" : "#666"}
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
            Password should be at least 8 characters including a number and
            a lowercase letter.
          </Text>
        </View>

        {passwordError && (
          <Text style={styles.errorText}>
            {passwordError}
          </Text>
        )}

        {/* Location Status */}
        {renderLocationStatus()}

        <Text style={styles.securityNote}>
          Your device and location information will be used for enhanced security.
        </Text>

        {/* Complete Registration Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            (isLoading || !!passwordError || !registrationData.password) && styles.disabledButton,
          ]}
          onPress={handleCompleteRegistration}
          disabled={isLoading || !!passwordError || !registrationData.password}
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

  // Initialize alert components for web
  let customAlertComponent = null;

  if (Platform.OS === 'web') {
    customAlertComponent = (
      <CustomAlert
        visible={isVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
      />
    );
  }

  if (!authContext) {
    if (Platform.OS === 'web') {
      showAlert({
        title: "Error",
        message: "AuthContext is not available",
        buttons: [{ text: "OK" }]
      });
    } else {
      Alert.alert("Error", "AuthContext is not available");
    }
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Alert for web */}
      {Platform.OS === 'web' && customAlertComponent}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            {/* Progress Bar */}
            {currentStep < RegistrationStep.COMPLETE && renderProgressBar()}

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
