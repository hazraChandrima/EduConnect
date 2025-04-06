"use client"

import type React from "react"
import { createContext, useState, useEffect, useCallback, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { router } from "expo-router"
import { Platform } from "react-native"
import type { ContextDataType } from "../register"


interface User {
  userId: string
  email: string
  role: "student" | "professor" | "admin"
  token: string
}

interface AuthContextProps {
  user: User | null
  isLoading: boolean
  currentEmail: string | null
  isOtpVerified: boolean
  isSuspensionModalVisible: boolean
  suspendedUntil: string | null
  requestLoginOTP: (email: string) => Promise<boolean>
  verifyLoginOTP: (email: string, code: string) => Promise<boolean>
  login: (email: string, password: string, contextData: ContextDataType, otpVerified: boolean) => Promise<void>
  logout: () => Promise<void>
  resetAuthFlow: () => void
  closeSuspensionModal: () => void
}

export const AuthContext = createContext<AuthContextProps | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentEmail, setCurrentEmail] = useState<string | null>(null)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [isSuspensionModalVisible, setIsSuspensionModalVisible] = useState(false)
  const [suspendedUntil, setSuspendedUntil] = useState<string | null>(null)

  const IP_ADDRESS = "192.168.142.247"
  const API_URL = `http://${IP_ADDRESS}:3000/api/auth`



  useEffect(() => {
    console.log("Checking for stored user...")
    const loadUser = async () => {
      try {
        let token: string | null = null
        let storedUser: string | null = null

        if (Platform.OS === "web") {
          token = localStorage.getItem("token")
          storedUser = localStorage.getItem("user")
        } else {
          token = await AsyncStorage.getItem("token")
          storedUser = await AsyncStorage.getItem("user")
        }

        if (token && storedUser) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          setUser(JSON.parse(storedUser))
          console.log("Loaded user from storage:", JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])




  // Step 1: Request OTP with email
  const requestLoginOTP = async (email: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log("Requesting login OTP for:", email)
      const response = await axios.post(`${API_URL}/requestLoginOTP`, {
        email,
      })

      if (response.data.success) {
        setCurrentEmail(email)
        console.log("OTP requested successfully")
        return true
      }
      return false
    } catch (error: unknown) {
      const err = error as Error
      console.error("OTP request failed:", err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }



  // Step 2: Verify OTP
  const verifyLoginOTP = async (email: string, code: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/verifyLoginOTP`, {
        email,
        code,
      })

      if (response.data.success) {
        setIsOtpVerified(true)
        console.log("OTP verified successfully")
        return true
      }

      return false // If success = false
    } catch (error: unknown) {
      const err = error as Error
      console.error("OTP verification failed:", err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }



  const closeSuspensionModal = useCallback((): void => {
    setIsSuspensionModalVisible(false)
    setSuspendedUntil(null)
  }, [])





  // Step 3: Complete login with password and context data
  const login = async (
    email: string,
    password: string,
    contextData: ContextDataType,
    otpVerified: boolean
  ): Promise<void> => {
    if (!otpVerified && !isOtpVerified) {
      throw new Error("Email verification required");
    }

    if (!contextData || !contextData.deviceId || !contextData.location) {
      throw new Error("Device information required for login");
    }

    console.log("Sending login request to backend...");
    console.log("Login Payload:", {
      email: currentEmail || email,
      password: "********",
      contextData,
      otpVerified: otpVerified || isOtpVerified,
    });

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: currentEmail || email,
        password,
        contextData,
        otpVerified: otpVerified || isOtpVerified,
      });

      const data = response.data;

      if (data?.success === false && data?.message?.includes("suspended")) {
        // Extract date from message if available
        const suspensionDate = data?.suspendedUntil ?
          new Date(data.suspendedUntil).toLocaleString() :
          extractDateFromMessage(data?.message);

        // Show suspension modal
        setSuspendedUntil(suspensionDate);
        setIsSuspensionModalVisible(true);

        // Clean up storage
        if (Platform.OS === "web") {
          localStorage.clear();
        } else {
          await AsyncStorage.clear();
        }

        setIsLoading(false);
        return;
      }

      const userData: User = {
        userId: data.userId,
        email: currentEmail || email,
        role: data.role,
        token: data.token,
      };

      setUser(userData);

      if (Platform.OS === "web") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userId", data.userId);
      } else {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("userId", data.userId);
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      resetAuthFlow();

      router.replace(`/${userData.role}Dashboard`);
    } catch (error: unknown) {
      console.error("Login request failed:", error);

      if (axios.isAxiosError(error) && error.response?.status === 403) {
        const responseData = error.response.data;

        if (responseData?.message?.includes("suspended")) {
          const suspensionDate = responseData?.suspendedUntil ?
            new Date(responseData.suspendedUntil).toLocaleString() :
            extractDateFromMessage(responseData?.message);

          setSuspendedUntil(suspensionDate);
          setIsSuspensionModalVisible(true);

          // Clean up storage
          if (Platform.OS === "web") {
            localStorage.clear();
          } else {
            await AsyncStorage.clear();
          }

          return;
        }
      }

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };




  const extractDateFromMessage = (message?: string): string | null => {
    if (!message) return null;

    const dateMatch = message.match(/until\s(.+)$/);
    return dateMatch ? dateMatch[1] : null;
  };

  const logout = async (): Promise<void> => {
    console.log("Logging out...")
    setIsLoading(true)
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("userId")
        localStorage.removeItem("studentDashboardUserData")
      } else {
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("user")
        await AsyncStorage.removeItem("userId")
        await AsyncStorage.removeItem("studentDashboardUserData")
      }

      axios.defaults.headers.common["Authorization"] = ""
      setUser(null)
      // Reset the 2FA flow state
      resetAuthFlow()
      console.log("User logged out.")
    } catch (error: unknown) {
      const err = error as Error
      console.error("Logout failed:", err.message)
    } finally {
      setIsLoading(false)
    }
  }



  // Reset the authentication flow state
  const resetAuthFlow = useCallback((): void => {
    setCurrentEmail(null)
    setIsOtpVerified(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        currentEmail,
        isOtpVerified,
        isSuspensionModalVisible,
        suspendedUntil,
        requestLoginOTP,
        verifyLoginOTP,
        login,
        logout,
        resetAuthFlow,
        closeSuspensionModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}