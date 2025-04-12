"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ActivityIndicator, StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { APP_CONFIG } from "@/app-config"
import { useToken } from "@/app/hooks/useToken"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

interface Attendance {
    _id: string
    courseId: string
    date: string
    status: "present" | "absent" | "excused"
}

interface Course {
    _id: string
    code: string
    title: string
    color: string
}

interface SubjectAttendanceProps {
    userId: string
    courseId: string
    course?: Course
    onRefresh?: () => void
}

const SubjectAttendance: React.FC<SubjectAttendanceProps> = ({ userId, courseId, course, onRefresh }) => {
    const [attendance, setAttendance] = useState<Attendance[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { token } = useToken()
    const { width } = useWindowDimensions()
    const isDesktop = width >= 1024

    useEffect(() => {
        fetchAttendanceData()
    }, [userId, courseId, token])

    const fetchAttendanceData = async () => {
        if (!userId || !courseId || !token) {
            setError("Missing required data (userId, courseId, or token)")
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // First try to get from cache while we fetch
            const cachedData = await AsyncStorage.getItem(`attendance_${courseId}_${userId}`)
            if (cachedData) {
                setAttendance(JSON.parse(cachedData))
            }

            // Fetch from API
            const response = await fetch(`${API_BASE_URL}/api/attendance/course/${courseId}/student/${userId}`, {
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
            setAttendance(data)

            // Cache the data
            await AsyncStorage.setItem(`attendance_${courseId}_${userId}`, JSON.stringify(data))

            if (onRefresh) {
                onRefresh()
            }
        } catch (err) {
            console.error("Error fetching attendance data:", err)
            setError("Failed to load attendance data. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    const calculateAttendanceStats = () => {
        if (attendance.length === 0) {
            return { present: 0, excused: 0, absent: 0, percentage: 0 }
        }

        const present = attendance.filter((a) => a.status === "present").length
        const excused = attendance.filter((a) => a.status === "excused").length
        const absent = attendance.filter((a) => a.status === "absent").length
        const percentage = Math.round(((present + excused) / attendance.length) * 100)

        return { present, excused, absent, percentage }
    }

    const stats = calculateAttendanceStats()
    const attendanceColor = stats.percentage >= 75 ? "#4CAF50" : stats.percentage >= 60 ? "#FFC107" : "#F44336"

    if (isLoading && attendance.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#5c51f3" />
                <Text style={styles.loadingText}>Loading attendance data...</Text>
            </View>
        )
    }

    if (error && attendance.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={24} color="#F44336" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchAttendanceData}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={[styles.container, isDesktop && styles.desktopContainer]}>
            <View style={styles.header}>
                <Text style={styles.title}>{course?.code || "Course"} Attendance</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={fetchAttendanceData}>
                    <Ionicons name="refresh" size={20} color="#5c51f3" />
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.percentageContainer}>
                    <View style={[styles.percentageCircle, { borderColor: attendanceColor }]}>
                        <Text style={[styles.percentageText, { color: attendanceColor }]}>{stats.percentage}%</Text>
                    </View>
                    <Text style={styles.attendanceLabel}>Attendance Rate</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <View style={[styles.statusIndicator, { backgroundColor: "#4CAF50" }]} />
                        <Text style={styles.detailLabel}>Present:</Text>
                        <Text style={styles.detailValue}>{stats.present}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.statusIndicator, { backgroundColor: "#FFC107" }]} />
                        <Text style={styles.detailLabel}>Excused:</Text>
                        <Text style={styles.detailValue}>{stats.excused}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.statusIndicator, { backgroundColor: "#F44336" }]} />
                        <Text style={styles.detailLabel}>Absent:</Text>
                        <Text style={styles.detailValue}>{stats.absent}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialIcons name="date-range" size={16} color="#666" />
                        <Text style={styles.detailLabel}>Total Classes:</Text>
                        <Text style={styles.detailValue}>{attendance.length}</Text>
                    </View>
                </View>
            </View>

            {stats.percentage < 75 && (
                <View style={styles.warningContainer}>
                    <Ionicons name="warning" size={20} color="#F44336" />
                    <Text style={styles.warningText}>Below minimum requirement of 75%. Attendance improvement needed.</Text>
                </View>
            )}

            <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Recent Attendance</Text>
                {attendance.length > 0 ? (
                    attendance
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((record) => (
                            <View key={record._id} style={styles.historyItem}>
                                <View style={styles.dateContainer}>
                                    <Text style={styles.dateText}>
                                        {new Date(record.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.statusContainer,
                                        record.status === "present"
                                            ? styles.presentStatus
                                            : record.status === "excused"
                                                ? styles.excusedStatus
                                                : styles.absentStatus,
                                    ]}
                                >
                                    <Text style={styles.statusText}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </Text>
                                </View>
                            </View>
                        ))
                ) : (
                    <Text style={styles.noDataText}>No attendance records available</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    desktopContainer: {
        padding: 24,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    refreshButton: {
        padding: 8,
    },
    statsContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    percentageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    percentageCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    percentageText: {
        fontSize: 22,
        fontWeight: "bold",
    },
    attendanceLabel: {
        fontSize: 12,
        color: "#666",
    },
    detailsContainer: {
        flex: 1,
        justifyContent: "center",
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: "#666",
        marginRight: 8,
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    warningContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFEBEE",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    warningText: {
        fontSize: 14,
        color: "#D32F2F",
        marginLeft: 8,
        flex: 1,
    },
    historyContainer: {
        marginTop: 8,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
    },
    historyItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    dateContainer: {
        flex: 1,
    },
    dateText: {
        fontSize: 14,
        color: "#555",
    },
    statusContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    presentStatus: {
        backgroundColor: "#E8F5E9",
    },
    excusedStatus: {
        backgroundColor: "#FFF8E1",
    },
    absentStatus: {
        backgroundColor: "#FFEBEE",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "500",
    },
    loadingContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        marginTop: 8,
        color: "#666",
    },
    errorContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        marginTop: 8,
        color: "#F44336",
        textAlign: "center",
    },
    retryButton: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#5c51f3",
        borderRadius: 4,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "500",
    },
    noDataText: {
        color: "#666",
        fontStyle: "italic",
        textAlign: "center",
        padding: 16,
    },
})

export default SubjectAttendance
