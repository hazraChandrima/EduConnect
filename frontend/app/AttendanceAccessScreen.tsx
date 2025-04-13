"use client";

import { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Alert,
    SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@/app/context/AuthContext";
import { useToken } from "@/app/hooks/useToken";
import { APP_CONFIG } from "@/app-config";
import AttendanceManagement from "./components/professor/attendance/AttendanceManagement";
import styles from "@/app/styles/ProfessorDashboard.style";

// --- Define Interfaces ---

// AuthUser: shape of the authenticated user coming from AuthContext.
interface AuthUser {
    userId: string;
    role: string;
    email?: string;
    hasAccess?: boolean; // may be undefined if not stored
    accessExpiresAt?: string;
}

// Attendance record as fetched for the student.
interface Attendance {
    _id: string;
    courseId: string | { _id: string }; // note: might be a string or an object
    studentId: string;
    date: string;
    status: "present" | "absent" | "excused";
    student?: {
        _id: string;
        name: string;
        email: string;
    };
    // If the API returns embedded course info:
    course?: {
        code: string;
        title: string;
        color: string;
    };
}

// Course information
interface Course {
    _id: string;
    code: string;
    title: string;
    color: string;
}

// Student information
interface Student {
    _id: string;
    name: string;
    email: string;
    program?: string;
    year?: number;
}

// For attendance statistics
interface AttendanceStats {
    present: number;
    absent: number;
    excused: number;
    total: number;
}

const screenWidth = Dimensions.get("window").width;

const AttendanceAccessScreen = () => {
    // Declare hooks unconditionally.
    const [isLoading, setIsLoading] = useState(true);
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("all");
    const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
        present: 0,
        absent: 0,
        excused: 0,
        total: 0,
    });
    const [attendanceData, setAttendanceData] = useState({
        labels: [] as string[],
        datasets: [{ data: [] as number[] }],
    });
    const [accessExpiresAt, setAccessExpiresAt] = useState<Date | null>(null);
    const [timeRemaining, setTimeRemaining] = useState("");
    const [isDesktop, setIsDesktop] = useState(screenWidth >= 1024);

    const auth = useContext(AuthContext) as { user: AuthUser | null };
    const router = useRouter();
    const { token } = useToken();

    // This flag indicates the component has fully mounted.
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update isDesktop state when window size changes.
    useEffect(() => {
        const handleDimensionChange = ({ window }: { window: { width: number } }) => {
            setIsDesktop(window.width >= 1024);
        };
        Dimensions.addEventListener("change", handleDimensionChange);
        return () => {
            Dimensions.removeEventListener("change", handleDimensionChange);
        };
    }, []);

    const API_BASE_URL = APP_CONFIG.API_BASE_URL;

    // Helper to extract a string course ID.
    const getCourseId = (courseId: string | { _id: string }): string => {
        return typeof courseId === "object" && courseId !== null ? courseId._id : courseId;
    };

    // Build unique courses from the attendance records.
    const extractUniqueCourses = (data: Attendance[]): Course[] => {
        const coursesMap: { [key: string]: Course } = {};
        data.forEach((record) => {
            const id = getCourseId(record.courseId);
            if (!coursesMap[id]) {
                coursesMap[id] = {
                    _id: id,
                    code: record?.course?.code || "Unknown",
                    title: record?.course?.title || "Unknown Course",
                    color: record?.course?.color || "#4252e5",
                };
            }
        });
        return Object.values(coursesMap);
    };

    // Check user access and fetch attendance data only after mounting.
    useEffect(() => {
        if (!mounted) return;

        const checkAccessAndFetchData = async () => {
            try {
                setIsLoading(true);

                // Ensure we have a user.
                if (!auth?.user) {
                    console.log("No authenticated user, redirecting to login");
                    router.replace("/login");
                    return;
                }

                // Only allow student role.
                if (auth.user.role !== "student") {
                    console.log(
                        `User role is ${auth.user.role}, not authorized for student attendance access`
                    );
                    router.replace(`/${auth.user.role}/${auth.user.userId}` as never);
                    return;
                }

                /* 
                  Only block access if hasAccess is explicitly false.
                  If the field is undefined or true, assume access is granted.
                */
                if (auth.user.hasAccess === false) {
                    Alert.alert("Access Denied", "You don't have access to attendance records. Please contact your professor.", [
                        {
                            text: "Go to Dashboard",
                            onPress: () =>
                                router.replace(`/student/${auth?.user?.userId}` as never),
                        },
                    ]);
                    return;
                }

                // Set access expiration time if provided.
                if (auth.user.accessExpiresAt) {
                    const expiresAt = new Date(auth.user.accessExpiresAt);
                    setAccessExpiresAt(expiresAt);
                }

                await fetchAttendanceData();
            } catch (error) {
                console.error("Error in AttendanceAccessScreen:", error);
                Alert.alert("Error", "Failed to load attendance data");
            } finally {
                setIsLoading(false);
            }
        };

        checkAccessAndFetchData();
    }, [mounted, auth?.user, router, token]);

    // Update time remaining until access expires.
    useEffect(() => {
        if (!accessExpiresAt) return;

        const updateTimeRemaining = () => {
            const now = new Date();
            const diff = accessExpiresAt.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeRemaining("Access expired");
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeRemaining(`${minutes}m ${seconds}s`);
        };

        updateTimeRemaining();
        const interval = setInterval(updateTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, [accessExpiresAt]);

    const fetchAttendanceData = async () => {
        if (!token || !auth?.user?.userId) return;

        try {
            // For a student, fetch attendance records by student.
            const response = await fetch(
                `${API_BASE_URL}/api/attendance/student/${auth.user.userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch attendance: ${response.status}`);
            }

            const data = await response.json();
            setAttendanceRecords(data);

            // Extract unique courses from attendance records using our helper.
            const uniqueCourses = extractUniqueCourses(data);
            setCourses(uniqueCourses);

            // Fetch the student data (for the current user)
            const studentResponse = await fetch(
                `${API_BASE_URL}/api/user/${auth.user.userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (studentResponse.ok) {
                const studentData = await studentResponse.json();
                setStudents([studentData]);
            }

            calculateAttendanceStats(data);
            prepareChartData(data, uniqueCourses);

            // Cache the data.
            await AsyncStorage.setItem("studentAttendanceRecords", JSON.stringify(data));
            await AsyncStorage.setItem("studentAttendanceCourses", JSON.stringify(uniqueCourses));
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            const cachedRecords = await AsyncStorage.getItem("studentAttendanceRecords");
            const cachedCourses = await AsyncStorage.getItem("studentAttendanceCourses");
            if (cachedRecords) {
                const records = JSON.parse(cachedRecords);
                setAttendanceRecords(records);
                calculateAttendanceStats(records);
                if (cachedCourses) {
                    const courses = JSON.parse(cachedCourses);
                    setCourses(courses);
                    prepareChartData(records, courses);
                }
            }
        }
    };

    const calculateAttendanceStats = (records: Attendance[]) => {
        const filteredRecords =
            selectedCourse === "all"
                ? records
                : records.filter(
                    (record) => getCourseId(record.courseId) === selectedCourse
                );
        const present = filteredRecords.filter((record) => record.status === "present").length;
        const absent = filteredRecords.filter((record) => record.status === "absent").length;
        const excused = filteredRecords.filter((record) => record.status === "excused").length;
        const total = filteredRecords.length;
        setAttendanceStats({ present, absent, excused, total });
    };

    const prepareChartData = (records: Attendance[], courses: Course[]) => {
        const courseAttendance = courses.map((course) => {
            const courseRecords = records.filter(
                (record) => getCourseId(record.courseId) === course._id
            );
            const presentCount = courseRecords.filter(
                (record) =>
                    record.status === "present" || record.status === "excused"
            ).length;
            const attendanceRate =
                courseRecords.length > 0 ? (presentCount / courseRecords.length) * 100 : 0;
            return { code: course.code, attendanceRate: Math.round(attendanceRate) };
        });
        courseAttendance.sort((a, b) => a.code.localeCompare(b.code));
        setAttendanceData({
            labels: courseAttendance.map((item) => item.code),
            datasets: [{ data: courseAttendance.map((item) => item.attendanceRate) }],
        });
    };

    const handleCourseFilter = (courseId: string) => {
        setSelectedCourse(courseId);
        const filtered =
            courseId === "all"
                ? attendanceRecords
                : attendanceRecords.filter(
                    (record) => getCourseId(record.courseId) === courseId
                );
        calculateAttendanceStats(filtered);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    // Unified return: conditional rendering is done inside the JSX.
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9ff" }}>
            {(!mounted || !auth?.user || isLoading) && (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#5c51f3" />
                    <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
                </View>
            )}

            {/* Render the "Access Denied" view only if hasAccess is explicitly false */}
            {mounted && auth?.user && !isLoading && auth.user.hasAccess === false && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                    }}
                >
                    <MaterialIcons name="lock" size={64} color="#ccc" />
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            marginTop: 20,
                            textAlign: "center",
                        }}
                    >
                        Access Denied
                    </Text>
                    <Text
                        style={{
                            textAlign: "center",
                            marginTop: 10,
                            color: "#666",
                        }}
                    >
                        You don't have access to attendance records. Please contact your professor.
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#4252e5",
                            padding: 12,
                            borderRadius: 8,
                            alignItems: "center",
                            marginTop: 20,
                            width: "100%",
                            maxWidth: 300,
                        }}
                        onPress={() => router.replace(`/student/${auth?.user?.userId}` as never)}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                            Go to Dashboard
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Render main content if user exists, is loaded, and has access (or no explicit denial) */}
            {mounted && auth?.user && !isLoading && auth.user.hasAccess !== false && (
                <ScrollView style={{ flex: 1, padding: 20 }}>
                    <View style={styles.tabHeader}>
                        <Text style={styles.tabTitle}>Attendance Records</Text>
                        {/* You can include additional header elements if needed */}
                    </View>

                    {/* Course Filters */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView}>
                        <View style={styles.attendanceFilters}>
                            <TouchableOpacity
                                style={[styles.filterButton, selectedCourse === "all" && styles.activeFilter]}
                                onPress={() => handleCourseFilter("all")}
                            >
                                <Text style={selectedCourse === "all" ? styles.activeFilterText : styles.filterText}>All Courses</Text>
                            </TouchableOpacity>
                            {courses.map((course) => (
                                <TouchableOpacity
                                    key={course._id}
                                    style={[styles.filterButton, selectedCourse === course._id && styles.activeFilter]}
                                    onPress={() => handleCourseFilter(course._id)}
                                >
                                    <Text style={selectedCourse === course._id ? styles.activeFilterText : styles.filterText}>
                                        {course.code}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Dashboard Actions */}
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#4252e5",
                                padding: 12,
                                borderRadius: 8,
                                alignItems: "center",
                            }}
                            onPress={() => router.replace(`/student/${auth?.user?.userId}` as never)}
                        >
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Return to Dashboard</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Render the Attendance Management component.
              This component (for temporary role escalation)
              will now receive the proper courses array where each course’s _id is a string. */}
                    <AttendanceManagement
                        courses={courses}
                        students={students}
                        isDesktop={isDesktop}
                        onError={(message) => Alert.alert("Error", message)}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default AttendanceAccessScreen;
