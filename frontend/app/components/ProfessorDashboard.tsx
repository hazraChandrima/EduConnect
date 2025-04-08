import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Modal,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/ProfessorDashboard.style";
import { useRouter } from "expo-router";
import FileManagement from "./FileManagement";
import QuizTab from "./QuizTab";
import { APP_CONFIG } from "@/app-config";


const API_BASE_URL = APP_CONFIG.API_BASE_URL;
const screenWidth = Dimensions.get("window").width;

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
}

interface Course {
    _id: string;
    code: string;
    title: string;
    department: string;
    students: Student[];
    color: string;
    icon: string;
    credits: number;
}

interface Student {
    _id: string;
    name: string;
    email: string;
    program?: string;
    year?: number;
}

interface Assignment {
    _id: string;
    title: string;
    description: string;
    courseId: string;
    dueDate: string;
    status: string;
    submissions?: number;
    courseCode?: string;
    courseColor?: string;
}

interface AssignmentSubmission {
    _id: string;
    assignmentId: string;
    courseId: string;
    downloadUrl: string;
    uploader: {
        _id: string;
        name: string;
        email: string;
    };
    grade?: number;
    feedback?: string;
    status: "submitted" | "graded";
    createdAt: string;
}

interface Attendance {
    _id: string;
    courseId: string;
    studentId: string;
    date: string;
    status: "present" | "absent" | "excused";
    student?: {
        _id: string;
        name: string;
        email: string;
    };
}

interface Mark {
    _id: string;
    courseId: string;
    studentId: string;
    title: string;
    score: number;
    maxScore: number;
    type: "assignment" | "quiz" | "exam" | "project";
    feedback?: string;
    student?: {
        _id: string;
        name: string;
        email: string;
    };
}

interface AttendanceStatus {
    [key: string]: "present" | "absent" | "excused";
}

