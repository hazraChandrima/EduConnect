"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ViewStyle, TextStyle } from "react-native"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import SubjectAttendance from "./SubjectAttendance"

interface Course {
    _id: string
    code: string
    title: string
    color: string
    icon: string
}

interface CourseAttendanceCardProps {
    userId: string
    course: Course
}

// Define the style types
interface Styles {
    container: ViewStyle
    desktopContainer: ViewStyle
    header: ViewStyle
    headerExpanded: ViewStyle
    courseInfo: ViewStyle
    courseIcon: ViewStyle
    courseDetails: ViewStyle
    courseCode: TextStyle
    courseTitle: TextStyle
    expandButton: ViewStyle
    content: ViewStyle
}

const CourseAttendanceCard: React.FC<CourseAttendanceCardProps> = ({ userId, course }) => {
    const [expanded, setExpanded] = useState(false)
    const { width } = useWindowDimensions()
    const isDesktop = width >= 1024

    return (
        <View style={[styles.container, isDesktop && styles.desktopContainer]}>
            <TouchableOpacity
                style={[styles.header, expanded && styles.headerExpanded]}
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.7}
            >
                <View style={styles.courseInfo}>
                    <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                        <FontAwesome name={course.icon as any} size={20} color="white" />
                    </View>
                    <View style={styles.courseDetails}>
                        <Text style={styles.courseCode}>{course.code}</Text>
                        <Text style={styles.courseTitle}>{course.title}</Text>
                    </View>
                </View>
                <View style={styles.expandButton}>
                    <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color="#666" />
                </View>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.content}>
                    <SubjectAttendance userId={userId} courseId={course._id} course={course} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create<Styles>({
    container: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    desktopContainer: {
        width: "50%", // Modified from calc since React Native doesn't support calc
        margin: 6,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 0,
        borderBottomColor: "#f0f0f0",
    },
    headerExpanded: {
        borderBottomWidth: 1,
    },
    courseInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    courseIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    courseDetails: {
        flex: 1,
    },
    courseCode: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    courseTitle: {
        fontSize: 14,
        color: "#666",
    },
    expandButton: {
        padding: 4,
    },
    content: {
        padding: 0,
    },
})

export default CourseAttendanceCard