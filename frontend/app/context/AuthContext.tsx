"use client"

import type React from "react"
import { createContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { router } from "expo-router"

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
	// New functions for 2FA flow
	requestLoginOTP: (email: string) => Promise<boolean>
	verifyLoginOTP: (email: string, code: string) => Promise<boolean>
	// Modified login function with optional otpVerified parameter
	login: (email: string, password: string, otpVerified?: boolean) => Promise<void>
	logout: () => Promise<void>
	// Reset function to go back in the auth flow
	resetAuthFlow: () => void
}

export const AuthContext = createContext<AuthContextProps | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	// New state for tracking the 2FA flow
	const [currentEmail, setCurrentEmail] = useState<string | null>(null)
	const [isOtpVerified, setIsOtpVerified] = useState(false)

	const API_URL = "http://localhost:3000/api/auth"

	useEffect(() => {
		console.log("Checking for stored user...")
		const loadUser = async () => {
			try {
				const token = await AsyncStorage.getItem("token")
				const storedUser = await AsyncStorage.getItem("user")
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
			const response = await axios.post(`${API_URL}/requestLoginOTP`, { email })

			if (response.data.success) {
				// Store the email for the next steps
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
			console.log("Verifying OTP for:", email)
			const response = await axios.post(`${API_URL}/verifyLoginOTP`, {
				email,
				code,
			})

			if (response.data.success) {
				// Mark OTP as verified for the final login step
				setIsOtpVerified(true)
				console.log("OTP verified successfully")
				return true
			}
			return false
		} catch (error: unknown) {
			const err = error as Error
			console.error("OTP verification failed:", err.message)
			return false
		} finally {
			setIsLoading(false)
		}
	}

	

	// Step 3: Complete login with password (modified to support OTP verification)
	const login = async (email: string, password: string, otpVerified = false) => {
		console.log("Sending login request to backend...")
		setIsLoading(true)
		try {
			// Use either the passed otpVerified parameter or the state
			const isVerified = otpVerified || isOtpVerified

			// If OTP verification is required but not completed, throw an error
			if (!isVerified) {
				throw new Error("Email verification required")
			}

			const response = await axios.post(`${API_URL}/login`, {
				email: currentEmail || email,
				password,
				otpVerified: isVerified,
			})

			console.log("Server response:", response.data)

			const userData: User = {
				userId: response.data.userId,
				email: currentEmail || email,
				role: response.data.role,
				token: response.data.token,
			}

			setUser(userData)

			// Store the user data in AsyncStorage
			await AsyncStorage.setItem("token", response.data.token)
			await AsyncStorage.setItem("user", JSON.stringify(userData))
			await AsyncStorage.setItem("userId", response.data.userId)

			console.log("User logged in and stored:", userData)

			axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

			// Reset the 2FA flow state
			resetAuthFlow()

			// Navigate to dashboard
			router.replace(`/${userData.role}Dashboard`)
		} catch (error: unknown) {
			const err = error as Error
			console.error("Login request failed:", err.message)
			throw err // Re-throw to handle in the component
		} finally {
			setIsLoading(false)
		}
	}

	const logout = async () => {
		console.log("Logging out...")
		setIsLoading(true)
		try {
			await AsyncStorage.removeItem("token")
			await AsyncStorage.removeItem("user")
			await AsyncStorage.removeItem("userId")
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
	const resetAuthFlow = () => {
		setCurrentEmail(null)
		setIsOtpVerified(false)
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				currentEmail,
				isOtpVerified,
				requestLoginOTP,
				verifyLoginOTP,
				login,
				logout,
				resetAuthFlow,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

