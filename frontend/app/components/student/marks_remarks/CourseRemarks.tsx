"use client"

import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { APP_CONFIG } from "@/app-config"
import { useToken } from "@/app/hooks/useToken"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

interface RemarkItem {
    _id: string
    courseId: string
    studentId: string
    date: string
    remark: string
    type: "positive" | "negative" | "neutral"
}

interface CourseRemarksProps {
    courseId: string
    studentId: string
    styles: any
}

const CourseRemarks = ({ courseId, studentId, styles }: CourseRemarksProps) => {
    const [remarks, setRemarks] = useState<RemarkItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { token } = useToken()

    useEffect(() => {
        // Update your fetchCourseRemarks function

        const fetchCourseRemarks = async () => {
            if (!courseId || !studentId) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Verify token is available
                if (!token) {
                    throw new Error("Authentication token is missing");
                }

                console.log("Using token:", token.substring(0, 10) + "..."); // Log partial token for debugging

                const url = `${API_BASE_URL}/api/remarks/student/${studentId}`;
                console.log("Fetching from URL:", url);

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                console.log("Response status:", response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error response:", errorText);
                    throw new Error(`Failed to fetch remarks: ${response.status} - ${errorText}`);
                }

                const marksData = await response.json();
                console.log("Received data:", JSON.stringify(marksData));


                // Check what format the data is in
                console.log("Data structure:", Object.keys(marksData[0]));

                // If the data already has remark/type fields, use it directly
                if (marksData[0].remark) {
                    setRemarks(marksData);
                } else {
                    // Otherwise use your transformation logic
                    const remarksData = marksData
                        .filter((mark: { feedback: any }) => mark.feedback)
                        .map((mark: { _id: any; courseId: any; studentId: any; createdAt: any; feedback: any; score: number; maxScore: number }) => ({
                            _id: mark._id,
                            courseId: mark.courseId,
                            studentId: mark.studentId,
                            date: mark.createdAt,
                            remark: mark.feedback,
                            type: determineRemarkType(mark.score, mark.maxScore),
                        }));
                    setRemarks(remarksData);
                }

                // Rest of your code remains the same...
            } catch (err) {
                console.error("Error fetching course marks:", err)
                setError(err instanceof Error ? err.message : "Failed to load remarks data")

            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseRemarks()
    }, [courseId, studentId, token])

    const determineRemarkType = (score: number, maxScore: number): "positive" | "negative" | "neutral" => {
        const percentage = (score / maxScore) * 100
        if (percentage >= 80) return "positive"
        if (percentage < 60) return "negative"
        return "neutral"
    }

    if (isLoading) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#5c51f3" />
                <Text style={{ marginTop: 10, color: "#666" }}>Loading remarks...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: "#ff5252" }}>{error}</Text>
            </View>
        )
    }

    if (remarks.length === 0) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: "#666" }}>No remarks available for this course.</Text>
            </View>
        )
    }

    return (
        <View style={styles.remarksContainer}>
            {remarks
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((remark) => (
                    <View
                        key={remark._id}
                        style={[
                            styles.remarkItem,
                            remark.type === "positive"
                                ? styles.remarkPositive
                                : remark.type === "negative"
                                    ? styles.remarkNegative
                                    : styles.remarkNeutral,
                        ]}
                    >
                        <View style={styles.remarkHeader}>
                            <Text style={styles.remarkDate}>
                                {new Date(remark.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </Text>
                            <View style={styles.remarkTypeIndicator}>
                                <Text style={styles.remarkTypeText}>{remark.type.charAt(0).toUpperCase() + remark.type.slice(1)}</Text>
                            </View>
                        </View>
                        <Text style={styles.remarkText}>{remark.remark}</Text>
                    </View>
                ))}
        </View>
    )
}

export default CourseRemarks
