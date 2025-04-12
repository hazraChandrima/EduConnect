"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { APP_CONFIG } from "@/app-config"
import { useToken } from "@/app/hooks/useToken"
import CourseAttendanceCard from "./CourseAttendanceCard"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

interface Course {
    _id: string
    code: string
    title: string
    color: string
    icon: string
    professor: {
        _id: string
        name: string
    }
    progress: number
}

interface AttendanceOverviewProps {
    userId: string
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({ userId }) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { token } = useToken()
    const { width } = useWindowDimensions()
    const isDesktop = width >= 1024

    useEffect(() => {
        fetchCourses()
    }, [userId, token])

    const fetchCourses = async () => {
        if (!userId || !token) {
            setError("Missing required data (userId or token)")
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // First try to get from cache while we fetch
            const cachedData = await AsyncStorage.getItem(`courses_${userId}`)
            if (cachedData) {
                setCourses(JSON.parse(cachedData))
                setIsLoading(false)
            }

            // Fetch from API
            const response = await fetch(`${API_BASE_URL}/api/courses/student/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`)
            }

            const data = await response.json()
            setCourses(data)

            // Cache the data
            await AsyncStorage.setItem(`courses_${userId}`, JSON.stringify(data))
        } catch (err) {
            console.error("Error fetching courses:", err)
            setError("Failed to load courses. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading && courses.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5c51f3" />
                <Text style={styles.loadingText}>Loading courses...</Text>
            </View>
        )
    }

    if (error && courses.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Course Attendance</Text>
            <Text style={styles.subtitle}>View your attendance for each enrolled course</Text>

            {isDesktop ? (
                <View style={styles.desktopGrid}>
                    {courses.map((course) => (
                        <CourseAttendanceCard key={course._id} userId={userId} course={course} />
                    ))}
                </View>
            ) : (
                <ScrollView>
                    {courses.map((course) => (
                        <CourseAttendanceCard key={course._id} userId={userId} course={course} />
                    ))}
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 24,
    },
    desktopGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        margin: -6, // Offset the margin of the cards
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        color: "#666",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#F44336",
        textAlign: "center",
    },
})

export default AttendanceOverview