export default function ProfessorDashboard({ userId }: { userId: string }) {
    const [activeTab, setActiveTab] = useState("home");
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isAssignmentModalVisible, setIsAssignmentModalVisible] = useState(false);
    const [isGradingModalVisible, setIsGradingModalVisible] = useState(false);
    const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
    const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        dueDate: "",
        courseId: "",
    });
    const [gradeInput, setGradeInput] = useState("");
    const [feedbackInput, setFeedbackInput] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
    const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({});

    const [userData, setUserData] = useState<UserData | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
    const [marks, setMarks] = useState<Mark[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOffline, setIsOffline] = useState(false);

    const authContext = useContext(AuthContext);
    const router = useRouter();

    const displayName = userData?.name || "Professor";
    const firstName = displayName.split(" ")[0];

    // Monitor network status
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsOffline(!state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    // Fetch all data on component mount
    useEffect(() => {
        const checkAuthAndFetchData = async (): Promise<void> => {
            try {
                setIsLoading(true);

                if (!authContext?.user) {
                    console.log("No authenticated user, redirecting to login");
                    router.replace("/login");
                    return;
                }

                if (authContext.user.role !== "professor") {
                    console.log(`User role is ${authContext.user.role}, not authorized for professor dashboard`);
                    router.replace(`/${authContext.user.role}/${authContext.user.userId}` as never);
                    return;
                }

                // Fetch user data
                const userResponse = await fetch(`${API_BASE_URL}/api/user/${userId}`);
                if (!userResponse.ok) {
                    throw new Error(`API request failed with status ${userResponse.status}`);
                }
                const userData = await userResponse.json();
                setUserData(userData);
                await AsyncStorage.setItem("professorDashboardUserData", JSON.stringify(userData));

                // Fetch courses taught by this professor
                const coursesResponse = await fetch(`${API_BASE_URL}/api/courses/professor/${userId}`);
                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json();
                    setCourses(coursesData);
                    await AsyncStorage.setItem("professorDashboardCourses", JSON.stringify(coursesData));

                    // Get all students from these courses
                    const allStudents: Student[] = [];
                    coursesData.forEach((course: Course) => {
                        course.students.forEach((student) => {
                            if (!allStudents.some(s => s._id === student._id)) {
                                allStudents.push(student);
                            }
                        });
                    });
                    setStudents(allStudents);
                    await AsyncStorage.setItem("professorDashboardStudents", JSON.stringify(allStudents));
                }

                // Fetch assignments created by this professor
                const assignmentsPromises = courses.map(course =>
                    fetch(`${API_BASE_URL}/api/assignment/course/${course._id}`)
                        .then(res => res.ok ? res.json() : [])
                );

                const assignmentsResults = await Promise.all(assignmentsPromises);
                const allAssignments = assignmentsResults.flat();

                // Enhance assignments with course info
                const enhancedAssignments = allAssignments.map((assignment: Assignment) => {
                    const course = courses.find(c => c._id === assignment.courseId);
                    return {
                        ...assignment,
                        courseCode: course?.code || "",
                        courseColor: course?.color || "#5c51f3"
                    };
                });

                setAssignments(enhancedAssignments);
                await AsyncStorage.setItem("professorDashboardAssignments", JSON.stringify(enhancedAssignments));

                // Fetch submissions for all assignments
                const submissionsPromises = allAssignments.map(assignment =>
                    fetch(`${API_BASE_URL}/api/assignment/${assignment._id}/submissions`)
                        .then(res => res.ok ? res.json() : [])
                );

                const submissionsResults = await Promise.all(submissionsPromises);
                const allSubmissions = submissionsResults.flat();
                setSubmissions(allSubmissions);
                await AsyncStorage.setItem("professorDashboardSubmissions", JSON.stringify(allSubmissions));

                // Fetch attendance records for all courses
                const attendancePromises = courses.map(course =>
                    fetch(`${API_BASE_URL}/api/attendance/course/${course._id}`)
                        .then(res => res.ok ? res.json() : [])
                );

                const attendanceResults = await Promise.all(attendancePromises);
                const allAttendance = attendanceResults.flat();
                setAttendanceRecords(allAttendance);
                await AsyncStorage.setItem("professorDashboardAttendance", JSON.stringify(allAttendance));

                // Fetch marks for all courses
                const marksPromises = courses.map(course =>
                    fetch(`${API_BASE_URL}/api/marks/course/${course._id}`)
                        .then(res => res.ok ? res.json() : [])
                );

                const marksResults = await Promise.all(marksPromises);
                const allMarks = marksResults.flat();
                setMarks(allMarks);
                await AsyncStorage.setItem("professorDashboardMarks", JSON.stringify(allMarks));

            } catch (error) {
                console.error("Error in ProfessorDashboard:", error);

                // Load cached data if available
                const loadCachedData = async () => {
                    const cachedUserData = await AsyncStorage.getItem("professorDashboardUserData");
                    if (cachedUserData) setUserData(JSON.parse(cachedUserData));

                    const cachedCourses = await AsyncStorage.getItem("professorDashboardCourses");
                    if (cachedCourses) setCourses(JSON.parse(cachedCourses));

                    const cachedStudents = await AsyncStorage.getItem("professorDashboardStudents");
                    if (cachedStudents) setStudents(JSON.parse(cachedStudents));

                    const cachedAssignments = await AsyncStorage.getItem("professorDashboardAssignments");
                    if (cachedAssignments) setAssignments(JSON.parse(cachedAssignments));

                    const cachedSubmissions = await AsyncStorage.getItem("professorDashboardSubmissions");
                    if (cachedSubmissions) setSubmissions(JSON.parse(cachedSubmissions));

                    const cachedAttendance = await AsyncStorage.getItem("professorDashboardAttendance");
                    if (cachedAttendance) setAttendanceRecords(JSON.parse(cachedAttendance));

                    const cachedMarks = await AsyncStorage.getItem("professorDashboardMarks");
                    if (cachedMarks) setMarks(JSON.parse(cachedMarks));
                };

                await loadCachedData();

                if (isOffline) {
                    console.log("Offline mode: loaded cached data");
                } else {
                    console.warn("Backend unreachable. Showing cached data.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, [authContext, router, userId]);

    const handleLogout = async () => {
        try {
            await authContext?.logout?.();
            router.replace("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleCreateAssignment = async () => {
        if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate || !newAssignment.courseId) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${API_BASE_URL}/api/assignment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newAssignment.title,
                    description: newAssignment.description,
                    courseId: newAssignment.courseId,
                    dueDate: newAssignment.dueDate,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Add course info to the new assignment
                const course = courses.find(c => c._id === newAssignment.courseId);
                const newAssignmentWithCourse = {
                    ...data.assignment,
                    courseCode: course?.code || "",
                    courseColor: course?.color || "#5c51f3",
                };

                // Update assignments state
                const updatedAssignments = [...assignments, newAssignmentWithCourse];
                setAssignments(updatedAssignments);
                await AsyncStorage.setItem("professorDashboardAssignments", JSON.stringify(updatedAssignments));

                Alert.alert("Success", "Assignment created successfully");
            } else {
                Alert.alert("Error", data.error || "Failed to create assignment");
            }
        } catch (error) {
            console.error("Error creating assignment:", error);
            Alert.alert("Error", "Failed to create assignment");
        } finally {
            setIsLoading(false);
            setIsAssignmentModalVisible(false);
            setNewAssignment({
                title: "",
                description: "",
                dueDate: "",
                courseId: "",
            });
        }
    };

    const handleGradeSubmission = async () => {
        if (!gradeInput || !selectedSubmission) {
            Alert.alert("Error", "Please enter a grade");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${API_BASE_URL}/api/assignment/submissions/${selectedSubmission._id}/grade`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    grade: parseInt(gradeInput),
                    feedback: feedbackInput,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update submissions state
                const updatedSubmissions = submissions.map(submission =>
                    submission._id === selectedSubmission._id
                        ? { ...submission, grade: parseInt(gradeInput), feedback: feedbackInput, status: "graded" as const }
                        : submission
                );

                setSubmissions(updatedSubmissions);
                await AsyncStorage.setItem("professorDashboardSubmissions", JSON.stringify(updatedSubmissions));

                // Also add a mark for this student
                if (selectedSubmission && selectedAssignment) {
                    const markData = {
                        courseId: selectedSubmission.courseId,
                        studentId: selectedSubmission.uploader._id,
                        title: selectedAssignment.title,
                        score: parseInt(gradeInput),
                        maxScore: 100, // Assuming max score is 100
                        type: "assignment",
                        feedback: feedbackInput,
                    };

                    const markResponse = await fetch(`${API_BASE_URL}/api/marks`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(markData),
                    });

                    if (markResponse.ok) {
                        const markResult = await markResponse.json();
                        const updatedMarks = [...marks, markResult.mark];
                        setMarks(updatedMarks);
                        await AsyncStorage.setItem("professorDashboardMarks", JSON.stringify(updatedMarks));
                    }
                }

                Alert.alert("Success", "Submission graded successfully");
            } else {
                Alert.alert("Error", data.error || "Failed to grade submission");
            }
        } catch (error) {
            console.error("Error grading submission:", error);
            Alert.alert("Error", "Failed to grade submission");
        } finally {
            setIsLoading(false);
            setIsGradingModalVisible(false);
            setGradeInput("");
            setFeedbackInput("");
            setSelectedSubmission(null);
        }
    };

    const handleSaveAttendance = async () => {
        if (Object.keys(attendanceStatus).length === 0 || !selectedCourse) {
            Alert.alert("Error", "No attendance data to save");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${API_BASE_URL}/api/attendance/record`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courseId: selectedCourse._id,
                    date: attendanceDate,
                    attendanceData: attendanceStatus,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update attendance records state
                const newRecords = data.attendanceRecords || [];
                const updatedAttendance = [...attendanceRecords, ...newRecords];
                setAttendanceRecords(updatedAttendance);
                await AsyncStorage.setItem("professorDashboardAttendance", JSON.stringify(updatedAttendance));

                Alert.alert("Success", "Attendance recorded successfully");
            } else {
                Alert.alert("Error", data.error || "Failed to record attendance");
            }
        } catch (error) {
            console.error("Error recording attendance:", error);
            Alert.alert("Error", "Failed to record attendance");
        } finally {
            setIsLoading(false);
            setIsAttendanceModalVisible(false);
            setAttendanceStatus({});
        }
    };

    // Calculate attendance percentage for a course
    const calculateCourseAttendance = (courseId: string): number => {
        const courseAttendance = attendanceRecords.filter(record => record.courseId === courseId);
        if (courseAttendance.length === 0) return 0;

        const presentCount = courseAttendance.filter(record =>
            record.status === "present" || record.status === "excused"
        ).length;

        return Math.round((presentCount / courseAttendance.length) * 100);
    };

    // Calculate average grade for a course
    const calculateCourseAverageGrade = (courseId: string): number => {
        const courseMarks = marks.filter(mark => mark.courseId === courseId);
        if (courseMarks.length === 0) return 0;

        const totalPercentage = courseMarks.reduce(
            (sum, mark) => sum + (mark.score / mark.maxScore) * 100,
            0
        );

        return Math.round(totalPercentage / courseMarks.length);
    };

    // Get pending assignments that need grading
    const getPendingAssignments = (): Assignment[] => {
        return assignments.filter(assignment => {
            const assignmentSubmissions = submissions.filter(sub => sub.assignmentId === assignment._id);
            const pendingSubmissions = assignmentSubmissions.filter(sub => sub.status === "submitted");
            return pendingSubmissions.length > 0;
        });
    };

    // Prepare chart data
    const getAttendanceChartData = () => {
        return {
            labels: courses.map(course => course.code),
            datasets: [
                {
                    data: courses.map(course => calculateCourseAttendance(course._id)),
                    color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
                    strokeWidth: 2,
                },
            ],
            legend: ["Attendance %"],
        };
    };

    const getGradeDistributionData = () => {
        // Count grades in ranges: A (90-100), B (80-89), C (70-79), D (60-69), F (0-59)
        const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };

        marks.forEach(mark => {
            const percentage = (mark.score / mark.maxScore) * 100;
            if (percentage >= 90) gradeCounts.A++;
            else if (percentage >= 80) gradeCounts.B++;
            else if (percentage >= 70) gradeCounts.C++;
            else if (percentage >= 60) gradeCounts.D++;
            else gradeCounts.F++;
        });

        const total = Object.values(gradeCounts).reduce((sum, count) => sum + count, 0) || 1;

        return {
            labels: ["A", "B", "C", "D", "F"],
            data: [
                gradeCounts.A / total,
                gradeCounts.B / total,
                gradeCounts.C / total,
                gradeCounts.D / total,
                gradeCounts.F / total,
            ],
            colors: ["#52c4eb", "#5c51f3", "#ff9f40", "#ff5694", "#ff4040"],
        };
    };

    const getAssignmentCompletionData = () => {
        return {
            labels: courses.map(course => course.code),
            datasets: [
                {
                    data: courses.map(course => {
                        const courseAssignments = assignments.filter(a => a.courseId === course._id);
                        if (courseAssignments.length === 0) return 0;

                        const totalSubmissions = courseAssignments.reduce((sum, assignment) => {
                            const assignmentSubmissions = submissions.filter(sub => sub.assignmentId === assignment._id);
                            return sum + assignmentSubmissions.length;
                        }, 0);

                        const totalPossibleSubmissions = courseAssignments.length * course.students.length;
                        return totalPossibleSubmissions > 0
                            ? Math.round((totalSubmissions / totalPossibleSubmissions) * 100)
                            : 0;
                    }),
                    color: (opacity = 1) => `rgba(255, 86, 148, ${opacity})`,
                },
            ],
        };
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#5c51f3" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    // Render home tab content
    const renderHomeTab = () => (
        <>
            {/* Welcome Banner */}
            <View style={styles.welcomeBanner}>
                <Text style={styles.welcomeTitle}>Hello, Dr. {firstName}</Text>
                <Text style={styles.welcomeSubtitle}>Welcome back to your professor dashboard</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{courses.length}</Text>
                        <Text style={styles.statLabel}>Courses</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{students.length}</Text>
                        <Text style={styles.statLabel}>Students</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{assignments.length}</Text>
                        <Text style={styles.statLabel}>Assignments</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {Math.round(
                                courses.reduce((sum, course) => sum + calculateCourseAttendance(course._id), 0) /
                                (courses.length || 1)
                            )}%
                        </Text>
                        <Text style={styles.statLabel}>Avg. Attendance</Text>
                    </View>
                </View>
            </View>

            {/* Charts Section */}
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Course Analytics</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Attendance by Course</Text>
                        <LineChart
                            data={getAttendanceChartData()}
                            width={screenWidth - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#5c51f3",
                                },
                            }}
                            bezier
                            style={styles.chart}
                        />
                    </View>
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Grade Distribution</Text>
                        <PieChart
                            data={getGradeDistributionData().labels.map((label, index) => ({
                                name: label,
                                population: getGradeDistributionData().data[index] * 100,
                                color: getGradeDistributionData().colors[index],
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 12,
                            }))}
                            width={screenWidth - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Assignment Completion Rate (%)</Text>
                        <BarChart
                            data={getAssignmentCompletionData()}
                            width={screenWidth - 40}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix="%"
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 86, 148, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                barPercentage: 0.7,
                            }}
                            style={styles.chart}
                        />
                    </View>
                </ScrollView>
            </View>

            {/* Courses Section */}
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your Courses</Text>
                    <TouchableOpacity onPress={() => setActiveTab("courses")}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Course Items */}
                {courses.map((course) => (
                    <TouchableOpacity
                        key={course._id}
                        style={styles.courseItem}
                        onPress={() => {
                            setSelectedCourse(course);
                            setActiveTab("courses");
                        }}
                    >
                        <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                            <FontAwesome name={course.icon as any} size={24} color="white" />
                        </View>
                        <View style={styles.courseDetails}>
                            <Text style={styles.courseTitle}>{course.title}</Text>
                            <View style={styles.studentsContainer}>
                                <Ionicons name="people" size={16} color="#777" />
                                <Text style={styles.studentsText}>{course.students.length} Students</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Pending Assignments Section */}
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Pending Assignments</Text>
                    <TouchableOpacity onPress={() => setActiveTab("grading")}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Assignment Items */}
                {getPendingAssignments().map((assignment) => {
                    const assignmentSubmissions = submissions.filter(sub => sub.assignmentId === assignment._id);
                    const pendingSubmissions = assignmentSubmissions.filter(sub => sub.status === "submitted");

                    return (
                        <View key={assignment._id} style={styles.assignmentItem}>
                            <View style={styles.assignmentHeader}>
                                <View style={[styles.courseTag, { backgroundColor: assignment.courseColor }]}>
                                    <Text style={styles.courseTagText}>{assignment.courseCode}</Text>
                                </View>
                                <Text style={styles.submissionsText}>{pendingSubmissions.length} Submissions</Text>
                            </View>
                            <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                            <Text style={styles.assignmentDescription}>{assignment.description}</Text>
                            <View style={styles.assignmentFooter}>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>Needs Grading</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => {
                                        setSelectedAssignment(assignment);
                                        setSelectedSubmission(pendingSubmissions[0]);
                                        setIsGradingModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.actionButtonText}>Grade Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}

                <TouchableOpacity style={styles.createButton} onPress={() => setIsAssignmentModalVisible(true)}>
                    <AntDesign name="plus" size={20} color="white" />
                    <Text style={styles.createButtonText}>Create New Assignment</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    // Render courses tab content
    const renderCoursesTab = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Your Courses</Text>
            </View>

            {selectedCourse ? (
                <View style={styles.courseDetailContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => setSelectedCourse(null)}>
                        <Ionicons name="arrow-back" size={24} color="#4252e5" />
                        <Text style={styles.backButtonText}>Back to Courses</Text>
                    </TouchableOpacity>

                    <View style={[styles.courseHeader, { backgroundColor: selectedCourse.color }]}>
                        <FontAwesome name={selectedCourse.icon as any} size={32} color="white" />
                        <View style={styles.courseHeaderInfo}>
                            <Text style={styles.courseHeaderTitle}>{selectedCourse.title}</Text>
                            <Text style={styles.courseHeaderCode}>{selectedCourse.code}</Text>
                        </View>
                    </View>

                    <View style={styles.courseStats}>
                        <View style={styles.courseStat}>
                            <Text style={styles.courseStatValue}>{selectedCourse.students.length}</Text>
                            <Text style={styles.courseStatLabel}>Students</Text>
                        </View>
                        <View style={styles.courseStat}>
                            <Text style={styles.courseStatValue}>{calculateCourseAttendance(selectedCourse._id)}%</Text>
                            <Text style={styles.courseStatLabel}>Attendance</Text>
                        </View>
                        <View style={styles.courseStat}>
                            <Text style={styles.courseStatValue}>
                                {assignments.filter(a => a.courseId === selectedCourse._id).length}
                            </Text>
                            <Text style={styles.courseStatLabel}>Assignments</Text>
                        </View>
                        <View style={styles.courseStat}>
                            <Text style={styles.courseStatValue}>{calculateCourseAverageGrade(selectedCourse._id)}%</Text>
                            <Text style={styles.courseStatLabel}>Avg. Grade</Text>
                        </View>
                    </View>

                    <View style={styles.courseActions}>
                        <TouchableOpacity style={styles.courseAction} onPress={() => setIsAttendanceModalVisible(true)}>
                            <MaterialIcons name="date-range" size={24} color="#4252e5" />
                            <Text style={styles.courseActionText}>Take Attendance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.courseAction}
                            onPress={() => {
                                setNewAssignment({ ...newAssignment, courseId: selectedCourse._id });
                                setIsAssignmentModalVisible(true);
                            }}
                        >
                            <MaterialIcons name="assignment" size={24} color="#4252e5" />
                            <Text style={styles.courseActionText}>Create Assignment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.courseAction}
                            onPress={() => setActiveTab("grading")}
                        >
                            <MaterialIcons name="grading" size={24} color="#4252e5" />
                            <Text style={styles.courseActionText}>Grade Assignments</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Students</Text>
                    {selectedCourse.students.map(student => (
                        <TouchableOpacity
                            key={student._id}
                            style={styles.studentItem}
                            onPress={() => {
                                setSelectedStudent(student);
                                setActiveTab("students");
                            }}
                        >
                            <View style={styles.studentAvatar}>
                                <Ionicons name="person" size={24} color="white" />
                            </View>
                            <View style={styles.studentInfo}>
                                <Text style={styles.studentName}>{student.name}</Text>
                                <Text style={styles.studentEmail}>{student.email}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <>
                    <View style={styles.courseFilters}>
                        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
                            <Text style={styles.activeFilterText}>All Courses</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>Archived</Text>
                        </TouchableOpacity>
                    </View>

                    {courses.map((course) => (
                        <TouchableOpacity key={course._id} style={styles.courseCard} onPress={() => setSelectedCourse(course)}>
                            <View style={[styles.courseCardHeader, { backgroundColor: course.color }]}>
                                <FontAwesome name={course.icon as any} size={24} color="white" />
                                <Text style={styles.courseCardCode}>{course.code}</Text>
                            </View>
                            <View style={styles.courseCardBody}>
                                <Text style={styles.courseCardTitle}>{course.title}</Text>
                                <View style={styles.courseCardStats}>
                                    <View style={styles.courseCardStat}>
                                        <Ionicons name="people" size={16} color="#777" />
                                        <Text style={styles.courseCardStatText}>{course.students.length} Students</Text>
                                    </View>
                                    <View style={styles.courseCardStat}>
                                        <MaterialIcons name="assignment" size={16} color="#777" />
                                        <Text style={styles.courseCardStatText}>
                                            {assignments.filter(a => a.courseId === course._id).length} Assignments
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </>
            )}
        </>
    );

    // Render attendance tab content
    const renderAttendanceTab = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Attendance Management</Text>
            </View>

            <View style={styles.attendanceFilters}>
                <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
                    <Text style={styles.activeFilterText}>All Courses</Text>
                </TouchableOpacity>
                {courses.map(course => (
                    <TouchableOpacity key={course._id} style={styles.filterButton}>
                        <Text style={styles.filterText}>{course.code}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.attendanceActions}>
                <TouchableOpacity style={styles.attendanceAction} onPress={() => setIsAttendanceModalVisible(true)}>
                    <MaterialIcons name="add" size={24} color="#4252e5" />
                    <Text style={styles.attendanceActionText}>Take Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.attendanceAction}>
                    <MaterialIcons name="history" size={24} color="#4252e5" />
                    <Text style={styles.attendanceActionText}>View History</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Attendance Trends</Text>
                <LineChart
                    data={getAttendanceChartData()}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#5c51f3",
                        },
                    }}
                    bezier
                    style={styles.chart}
                />
            </View>

            <Text style={styles.sectionTitle}>Recent Attendance Records</Text>

            {attendanceRecords
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map(record => {
                    const course = courses.find(c => c._id === record.courseId);
                    const student = students.find(s => s._id === record.studentId);

                    if (!course || !student) return null;

                    return (
                        <View key={record._id} style={styles.attendanceRecord}>
                            <View style={styles.attendanceRecordHeader}>
                                <Text style={styles.attendanceRecordDate}>
                                    {new Date(record.date).toLocaleDateString()}
                                </Text>
                                <View style={[styles.courseTag, { backgroundColor: course.color }]}>
                                    <Text style={styles.courseTagText}>{course.code}</Text>
                                </View>
                            </View>
                            <View style={styles.attendanceRecordDetails}>
                                <Text style={styles.attendanceRecordStudent}>{student.name}</Text>
                                <Text style={styles.attendanceRecordStatus}>
                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </Text>
                            </View>
                        </View>
                    );
                })}
        </>
    );

    // Render grading tab content
    const renderGradingTab = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Assignment Grading</Text>
            </View>

            <View style={styles.gradingFilters}>
                <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
                    <Text style={styles.activeFilterText}>Needs Grading</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Graded</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>All</Text>
                </TouchableOpacity>
            </View>

            {getPendingAssignments().map((assignment) => {
                const assignmentSubmissions = submissions.filter(sub => sub.assignmentId === assignment._id);
                const pendingSubmissions = assignmentSubmissions.filter(sub => sub.status === "submitted");

                return (
                    <View key={assignment._id} style={styles.gradingItem}>
                        <View style={styles.gradingItemHeader}>
                            <View style={[styles.courseTag, { backgroundColor: assignment.courseColor }]}>
                                <Text style={styles.courseTagText}>{assignment.courseCode}</Text>
                            </View>
                            <Text style={styles.submissionsText}>{pendingSubmissions.length} Submissions</Text>
                        </View>
                        <Text style={styles.gradingItemTitle}>{assignment.title}</Text>
                        <Text style={styles.gradingItemDescription}>{assignment.description}</Text>
                        <View style={styles.gradingItemFooter}>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Needs Grading</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.gradingButton}
                                onPress={() => {
                                    setSelectedAssignment(assignment);
                                    setSelectedSubmission(pendingSubmissions[0]);
                                    setIsGradingModalVisible(true);
                                }}
                            >
                                <MaterialIcons name="grading" size={20} color="white" />
                                <Text style={styles.gradingButtonText}>Grade Submissions</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}

            <TouchableOpacity style={styles.createButton} onPress={() => setIsAssignmentModalVisible(true)}>
                <AntDesign name="plus" size={20} color="white" />
                <Text style={styles.createButtonText}>Create New Assignment</Text>
            </TouchableOpacity>
        </>
    );

    // Render students tab content
    const renderStudentsTab = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Students</Text>
            </View>

            {selectedStudent ? (
                <View style={styles.studentDetailContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => setSelectedStudent(null)}>
                        <Ionicons name="arrow-back" size={24} color="#4252e5" />
                        <Text style={styles.backButtonText}>Back to Students</Text>
                    </TouchableOpacity>

                    <View style={styles.studentProfile}>
                        <View style={styles.studentProfileAvatar}>
                            <Ionicons name="person" size={40} color="white" />
                        </View>
                        <Text style={styles.studentProfileName}>{selectedStudent.name}</Text>
                        <Text style={styles.studentProfileId}>ID: {selectedStudent._id}</Text>
                        <Text style={styles.studentProfileEmail}>{selectedStudent.email}</Text>
                    </View>

                    <View style={styles.studentCoursePerformance}>
                        <Text style={styles.sectionTitle}>Course Performance</Text>

                        {courses.filter(course =>
                            course.students.some(s => s._id === selectedStudent._id)
                        ).map(course => {
                            const studentAttendance = attendanceRecords.filter(
                                record => record.courseId === course._id && record.studentId === selectedStudent._id
                            );

                            const attendancePercentage = studentAttendance.length > 0
                                ? Math.round(
                                    studentAttendance.filter(record =>
                                        record.status === "present" || record.status === "excused"
                                    ).length / studentAttendance.length * 100
                                )
                                : 0;

                            const studentMarks = marks.filter(
                                mark => mark.courseId === course._id && mark.studentId === selectedStudent._id
                            );

                            const averageGrade = studentMarks.length > 0
                                ? Math.round(
                                    studentMarks.reduce((sum, mark) => sum + (mark.score / mark.maxScore) * 100, 0) /
                                    studentMarks.length
                                )
                                : 0;

                            // Convert percentage to letter grade
                            const getLetterGrade = (percentage: number) => {
                                if (percentage >= 90) return "A";
                                if (percentage >= 80) return "B";
                                if (percentage >= 70) return "C";
                                if (percentage >= 60) return "D";
                                return "F";
                            };

                            return (
                                <View key={course._id} style={styles.studentCourseItem}>
                                    <View style={styles.studentCourseHeader}>
                                        <Text style={styles.studentCourseTitle}>{course.title}</Text>
                                        <View style={styles.studentCourseGrade}>
                                            <Text style={styles.studentCourseGradeText}>{getLetterGrade(averageGrade)}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.studentCourseStat}>
                                        <Text style={styles.studentCourseStatLabel}>Attendance:</Text>
                                        <View style={styles.progressBar}>
                                            <View style={[styles.progressFill, { width: `${attendancePercentage}%` }]} />
                                        </View>
                                        <Text style={styles.studentCourseStatValue}>{attendancePercentage}%</Text>
                                    </View>

                                    <Text style={styles.assignmentsHeader}>Assignments</Text>
                                    {assignments
                                        .filter(assignment => assignment.courseId === course._id)
                                        .map(assignment => {
                                            const submission = submissions.find(
                                                sub => sub.assignmentId === assignment._id && sub.uploader._id === selectedStudent._id
                                            );

                                            return (
                                                <View key={assignment._id} style={styles.studentAssignmentItem}>
                                                    <View style={styles.studentAssignmentHeader}>
                                                        <Text style={styles.studentAssignmentTitle}>{assignment.title}</Text>
                                                        <Text style={styles.studentAssignmentStatus}>
                                                            {submission ? submission.status.charAt(0).toUpperCase() + submission.status.slice(1) : "Not Submitted"}
                                                        </Text>
                                                    </View>

                                                    {submission ? (
                                                        <View style={styles.studentAssignmentGrading}>
                                                            <Text style={styles.studentAssignmentLabel}>Grade:</Text>
                                                            {submission.grade ? (
                                                                <Text style={styles.studentAssignmentGrade}>{submission.grade}/100</Text>
                                                            ) : (
                                                                <TouchableOpacity
                                                                    style={styles.gradeButton}
                                                                    onPress={() => {
                                                                        setSelectedAssignment(assignment);
                                                                        setSelectedSubmission(submission);
                                                                        setIsGradingModalVisible(true);
                                                                    }}
                                                                >
                                                                    <Text style={styles.gradeButtonText}>Grade Now</Text>
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    ) : (
                                                        <Text style={styles.studentAssignmentDueDate}>
                                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                        </Text>
                                                    )}
                                                </View>
                                            );
                                        })}
                                </View>
                            );
                        })}
                    </View>
                </View>
            ) : (
                <>
                    <View style={styles.studentFilters}>
                        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
                            <Text style={styles.activeFilterText}>All Students</Text>
                        </TouchableOpacity>
                        {courses.map(course => (
                            <TouchableOpacity key={course._id} style={styles.filterButton}>
                                <Text style={styles.filterText}>{course.code}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {students.map(student => (
                        <TouchableOpacity
                            key={student._id}
                            style={styles.studentItem}
                            onPress={() => setSelectedStudent(student)}
                        >
                            <View style={styles.studentAvatar}>
                                <Ionicons name="person" size={24} color="white" />
                            </View>
                            <View style={styles.studentInfo}>
                                <Text style={styles.studentName}>{student.name}</Text>
                                <Text style={styles.studentEmail}>{student.email}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </>
            )}
        </>
    );

    // Create Assignment Modal
    const renderAssignmentModal = () => (
        <Modal
            visible={isAssignmentModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsAssignmentModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Create New Assignment</Text>
                        <TouchableOpacity onPress={() => setIsAssignmentModalVisible(false)}>
                            <AntDesign name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <Text style={styles.inputLabel}>Assignment Title</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter assignment title"
                            value={newAssignment.title}
                            onChangeText={(text) => setNewAssignment({ ...newAssignment, title: text })}
                        />

                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            placeholder="Enter assignment description"
                            multiline={true}
                            numberOfLines={4}
                            value={newAssignment.description}
                            onChangeText={(text) => setNewAssignment({ ...newAssignment, description: text })}
                        />

                        <Text style={styles.inputLabel}>Due Date</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="YYYY-MM-DD"
                            value={newAssignment.dueDate}
                            onChangeText={(text) => setNewAssignment({ ...newAssignment, dueDate: text })}
                        />

                        <Text style={styles.inputLabel}>Course</Text>
                        <View style={styles.pickerContainer}>
                            {courses.map((course) => (
                                <TouchableOpacity
                                    key={course._id}
                                    style={[styles.courseOption, newAssignment.courseId === course._id && styles.selectedCourseOption]}
                                    onPress={() => setNewAssignment({ ...newAssignment, courseId: course._id })}
                                >
                                    <Text
                                        style={[
                                            styles.courseOptionText,
                                            newAssignment.courseId === course._id && styles.selectedCourseOptionText,
                                        ]}
                                    >
                                        {course.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleCreateAssignment} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitButtonText}>Create Assignment</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    // Grading Modal
    const renderGradingModal = () => (
        <Modal
            visible={isGradingModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsGradingModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Grade Assignment</Text>
                        <TouchableOpacity onPress={() => setIsGradingModalVisible(false)}>
                            <AntDesign name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {selectedAssignment && selectedSubmission && (
                            <>
                                <View style={styles.gradingAssignmentInfo}>
                                    <Text style={styles.gradingAssignmentTitle}>{selectedAssignment.title}</Text>
                                    <View style={[styles.courseTag, { backgroundColor: selectedAssignment.courseColor }]}>
                                        <Text style={styles.courseTagText}>{selectedAssignment.courseCode}</Text>
                                    </View>
                                </View>

                                <Text style={styles.gradingStudentName}>Student: {selectedSubmission.uploader.name}</Text>

                                <TouchableOpacity style={styles.viewSubmissionButton}>
                                    <Feather name="download" size={20} color="white" />
                                    <Text style={styles.viewSubmissionButtonText}>View Submission</Text>
                                </TouchableOpacity>

                                <Text style={styles.inputLabel}>Grade (0-100)</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter grade"
                                    keyboardType="numeric"
                                    value={gradeInput}
                                    onChangeText={setGradeInput}
                                />

                                <Text style={styles.inputLabel}>Feedback</Text>
                                <TextInput
                                    style={[styles.textInput, styles.textArea]}
                                    placeholder="Enter feedback for student"
                                    multiline={true}
                                    numberOfLines={4}
                                    value={feedbackInput}
                                    onChangeText={setFeedbackInput}
                                />

                                <TouchableOpacity style={styles.submitButton} onPress={handleGradeSubmission} disabled={isLoading}>
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>Submit Grade</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    // Attendance Modal
    const renderAttendanceModal = () => (
        <Modal
            visible={isAttendanceModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsAttendanceModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Take Attendance</Text>
                        <TouchableOpacity onPress={() => setIsAttendanceModalVisible(false)}>
                            <AntDesign name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <Text style={styles.inputLabel}>Date</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="YYYY-MM-DD"
                            value={attendanceDate}
                            onChangeText={setAttendanceDate}
                        />

                        <Text style={styles.inputLabel}>Course</Text>
                        <View style={styles.pickerContainer}>
                            {courses.map((course) => (
                                <TouchableOpacity
                                    key={course._id}
                                    style={[styles.courseOption, selectedCourse?._id === course._id && styles.selectedCourseOption]}
                                    onPress={() => setSelectedCourse(course)}
                                >
                                    <Text
                                        style={[
                                            styles.courseOptionText,
                                            selectedCourse?._id === course._id && styles.selectedCourseOptionText,
                                        ]}
                                    >
                                        {course.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {selectedCourse && (
                            <>
                                <Text style={styles.inputLabel}>Students</Text>
                                <View style={styles.attendanceList}>
                                    {selectedCourse.students.map(student => (
                                        <View key={student._id} style={styles.attendanceListItem}>
                                            <View style={styles.attendanceStudentInfo}>
                                                <View style={styles.studentAvatar}>
                                                    <Ionicons name="person" size={20} color="white" />
                                                </View>
                                                <Text style={styles.attendanceStudentName}>{student.name}</Text>
                                            </View>
                                            <View style={styles.attendanceOptions}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.attendanceOption,
                                                        attendanceStatus[student._id] === "present" && styles.presentOption,
                                                    ]}
                                                    onPress={() => setAttendanceStatus({ ...attendanceStatus, [student._id]: "present" })}
                                                >
                                                    <Feather
                                                        name="check"
                                                        size={20}
                                                        color={attendanceStatus[student._id] === "present" ? "white" : "#4252e5"}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.attendanceOption,
                                                        attendanceStatus[student._id] === "excused" && styles.excusedOption,
                                                    ]}
                                                    onPress={() => setAttendanceStatus({ ...attendanceStatus, [student._id]: "excused" })}
                                                >
                                                    <Feather
                                                        name="alert-circle"
                                                        size={20}
                                                        color={attendanceStatus[student._id] === "excused" ? "white" : "#FFC107"}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.attendanceOption,
                                                        attendanceStatus[student._id] === "absent" && styles.absentOption,
                                                    ]}
                                                    onPress={() => setAttendanceStatus({ ...attendanceStatus, [student._id]: "absent" })}
                                                >
                                                    <Feather
                                                        name="x"
                                                        size={20}
                                                        color={attendanceStatus[student._id] === "absent" ? "white" : "#ff5694"}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}

                        <TouchableOpacity style={styles.submitButton} onPress={handleSaveAttendance} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitButtonText}>Save Attendance</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            {isOffline && (
                <View style={{ backgroundColor: "orange", padding: 10 }}>
                    <Text style={{ color: "white", textAlign: "center" }}>
                        You are offline. Showing cached data.
                    </Text>
                </View>
            )}

            <StatusBar backgroundColor="#4252e5" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>EduConnect</Text>
                <View style={styles.profileContainer}>
                    <TouchableOpacity style={styles.profileButton} onPress={() => setIsProfileMenuVisible(!isProfileMenuVisible)}>
                        <View style={styles.profilePic}>
                            <Ionicons name="person" size={24} color="white" />
                        </View>
                        <Text style={styles.profileName}>Dr. {firstName}</Text>
                        <Ionicons
                            name={isProfileMenuVisible ? "chevron-up" : "chevron-down"}
                            size={16}
                            color="white"
                            style={{ marginLeft: 4 }}
                        />
                    </TouchableOpacity>

                    {isProfileMenuVisible && (
                        <View style={styles.profileDropdown}>
                            <TouchableOpacity style={styles.profileMenuItem} onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={20} color="#333" />
                                <Text style={styles.profileMenuItemText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                {activeTab === "home" && renderHomeTab()}
                {activeTab === "courses" && renderCoursesTab()}
                {activeTab === "attendance" && renderAttendanceTab()}
                {activeTab === "grading" && renderGradingTab()}
                {activeTab === "students" && renderStudentsTab()}
                {activeTab === "files" && <FileManagement />}
                {activeTab === "quizzes" && <QuizTab />}
            </ScrollView>

            {/* Navigation Bar */}
            <View style={styles.navigationBar}>
                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
                    <Ionicons name="home" size={24} color={activeTab === "home" ? "#5c51f3" : "#777"} />
                    <Text style={[styles.navText, activeTab === "home" && styles.navActive]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("courses")}>
                    <MaterialIcons name="library-books" size={24} color={activeTab === "courses" ? "#5c51f3" : "#777"} />
                    <Text style={[styles.navText, activeTab === "courses" && styles.navActive]}>Courses</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("attendance")}>
                    <MaterialIcons name="date-range" size={24} color={activeTab === "attendance" ? "#5c51f3" : "#777"} />
                    <Text style={[styles.navText, activeTab === "attendance" && styles.navActive]}>Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("grading")}>
                    <MaterialIcons name="grading" size={24} color={activeTab === "grading" ? "#5c51f3" : "#777"} />
                    <Text style={[styles.navText, activeTab === "grading" && styles.navActive]}>Grading</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("files")}>
                    <MaterialIcons name="folder" size={24} color={activeTab === "files" ? "#5c51f3" : "#777"} />
                    <Text style={[styles.navText, activeTab === "files" && styles.navActive]}>Files</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("quizzes")}>
                    <MaterialIcons name="quiz" size={24} color={activeTab === "quizzes" ? "#5c51f3" : "#777"} />
                    <Text style={[styles.navText, activeTab === "quizzes" && styles.navActive]}>Quizzes</Text>
                </TouchableOpacity>
            </View>

            {/* Modals */}
            {renderAssignmentModal()}
            {renderGradingModal()}
            {renderAttendanceModal()}
        </SafeAreaView>
    );
}