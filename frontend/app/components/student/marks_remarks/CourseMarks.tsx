"use client"

import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { APP_CONFIG } from "@/app-config"
import { useToken } from "@/app/hooks/useToken"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

interface MarkItem {
    _id: string
    courseId: string
    studentId: string
    title: string
    score: number
    maxScore: number
    type: string
    feedback?: string
    createdAt: string
}

interface CourseMarksProps {
    courseId: string
    studentId: string
    styles: any
}

const CourseMarks = ({ courseId, studentId, styles }: CourseMarksProps) => {
    const [marks, setMarks] = useState<MarkItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { token } = useToken()

    useEffect(() => {
        const fetchCourseMarks = async () => {
            if (!courseId || !studentId) {
                setIsLoading(false)
                return
            }

            // Don't proceed if token is not available
            if (!token) {
                setError("Authentication token not available")
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                // Try to get cached data first
                const cacheKey = `courseMarks_${courseId}_${studentId}`
                const cachedData = await AsyncStorage.getItem(cacheKey)

                if (cachedData) {
                    setMarks(JSON.parse(cachedData))
                    // Still keep loading to get fresh data
                }

                // Fetch fresh data from API
                const response = await fetch(`${API_BASE_URL}/api/marks/course/${courseId}/student/${studentId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    // Handle specific error codes
                    if (response.status === 401) {
                        throw new Error("Authentication failed. Please log in again.")
                    } else {
                        throw new Error(`Failed to fetch marks: ${response.status}`)
                    }
                }

                const data = await response.json()
                setMarks(data)

                // Cache the data
                await AsyncStorage.setItem(cacheKey, JSON.stringify(data))
            } catch (err) {
                console.error("Error fetching course marks:", err)
                setError(err instanceof Error ? err.message : "Failed to load marks data")

                // Use cached data as fallback if available
                const cacheKey = `courseMarks_${courseId}_${studentId}`
                const cachedData = await AsyncStorage.getItem(cacheKey)
                if (cachedData && marks.length === 0) {
                    setMarks(JSON.parse(cachedData))
                    setError("Showing cached data. Pull to refresh.")
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourseMarks()
    }, [courseId, studentId, token])

    if (isLoading && marks.length === 0) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#5c51f3" />
                <Text style={{ marginTop: 10, color: "#666" }}>Loading marks...</Text>
            </View>
        )
    }

    if (error && marks.length === 0) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: "#ff5252" }}>{error}</Text>
            </View>
        )
    }

    if (marks.length === 0) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: "#666" }}>No marks available for this course.</Text>
            </View>
        )
    }

    return (
        <View style={styles.marksContainer}>
            {error && (
                <View style={{ marginBottom: 10, padding: 8, backgroundColor: "#fff0f0", borderRadius: 4 }}>
                    <Text style={{ color: "#ff5252" }}>{error}</Text>
                </View>
            )}
            <View style={styles.marksSummary}>
                <View style={styles.marksChart}>
                    <Text style={styles.marksAverage}>
                        {Math.round(marks.reduce((sum, mark) => sum + (mark.score / mark.maxScore) * 100, 0) / marks.length)}%
                    </Text>
                    <Text style={styles.marksAverageLabel}>Average Score</Text>
                </View>
            </View>

            <Text style={styles.marksHistoryTitle}>Assessment Marks</Text>
            {marks.map((mark) => (
                <View key={mark._id} style={styles.markRecord}>
                    <View style={styles.markHeader}>
                        <Text style={styles.markTitle}>{mark.title}</Text>
                        <View style={styles.markType}>
                            <Text style={styles.markTypeText}>{mark.type.charAt(0).toUpperCase() + mark.type.slice(1)}</Text>
                        </View>
                    </View>
                    <View style={styles.markScore}>
                        <Text style={styles.markScoreContainer}>
                            {mark.score}/{mark.maxScore}
                        </Text>
                        <Text style={styles.markPercentage}>{Math.round((mark.score / mark.maxScore) * 100)}%</Text>
                    </View>
                    {mark.feedback && (
                        <View style={styles.markFeedback}>
                            <Text style={styles.markFeedbackLabel}>Feedback:</Text>
                            <Text style={styles.markFeedbackText}>{mark.feedback}</Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    )
}

export default CourseMarks