import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import axios from "axios";
import { APP_CONFIG } from "@/app-config";

const API_BASE_URL = APP_CONFIG.API_BASE_URL;

interface Course {
    _id: string;
    code: string;
    title: string;
    color: string;
    icon: string;
}

interface Attendance {
    _id: string;
    userId: string;
    courseId: string;
    date: string;
    status: "present" | "absent" | "excused";
}

interface AttendanceChartProps {
    userId: string;
    isDesktop: boolean;
}

// Define the style types
interface StylesType {
    chartContainer: ViewStyle;
    desktopChartContainer: ViewStyle;
    chartTitle: TextStyle;
    chartSubtitle: TextStyle;
    chart: ViewStyle;
    attendanceDetails: ViewStyle;
    desktopAttendanceDetails: ViewStyle;
    detailsTitle: TextStyle;
    desktopAttendanceGrid: ViewStyle;
    attendanceItem: ViewStyle;
    desktopAttendanceItem: ViewStyle;
    attendanceItemHeader: ViewStyle;
    attendanceItemTitle: TextStyle;
    attendanceItemValue: TextStyle;
    attendanceItemDetail: TextStyle;
    attendanceWarning: ViewStyle;
    attendanceWarningText: TextStyle;
    loadingContainer: ViewStyle;
    loadingText: TextStyle;
    errorContainer: ViewStyle;
    errorText: TextStyle;
    emptyState: ViewStyle;
    emptyStateText: TextStyle;
}

const AttendanceChartView: React.FC<AttendanceChartProps> = ({ userId, isDesktop }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [attendanceMap, setAttendanceMap] = useState<{ [courseId: string]: Attendance[] }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Chart configuration
    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(92, 81, 243, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForLabels: {
            fontSize: 12,
        },
    };

    const getChartWidth = () => {
        return isDesktop ? 700 : 350;
    };

    // Ensure data is in the correct format for the chart
    const ensureSafeData = (data: number[]): number[] => {
        return data.map(val => Math.min(Math.max(val, 0), 1));
    };

    // Calculate attendance percentage for a course
    const calculateAttendancePercentage = (courseId: string): number => {
        const courseAttendance = attendanceMap[courseId] || [];
        if (courseAttendance.length === 0) return 0;

        const presentCount = courseAttendance.filter(
            a => a.status === "present" || a.status === "excused"
        ).length;

        return Math.round((presentCount / courseAttendance.length) * 100);
    };

    // Fetch courses and attendance data from backend
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch courses using the new API endpoint
                const coursesResponse = await axios.get(`${API_BASE_URL}/api/courses/student/${userId}`);
                const fetchedCourses = coursesResponse.data;
                setCourses(fetchedCourses);

                // Fetch attendance for each course separately
                const attendanceData: { [courseId: string]: Attendance[] } = {};

                for (const course of fetchedCourses) {
                    const attendanceResponse = await axios.get(
                        `${API_BASE_URL}/api/attendance/course/${course._id}/student/${userId}`
                    );
                    attendanceData[course._id] = attendanceResponse.data;
                }

                setAttendanceMap(attendanceData);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load attendance data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, API_BASE_URL]);

    // Prepare chart data
    const prepareChartData = () => {
        const labels = courses.map(course => course.code);
        const data = courses.map(course => {
            const percentage = calculateAttendancePercentage(course._id);
            return percentage / 100; // Convert to decimal for the chart
        });

        return { labels, data };
    };

    const attendanceData = prepareChartData();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5C51F3" />
                <Text style={styles.loadingText}>Loading attendance data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color="#ff5252" />
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.chartContainer, isDesktop && styles.desktopChartContainer]}>
            <Text style={styles.chartTitle}>Attendance by Subject</Text>
            <Text style={styles.chartSubtitle}>Your attendance percentage across courses</Text>

            {courses.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="book-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyStateText}>No courses found</Text>
                </View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <ProgressChart
                        data={{
                            ...attendanceData,
                            data: ensureSafeData(attendanceData.data),
                        }}
                        width={Math.max(getChartWidth(), 500)}
                        height={300}
                        strokeWidth={16}
                        radius={24}
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(92, 81, 243, ${opacity})`,
                        }}
                        hideLegend={false}
                        style={styles.chart}
                    />
                </ScrollView>
            )}

            <View style={[styles.attendanceDetails, isDesktop && styles.desktopAttendanceDetails]}>
                <Text style={styles.detailsTitle}>Attendance Details</Text>

                <View style={isDesktop ? styles.desktopAttendanceGrid : undefined}>
                    {courses.map((course) => {
                        const attendancePercentage = calculateAttendancePercentage(course._id);
                        const courseAttendance = attendanceMap[course._id] || [];
                        const presentCount = courseAttendance.filter(
                            (a) => a.status === "present" || a.status === "excused",
                        ).length;

                        return (
                            <View key={course._id} style={[styles.attendanceItem, isDesktop && styles.desktopAttendanceItem]}>
                                <View style={styles.attendanceItemHeader}>
                                    <Text style={styles.attendanceItemTitle}>{course.code}</Text>
                                    <Text
                                        style={[
                                            styles.attendanceItemValue,
                                            attendancePercentage < 75 ? { color: "#ff5252" } as TextStyle : {}
                                        ]}
                                    >
                                        {attendancePercentage}%
                                    </Text>
                                </View>
                                <Text style={styles.attendanceItemDetail}>
                                    Attended {presentCount} of {courseAttendance.length} classes
                                </Text>
                                {attendancePercentage < 75 && (
                                    <View style={styles.attendanceWarning}>
                                        <Ionicons name="warning" size={16} color="#ff5252" />
                                        <Text style={[styles.attendanceWarningText, { color: "#ff5252" } as TextStyle]}>
                                            Below minimum requirement of 75%
                                        </Text>
                                    </View>
                                )}
                                {attendancePercentage >= 75 && attendancePercentage < 80 && (
                                    <View style={styles.attendanceWarning}>
                                        <Ionicons name="warning" size={16} color="#ffc107" />
                                        <Text style={styles.attendanceWarningText}>
                                            Only {attendancePercentage - 75}% above minimum requirement
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create<StylesType>({
    chartContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    desktopChartContainer: {
        padding: 24,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#333",
    },
    chartSubtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    attendanceDetails: {
        marginTop: 16,
    },
    desktopAttendanceDetails: {
        marginTop: 24,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    desktopAttendanceGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    attendanceItem: {
        backgroundColor: "#f8f9fa",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    desktopAttendanceItem: {
        width: "48%",
        marginBottom: 16,
    },
    attendanceItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    attendanceItemTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#333",
    },
    attendanceItemValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    attendanceItemDetail: {
        fontSize: 13,
        color: "#666",
        marginBottom: 8,
    },
    attendanceWarning: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    attendanceWarningText: {
        fontSize: 12,
        marginLeft: 4,
        color: "#ffc107",
    },
    loadingContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: "#ff5252",
        textAlign: "center",
    },
    emptyState: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    }
});

export default AttendanceChartView;