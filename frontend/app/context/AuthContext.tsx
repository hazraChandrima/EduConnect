"use client"
import type React from "react"
import { createContext, useState, useEffect, useCallback, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { router } from "expo-router"
import { Platform } from "react-native"
import { APP_CONFIG } from "@/app-config"

const API_BASE_URL = `${APP_CONFIG.API_BASE_URL}/api/auth`


export type ContextDataType = {
  deviceId: string
  location: {
    latitude: number
    longitude: number
  }
  permissionStatus: string
  locationEnabled?: boolean
} | null



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
  initiateLogin: (email: string) => Promise<boolean>
  verifyLoginOTP: (email: string, code: string) => Promise<boolean>
  completeLogin: (password: string, contextData: ContextDataType) => Promise<void>
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
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          console.log("Loaded user from storage:", parsedUser)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])
  




  // 1: Initiate login with email
  const initiateLogin = async (email: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log("Initiating login for:", email)
      const response = await axios.post(`${API_BASE_URL}/initiate-login`, {
        email,
      })

      if (response.data.success) {
        setCurrentEmail(email)
        console.log("Login initiated successfully, OTP sent")
        return true
      }
      return false
    } catch (error: unknown) {
      const err = error as Error
      console.error("Login initiation failed:", err.message)

      // Handle suspension at the initiate login step
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        const responseData = error.response.data

        if (responseData?.message?.includes("suspended")) {
          const suspensionDate = responseData?.suspendedUntil
            ? new Date(responseData.suspendedUntil).toLocaleString()
            : extractDateFromMessage(responseData?.message)

          setSuspendedUntil(suspensionDate)
          setIsSuspensionModalVisible(true)

          if (Platform.OS === "web") {
            localStorage.clear()
          } else {
            await AsyncStorage.clear()
          }
        }
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }





  // 2: Verify OTP
  const verifyLoginOTP = async (email: string, code: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-login-otp`, {
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





  // 3: Complete login with password after OTP verification
  const completeLogin = async (password: string, contextData: ContextDataType): Promise<void> => {
    if (!isOtpVerified) {
      throw new Error("Email verification required")
    }

    if (!currentEmail) {
      throw new Error("Email not provided for login")
    }

    if (!contextData || !contextData.deviceId || !contextData.location) {
      throw new Error("Device information required for login")
    }

    console.log("Completing login with password...")
    console.log("Login Payload:", {
      email: currentEmail,
      password: "********",
      contextData,
    })

    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: currentEmail,
        password,
        contextData,
      })

      const data = response.data

      const userData: User = {
        userId: data.userId,
        email: currentEmail,
        role: data.role,
        token: data.token,
      }

      setUser(userData)

      if (Platform.OS === "web") {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("userId", data.userId)
      } else {
        await AsyncStorage.setItem("token", data.token)
        await AsyncStorage.setItem("user", JSON.stringify(userData))
        await AsyncStorage.setItem("userId", data.userId)
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

      resetAuthFlow()
      setTimeout(() => {
        router.replace(`/${userData.role}/${userData.userId}`)
      }, 100)
    } catch (error: unknown) {
      console.error("Login completion failed:", error)

      if (error instanceof Error) {
        throw error
      } else {
        throw new Error("Unknown error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }





  const extractDateFromMessage = (message?: string): string | null => {
    if (!message) return null

    const dateMatch = message.match(/until\s(.+)$/)
    return dateMatch ? dateMatch[1] : null
  }




  // logout functionality
  const logout = async (): Promise<void> => {
    console.log("Logging out...")
    setIsLoading(true)

    try {
      if (Platform.OS === "web") {
        localStorage.clear()
        console.log('Stroage cleared on logout');

      } else {
        await AsyncStorage.clear();
        console.log('Storage cleared on logout');
      }

      axios.defaults.headers.common["Authorization"] = ""
      setUser(null)
      resetAuthFlow()

      setTimeout(() => {
        router.replace("/login")
      }, 100)

      console.log("User logged out.")
    } catch (error: unknown) {
      const err = error as Error
      console.error("Logout failed:", err.message)
    } finally {
      setIsLoading(false)
    }
  }




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
        initiateLogin,
        verifyLoginOTP,
        completeLogin,
        logout,
        resetAuthFlow,
        closeSuspensionModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}