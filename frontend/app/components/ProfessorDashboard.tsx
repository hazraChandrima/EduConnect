"use client"

import { useState, useEffect, useContext } from "react"
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
    useWindowDimensions,
    Linking,
} from "react-native"
import { Ionicons, FontAwesome, MaterialIcons, AntDesign, Feather } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"
import { AuthContext } from "../context/AuthContext"
import styles from "../styles/ProfessorDashboard.style"
import { useRouter } from "expo-router"
import QuizTab from "./professor/quiz/QuizTab"
import { useToken } from "../hooks/useToken"
import { APP_CONFIG } from "@/app-config"
import StudentsList from "./professor/StudentsList"
import { AttendanceChart, GradeDistributionChart, AssignmentCompletionChart } from "./professor/ChartComponents"
import AssignmentList from "./professor/assignment/AssignmentList"
import AssignmentModal from "./professor/assignment/AssignmentModal"
import AttendanceManagement from "./professor/attendance/AttendanceManagement"
import AssignmentSubmissionsView from "./professor/assignment/AssignmentSubmissionsView"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

interface UserData {
    _id: string
    name: string
    email: string
    role: string
    department?: string
}

interface Course {
    _id: string
    code: string
    title: string
    department: string
    students: Student[]
    color: string
    icon: string
    credits: number
}

interface Student {
    _id: string
    name: string
    email: string
    program?: string
    year?: number
}

interface Assignment {
    _id: string
    title: string
    description: string
    courseId: string
    dueDate: string
    status: string
    submissions?: number
    courseCode?: string
    courseColor?: string
}

interface AssignmentSubmission {
    _id: string
    assignmentId: string
    courseId: string
    downloadUrl: string
    uploader: {
        _id: string
        name: string
        email: string
    }
    grade: number | null
    feedback: string
    status: "submitted" | "graded"
    createdAt: string
}


interface Attendance {
    _id: string
    courseId: string
    studentId: string
    date: string
    status: "present" | "absent" | "excused"
    student?: {
        _id: string
        name: string
        email: string
    }
}

interface Mark {
    _id: string
    courseId: string
    studentId: string
    title: string
    score: number
    maxScore: number
    type: "assignment" | "quiz" | "exam" | "project"
    feedback?: string
    student?: {
        _id: string
        name: string
        email: string
    }
}

interface AttendanceStatus {
    [key: string]: "present" | "absent" | "excused"
}

export default function ProfessorDashboard({ userId }: { userId: string }) {
    const [activeTab, setActiveTab] = useState("home")
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [isAssignmentModalVisible, setIsAssignmentModalVisible] = useState(false)
    const [isGradingModalVisible, setIsGradingModalVisible] = useState(false)
    const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
    const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null)
    const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false)
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        dueDate: "",
        courseId: "",
    })
    const [gradeInput, setGradeInput] = useState("")
    const [feedbackInput, setFeedbackInput] = useState("")
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
    const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({})
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isSubmissionsViewVisible, setIsSubmissionsViewVisible] = useState(false)

    const [userData, setUserData] = useState<UserData | null>(null)
    const [courses, setCourses] = useState<Course[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([])
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
    const [marks, setMarks] = useState<Mark[]>([])
    const [studentEmail, setStudentEmail] = useState("")


    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isOffline, setIsOffline] = useState(false)

    const authContext = useContext(AuthContext)
    const router = useRouter()
    const { token } = useToken()
    const { width } = useWindowDimensions()

    const isDesktop = width >= 1024
    const isTablet = width >= 768 && width < 1024
    const isMobile = width < 768

    const displayName = userData?.name || "Professor"
    const firstName = displayName.split(" ")[0]

    // Monitor network status
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsOffline(!state.isConnected)
        })
        return () => unsubscribe()
    }, [])

    // Fetch all data on component mount
    useEffect(() => {
        const checkAuthAndFetchData = async (): Promise<void> => {
            try {
                setIsLoading(true)

                if (!authContext?.user) {
                    console.log("No authenticated user, redirecting to login")
                    router.replace("/login")
                    return
                }

                if (authContext.user.role !== "professor") {
                    console.log(`User role is ${authContext.user.role}, not authorized for professor dashboard`)
                    router.replace(`/${authContext.user.role}/${authContext.user.userId}` as never)
                    return
                }

                // Fetch user data
                const userResponse = await fetch(`${API_BASE_URL}/api/user/${userId}`)
                if (!userResponse.ok) {
                    throw new Error(`API request failed with status ${userResponse.status}`)
                }
                const userData = await userResponse.json()
                setUserData(userData)
                await AsyncStorage.setItem("professorDashboardUserData", JSON.stringify(userData))

                // Make sure token is available
                if (!token) {
                    console.error("No token available for API requests")
                    throw new Error("Authentication token is missing")
                }

                // Fetch courses taught by this professor
                const coursesResponse = await fetch(`${API_BASE_URL}/api/courses/professor/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json()
                    setCourses(coursesData)
                    await AsyncStorage.setItem("professorDashboardCourses", JSON.stringify(coursesData))

                    // Get all students from these courses
                    const allStudents: Student[] = [];
                    for (const course of coursesData) {
                        for (const student of course.students) {
                            if (typeof student === "string") {
                                // If it's a string, try to fetch the full student details
                                const studentObj = await fetchStudentById(student);
                                if (studentObj && !allStudents.some((s) => s._id === studentObj._id)) {
                                    allStudents.push(studentObj);
                                }
                            } else {
                                // student is already a full object
                                if (!allStudents.some((s) => s._id === student._id)) {
                                    allStudents.push(student);
                                }
                            }
                        }
                    }
                    setStudents(allStudents);


                    setStudents(allStudents)
                    await AsyncStorage.setItem("professorDashboardStudents", JSON.stringify(allStudents))

                    // Now fetch assignments for each course
                    const assignmentsPromises = coursesData.map((course: Course) =>
                        fetch(`${API_BASE_URL}/api/assignment/course/${course._id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        })
                            .then((res) => (res.ok ? res.json() : []))
                            .catch(() => []),
                    )

                    const assignmentsResults = await Promise.all(assignmentsPromises)
                    const allAssignments = assignmentsResults.flat()

                    // Enhance assignments with course info
                    const enhancedAssignments = allAssignments.map((assignment: Assignment) => {
                        const course = coursesData.find((c: Course) => c._id === assignment.courseId)
                        return {
                            ...assignment,
                            courseCode: course?.code || "",
                            courseColor: course?.color || "#5c51f3",
                        }
                    })

                    setAssignments(enhancedAssignments)
                    await AsyncStorage.setItem("professorDashboardAssignments", JSON.stringify(enhancedAssignments))

                    // Fetch submissions for all assignments
                    if (allAssignments.length > 0) {
                        const submissionsPromises = allAssignments.map((assignment) =>
                            fetch(`${API_BASE_URL}/api/assignment/${assignment._id}/submissions`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                            })
                                .then((res) => (res.ok ? res.json() : []))
                                .catch(() => []),
                        )

                        const submissionsResults = await Promise.all(submissionsPromises)
                        const allSubmissions = submissionsResults.flat()
                        setSubmissions(allSubmissions)
                        await AsyncStorage.setItem("professorDashboardSubmissions", JSON.stringify(allSubmissions))
                    }

                    // Fetch attendance records for all courses
                    const attendancePromises = coursesData.map((course: { _id: any }) =>
                        fetch(`${API_BASE_URL}/api/attendance/course/${course._id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        })
                            .then((res) => (res.ok ? res.json() : []))
                            .catch(() => []),
                    )

                    const attendanceResults = await Promise.all(attendancePromises)
                    const allAttendance = attendanceResults.flat()
                    setAttendanceRecords(allAttendance)
                    await AsyncStorage.setItem("professorDashboardAttendance", JSON.stringify(allAttendance))

                    // Fetch marks for all courses
                    const marksPromises = coursesData.map((course: { _id: any }) =>
                        fetch(`${API_BASE_URL}/api/marks/course/${course._id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        })
                            .then((res) => (res.ok ? res.json() : []))
                            .catch(() => []),
                    )

                    async function fetchStudentById(studentId: string): Promise<Student | null> {
                        try {
                            const res = await fetch(`${API_BASE_URL}/api/user/${studentId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            if (res.ok) {
                                return await res.json();
                            } else {
                                console.error(`Failed to fetch student ${studentId}`);
                                return null;
                            }
                        } catch (error) {
                            console.error(`Error fetching student ${studentId}:`, error);
                            return null;
                        }
                    }


                    const marksResults = await Promise.all(marksPromises)
                    const allMarks = marksResults.flat()
                    setMarks(allMarks)
                    await AsyncStorage.setItem("professorDashboardMarks", JSON.stringify(allMarks))
                } else {
                    console.error("Failed to fetch courses:", coursesResponse.status, coursesResponse.statusText)
                    throw new Error(`Failed to fetch courses: ${coursesResponse.status}`)
                }
            } catch (error) {
                console.error("Error in ProfessorDashboard:", error)

                // Load cached data if available
                const loadCachedData = async () => {
                    const cachedUserData = await AsyncStorage.getItem("professorDashboardUserData")
                    if (cachedUserData) setUserData(JSON.parse(cachedUserData))

                    const cachedCourses = await AsyncStorage.getItem("professorDashboardCourses")
                    if (cachedCourses) setCourses(JSON.parse(cachedCourses))

                    const cachedStudents = await AsyncStorage.getItem("professorDashboardStudents")
                    if (cachedStudents) setStudents(JSON.parse(cachedStudents))

                    const cachedAssignments = await AsyncStorage.getItem("professorDashboardAssignments")
                    if (cachedAssignments) setAssignments(JSON.parse(cachedAssignments))

                    const cachedSubmissions = await AsyncStorage.getItem("professorDashboardSubmissions")
                    if (cachedSubmissions) setSubmissions(JSON.parse(cachedSubmissions))

                    const cachedAttendance = await AsyncStorage.getItem("professorDashboardAttendance")
                    if (cachedAttendance) setAttendanceRecords(JSON.parse(cachedAttendance))

                    const cachedMarks = await AsyncStorage.getItem("professorDashboardMarks")
                    if (cachedMarks) setMarks(JSON.parse(cachedMarks))
                }

                await loadCachedData()

                if (isOffline) {
                    console.log("Offline mode: loaded cached data")
                } else {
                    console.warn("Backend unreachable. Showing cached data.")
                }
            } finally {
                setIsLoading(false)
            }
        }

        checkAuthAndFetchData()
    }, [authContext, router, userId, token])

    const handleGrantAccess = async () => {
        if (!studentEmail) return alert("Enter student email");

        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/user/grant-access`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    professorEmail: authContext?.user?.email,
                    studentEmail: studentEmail,
                    grant: true,
                }),
            });

            if (!response.ok) throw new Error("Access grant failed");

            alert("Access granted!");
            setStudentEmail("");
        }
        catch (err) {
            console.error(err);
            alert("Failed to grant access.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authContext?.logout?.()
            router.replace("/login")
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const handleCreateAssignment = async () => {
        if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate || !newAssignment.courseId) {
            Alert.alert("Error", "Please fill in all fields")
            return
        }

        setIsLoading(true)

        try {
            if (!token) {
                throw new Error("No authentication token found")
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
            })

            const data = await response.json()

            if (response.ok) {
                // Add course info to the new assignment
                const course = courses.find((c) => c._id === newAssignment.courseId)
                const newAssignmentWithCourse = {
                    ...data.assignment,
                    courseCode: course?.code || "",
                    courseColor: course?.color || "#5c51f3",
                }

                // Update assignments state
                const updatedAssignments = [...assignments, newAssignmentWithCourse]
                setAssignments(updatedAssignments)
                await AsyncStorage.setItem("professorDashboardAssignments", JSON.stringify(updatedAssignments))

                Alert.alert("Success", "Assignment created successfully")
            } else {
                Alert.alert("Error", data.error || "Failed to create assignment")
            }
        } catch (error) {
            console.error("Error creating assignment:", error)
            Alert.alert("Error", "Failed to create assignment")
        } finally {
            setIsLoading(false)
            setIsAssignmentModalVisible(false)
            setNewAssignment({
                title: "",
                description: "",
                dueDate: "",
                courseId: "",
            })
        }
    }

    const handleGradeSubmission = async () => {
        if (!gradeInput || !selectedSubmission) {
            Alert.alert("Error", "Please enter a grade")
            return
        }

        setIsLoading(true)

        try {
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`${API_BASE_URL}/api/assignment/submissions/${selectedSubmission._id}/grade`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    grade: Number.parseInt(gradeInput),
                    feedback: feedbackInput,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                // Update submissions state
                const updatedSubmissions = submissions.map((submission) =>
                    submission._id === selectedSubmission._id
                        ? { ...submission, grade: Number.parseInt(gradeInput), feedback: feedbackInput, status: "graded" as const }
                        : submission,
                )

                setSubmissions(updatedSubmissions)
                await AsyncStorage.setItem("professorDashboardSubmissions", JSON.stringify(updatedSubmissions))

                // Also add a mark for this student
                if (selectedSubmission && selectedAssignment) {
                    const markData = {
                        courseId: selectedSubmission.courseId,
                        studentId: selectedSubmission.uploader._id,
                        title: selectedAssignment.title,
                        score: Number.parseInt(gradeInput),
                        maxScore: 100, // Assuming max score is 100
                        type: "assignment",
                        feedback: feedbackInput,
                    }

                    const markResponse = await fetch(`${API_BASE_URL}/api/marks`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(markData),
                    })

                    if (markResponse.ok) {
                        const markResult = await markResponse.json()
                        const updatedMarks = [...marks, markResult.mark]
                        setMarks(updatedMarks)
                        await AsyncStorage.setItem("professorDashboardMarks", JSON.stringify(updatedMarks))
                    }
                }

                Alert.alert("Success", "Submission graded successfully")
            } else {
                Alert.alert("Error", data.error || "Failed to grade submission")
            }
        } catch (error) {
            console.error("Error grading submission:", error)
            Alert.alert("Error", "Failed to grade submission")
        } finally {
            setIsLoading(false)
            setIsGradingModalVisible(false)
            setGradeInput("")
            setFeedbackInput("")
            setSelectedSubmission(null)
        }
    }

    const handleSaveAttendance = async () => {
        if (Object.keys(attendanceStatus).length === 0 || !selectedCourse) {
            Alert.alert("Error", "No attendance data to save")
            return
        }

        setIsLoading(true)

        try {
            if (!token) {
                throw new Error("No authentication token found")
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
            })

            const data = await response.json()

            if (response.ok) {
                // Update attendance records state
                const newRecords = data.attendanceRecords || []
                const updatedAttendance = [...attendanceRecords, ...newRecords]
                setAttendanceRecords(updatedAttendance)
                await AsyncStorage.setItem("professorDashboardAttendance", JSON.stringify(updatedAttendance))

                Alert.alert("Success", "Attendance recorded successfully")
            } else {
                Alert.alert("Error", data.error || "Failed to record attendance")
            }
        } catch (error) {
            console.error("Error recording attendance:", error)
            Alert.alert("Error", "Failed to record attendance")
        } finally {
            setIsLoading(false)
            setIsAttendanceModalVisible(false)
            setAttendanceStatus({})
        }
    }

    // Calculate attendance percentage for a course
    const calculateCourseAttendance = (courseId: string): number => {
        const courseAttendance = attendanceRecords.filter((record) => record.courseId === courseId)
        if (courseAttendance.length === 0) return 0

        const presentCount = courseAttendance.filter(
            (record) => record.status === "present" || record.status === "excused",
        ).length

        return Math.round((presentCount / courseAttendance.length) * 100)
    }

    // Calculate average grade for a course
    const calculateCourseAverageGrade = (courseId: string): number => {
        const courseMarks = marks.filter((mark) => mark.courseId === courseId)
        if (courseMarks.length === 0) return 0

        const totalPercentage = courseMarks.reduce((sum, mark) => sum + (mark.score / mark.maxScore) * 100, 0)

        return Math.round(totalPercentage / courseMarks.length)
    }

    // Get pending assignments that need grading
    const getPendingAssignments = (): Assignment[] => {
        return assignments.filter((assignment) => {
            const assignmentSubmissions = submissions.filter((sub) => sub.assignmentId === assignment._id)
            const pendingSubmissions = assignmentSubmissions.filter((sub) => sub.status === "submitted")
            return pendingSubmissions.length > 0
        })
    }

    // Get student submissions for a specific assignment
    const getStudentSubmissionsForAssignment = (studentId: string, assignmentId: string) => {
        return submissions.filter(
            (submission) => submission.uploader._id === studentId && submission.assignmentId === assignmentId,
        )
    }

    // Get all submissions for a student
    const getStudentSubmissions = (studentId: string) => {
        return submissions.filter((submission) => submission.uploader._id === studentId)
    }

    // Handle opening the submissions view for an assignment
    const handleViewAssignmentSubmissions = (assignment: Assignment) => {
        setSelectedAssignment(assignment)
        setIsSubmissionsViewVisible(true)
    }

    // Handle submission graded callback from AssignmentSubmissionsView
    const handleSubmissionGraded = (updatedSubmission: AssignmentSubmission) => {
        // Update the submissions list with the newly graded submission
        const updatedSubmissions = submissions.map((sub) => (sub._id === updatedSubmission._id ? updatedSubmission : sub))
        setSubmissions(updatedSubmissions)
        AsyncStorage.setItem("professorDashboardSubmissions", JSON.stringify(updatedSubmissions))
    }

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#5c51f3" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </SafeAreaView>
        )
    }

    // Render sidebar for desktop view
    const renderSidebar = () => (
        <View
            style={[styles.sidebar, isSidebarCollapsed && styles.collapsedSidebar, { display: isMobile ? "none" : "flex" }]}
        >
            <View style={styles.sidebarHeader}>
                {!isSidebarCollapsed && <Text style={styles.sidebarLogo}>EduConnect</Text>}
                <TouchableOpacity style={styles.sidebarToggle} onPress={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                    <MaterialIcons name={isSidebarCollapsed ? "chevron-right" : "chevron-left"} size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.sidebarContent}>
                <TouchableOpacity
                    style={[styles.sidebarItem, activeTab === "home" && styles.sidebarItemActive]}
                    onPress={() => setActiveTab("home")}
                >
                    <Ionicons name="home" size={24} color={activeTab === "home" ? "#a9a4ff" : "#b2bfd9"} />
                    {!isSidebarCollapsed && (
                        <Text style={[styles.sidebarItemText, activeTab === "home" && styles.sidebarItemTextActive]}>
                            Dashboard
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.sidebarItem, activeTab === "courses" && styles.sidebarItemActive]}
                    onPress={() => setActiveTab("courses")}
                >
                    <MaterialIcons name="library-books" size={24} color={activeTab === "courses" ? "#a9a4ff" : "#b2bfd9"} />
                    {!isSidebarCollapsed && (
                        <Text style={[styles.sidebarItemText, activeTab === "courses" && styles.sidebarItemTextActive]}>
                            Courses
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.sidebarItem, activeTab === "attendance" && styles.sidebarItemActive]}
                    onPress={() => setActiveTab("attendance")}
                >
                    <MaterialIcons name="date-range" size={24} color={activeTab === "attendance" ? "#a9a4ff" : "#b2bfd9"} />
                    {!isSidebarCollapsed && (
                        <Text style={[styles.sidebarItemText, activeTab === "attendance" && styles.sidebarItemTextActive]}>
                            Attendance
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.sidebarItem, activeTab === "grading" && styles.sidebarItemActive]}
                    onPress={() => setActiveTab("grading")}
                >
                    <MaterialIcons name="grading" size={24} color={activeTab === "grading" ? "#a9a4ff" : "#b2bfd9"} />
                    {!isSidebarCollapsed && (
                        <Text style={[styles.sidebarItemText, activeTab === "grading" && styles.sidebarItemTextActive]}>
                            Grading
                        </Text>
                    )}
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={[styles.sidebarItem, activeTab === "students" && styles.sidebarItemActive]}
                    onPress={() => setActiveTab("students")}
                >
                    <Ionicons name="people" size={24} color={activeTab === "students" ? "#a9a4ff" : "#b2bfd9"} />
                    {!isSidebarCollapsed && (
                        <Text style={[styles.sidebarItemText, activeTab === "students" && styles.sidebarItemTextActive]}>
                            Students
                        </Text>
                    )}
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={[styles.sidebarItem, activeTab === "quizzes" && styles.sidebarItemActive]}
                    onPress={() => setActiveTab("quizzes")}
                >
                    <MaterialIcons name="quiz" size={24} color={activeTab === "quizzes" ? "#a9a4ff" : "#b2bfd9"} />
                    {!isSidebarCollapsed && (
                        <Text style={[styles.sidebarItemText, activeTab === "quizzes" && styles.sidebarItemTextActive]}>
                            Quizzes
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.sidebarLogout} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#777" />
                {!isSidebarCollapsed && <Text style={styles.sidebarLogoutText}>Logout</Text>}
            </TouchableOpacity>
        </View>
    )

    // Render home tab content
    const renderHomeTab = () => (
        <>
            {/* Welcome Banner */}
            <View style={[styles.welcomeBanner, isDesktop && styles.desktopWelcomeBanner]}>
                <Text style={styles.welcomeTitle}>Hello, Dr. {firstName}</Text>
                <Text style={styles.welcomeSubtitle}>Welcome back to your professor dashboard</Text>

                <View style={[styles.statsContainer, (isDesktop || isTablet) && styles.desktopStatsContainer]}>
                    <View style={[styles.statCard, (isDesktop || isTablet) && styles.desktopStatCard]}>
                        <Text style={styles.statValue}>{courses.length}</Text>
                        <Text style={styles.statLabel}>Courses</Text>
                    </View>
                    <View style={[styles.statCard, (isDesktop || isTablet) && styles.desktopStatCard]}>
                        <Text style={styles.statValue}>{students.length}</Text>
                        <Text style={styles.statLabel}>Students</Text>
                    </View>
                    <View style={[styles.statCard, (isDesktop || isTablet) && styles.desktopStatCard]}>
                        <Text style={styles.statValue}>{assignments.length}</Text>
                        <Text style={styles.statLabel}>Assignments</Text>
                    </View>
                    <View style={[styles.statCard, (isDesktop || isTablet) && styles.desktopStatCard]}>
                        <Text style={styles.statValue}>
                            {Math.round(
                                courses.reduce((sum, course) => sum + calculateCourseAttendance(course._id), 0) / (courses.length || 1),
                            )}
                            %
                        </Text>
                        <Text style={styles.statLabel}>Avg. Attendance</Text>
                    </View>
                </View>
            </View>
{/* 
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Grant Attendance Access</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter student email"
                        value={studentEmail}
                        onChangeText={setStudentEmail}
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                        style={styles.grantButton}
                        onPress={handleGrantAccess}
                    >
                        <Text style={styles.grantButtonText}>Grant</Text>
                    </TouchableOpacity>
                </View>
            </View> */}

            {/* Charts Section */}
            <View style={[styles.sectionContainer, isDesktop && styles.desktopSectionContainer]}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Course Analytics</Text>
                </View>

                <View style={isDesktop ? styles.desktopChartsGrid : null}>
                    <View style={isDesktop ? styles.desktopChartItem : null}>
                        <AttendanceChart courses={courses} calculateCourseAttendance={calculateCourseAttendance} />
                    </View>

                    <View style={isDesktop ? styles.desktopChartItem : null}>
                        <GradeDistributionChart marks={marks} />
                    </View>

                    <View style={isDesktop ? styles.desktopChartItem : null}>
                        <AssignmentCompletionChart courses={courses} assignments={assignments} submissions={submissions} />
                    </View>
                </View>
            </View>

            {/* Pending Assignments Section */}
            <View style={[styles.sectionContainer, isDesktop && styles.desktopSectionContainer]}>
                <AssignmentList
                    pendingAssignments={getPendingAssignments()}
                    submissions={submissions}
                    onGradeAssignment={(assignment, submission) => {
                        setSelectedAssignment(assignment)
                        setSelectedSubmission(submission)
                        setIsGradingModalVisible(true)
                    }}
                    onCreateAssignment={() => setIsAssignmentModalVisible(true)}
                    title="Assignments Needing Grading"
                    userId={userId}
                    role="professor"
                />
            </View>
        </>
    )

    const renderCoursesTab = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Your Courses</Text>
            </View>

            {selectedCourse ? (
                <View style={[styles.courseDetailContainer, isDesktop && styles.desktopCourseDetailContainer]}>
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

                    <View style={[styles.courseStats, isDesktop && styles.desktopCourseStats]}>
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
                                {assignments.filter((a) => a.courseId === selectedCourse._id).length}
                            </Text>
                            <Text style={styles.courseStatLabel}>Assignments</Text>
                        </View>
                        <View style={styles.courseStat}>
                            <Text style={styles.courseStatValue}>{calculateCourseAverageGrade(selectedCourse._id)}%</Text>
                            <Text style={styles.courseStatLabel}>Avg. Grade</Text>
                        </View>
                    </View>

                    <View style={[styles.courseActions, isDesktop && styles.desktopCourseActions]}>
                        <TouchableOpacity style={styles.courseAction} onPress={() => setIsAttendanceModalVisible(true)}>
                            <MaterialIcons name="date-range" size={24} color="#4252e5" />
                            <Text style={styles.courseActionText}>Take Attendance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.courseAction}
                            onPress={() => {
                                setNewAssignment({ ...newAssignment, courseId: selectedCourse._id })
                                setIsAssignmentModalVisible(true)
                            }}
                        >
                            <MaterialIcons name="assignment" size={24} color="#4252e5" />
                            <Text style={styles.courseActionText}>Create Assignment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.courseAction} onPress={() => setActiveTab("grading")}>
                            <MaterialIcons name="grading" size={24} color="#4252e5" />
                            <Text style={styles.courseActionText}>Grade Assignments</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Students</Text>
                    <StudentsList course={selectedCourse} onSelectStudent={setSelectedStudent} setActiveTab={setActiveTab} />
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

                    <View style={isDesktop ? styles.desktopCoursesGrid : null}>
                        {courses.map((course) => (
                            <TouchableOpacity
                                key={course._id}
                                style={[styles.courseCard, isDesktop && styles.desktopCourseCard]}
                                onPress={() => setSelectedCourse(course)}
                            >
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
                                                {assignments.filter((a) => a.courseId === course._id).length} Assignments
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}
        </>
    )

    const renderAttendanceTab = () => (
        <>
            <AttendanceManagement
                courses={courses}
                students={students}  // Pass the full students array here
                isDesktop={isDesktop}
                onError={(message) => Alert.alert("Error", message)}
            />

        </>
    )

    const renderGradingTab = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Grading Center</Text>
            </View>
            <View style={[styles.tabContent, isDesktop && styles.desktopTabContent]}>
                <View style={styles.gradingFilters}>
                    <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
                        <Text style={styles.activeFilterText}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>Graded</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>All</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Submissions Pending Grading</Text>

                {assignments.length > 0 && submissions.some((s) => s.status === "submitted") ? (
                    <View style={isDesktop ? styles.desktopGradingGrid : null}>
                        {assignments.map((assignment) => {
                            const assignmentSubmissions = submissions.filter(
                                (sub) => sub.assignmentId === assignment._id && sub.status === "submitted",
                            )

                            if (assignmentSubmissions.length === 0) return null

                            const course = courses.find((c) => c._id === assignment.courseId)

                            return (
                                <View
                                    key={assignment._id}
                                    style={[styles.gradingAssignmentCard, isDesktop && styles.desktopGradingAssignmentCard]}
                                >
                                    <View style={styles.gradingAssignmentHeader}>
                                        <MaterialIcons name="assignment" size={24} color="#4252e5" />
                                        <View style={styles.gradingAssignmentInfo}>
                                            <Text style={styles.gradingAssignmentTitle}>{assignment.title}</Text>
                                            <View style={[styles.courseTag, { backgroundColor: assignment.courseColor }]}>
                                                <Text style={styles.courseTagText}>{assignment.courseCode}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <Text style={styles.submissionsCountText}>
                                        {assignmentSubmissions.length} submission{assignmentSubmissions.length !== 1 ? "s" : ""} pending
                                    </Text>

                                    <View style={styles.submissionsList}>
                                        {assignmentSubmissions.map((submission) => (
                                            <TouchableOpacity
                                                key={submission._id}
                                                style={styles.submissionItem}
                                                onPress={() => {
                                                    setSelectedAssignment(assignment)
                                                    setSelectedSubmission(submission)
                                                    setIsGradingModalVisible(true)
                                                }}
                                            >
                                                <View style={styles.submissionStudent}>
                                                    <View style={styles.studentAvatar}>
                                                        <Ionicons name="person" size={16} color="white" />
                                                    </View>
                                                    <Text style={styles.submissionStudentName}>{submission.uploader.name}</Text>
                                                </View>
                                                <View style={styles.submissionInfo}>
                                                    <Text style={styles.submissionDate}>
                                                        Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                                                    </Text>
                                                    <TouchableOpacity style={styles.gradeButton}>
                                                        <Text style={styles.gradeButtonText}>Grade</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <TouchableOpacity
                                        style={styles.viewAllButton}
                                        onPress={() => handleViewAssignmentSubmissions(assignment)}
                                    >
                                        <Text style={styles.viewAllButtonText}>View All Submissions</Text>
                                        <MaterialIcons name="chevron-right" size={18} color="#4252e5" />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="grading" size={48} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>No Pending Submissions</Text>
                        <Text style={styles.emptyStateMessage}>
                            There are no submissions waiting to be graded. Check back later or create a new assignment.
                        </Text>
                        <TouchableOpacity style={styles.emptyStateButton} onPress={() => setIsAssignmentModalVisible(true)}>
                            <Text style={styles.emptyStateButtonText}>Create Assignment</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Grade Reports</Text>

                <ScrollView
                    horizontal={!isDesktop}
                    showsHorizontalScrollIndicator={false}
                    style={styles.gradeReportsContainer}
                    contentContainerStyle={isDesktop ? styles.desktopGradeReportsGrid : null}
                >
                    {courses.map((course) => (
                        <TouchableOpacity
                            key={course._id}
                            style={[styles.gradeReportCard, isDesktop && styles.desktopGradeReportCard]}
                        >
                            <View style={[styles.gradeReportHeader, { backgroundColor: course.color }]}>
                                <FontAwesome name={course.icon as any} size={24} color="white" />
                                <Text style={styles.gradeReportTitle}>{course.code}</Text>
                            </View>
                            <View style={styles.gradeReportBody}>
                                <Text style={styles.gradeReportAvg}>{calculateCourseAverageGrade(course._id)}%</Text>
                                <Text style={styles.gradeReportLabel}>Class Average</Text>
                                <Text style={styles.gradeReportStudents}>
                                    {course.students.length} student{course.students.length !== 1 ? "s" : ""}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )

    return (
        <SafeAreaView style={styles.container}>
            {isOffline && (
                <View style={{ backgroundColor: "orange", padding: 10 }}>
                    <Text style={{ color: "white", textAlign: "center" }}>You are offline. Showing cached data.</Text>
                </View>
            )}

            <StatusBar backgroundColor="#4252e5" barStyle="light-content" />

            {/* Header */}
            <View
                style={[
                    styles.header,
                    isDesktop && styles.desktopHeader,
                    isDesktop && isSidebarCollapsed && styles.desktopHeaderWithCollapsedSidebar,
                ]}
            >
                {isMobile && <Text style={styles.logo}>EduConnect</Text>}
                {!isMobile && (
                    <View style={styles.headerTitle}>
                        <Text style={styles.headerTitleText}>
                            {activeTab === "home"
                                ? "Dashboard"
                                : activeTab === "courses"
                                    ? "Courses"
                                    : activeTab === "attendance"
                                        ? "Attendance"
                                        : activeTab === "grading"
                                            ? "Grading"
                                            : activeTab === "files"
                                                    ? "Files"
                                                    : activeTab === "quizzes"
                                                        ? "Quizzes"
                                                        : ""}
                        </Text>
                    </View>
                )}
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

            <View
                style={[
                    styles.contentContainer,
                    isDesktop && styles.desktopContentContainer,
                    isDesktop && isSidebarCollapsed && styles.desktopContentContainerWithCollapsedSidebar,
                ]}
            >
                {/* Sidebar for desktop */}
                {!isMobile && renderSidebar()}

                {/* Main Content */}
                <View style={[styles.mainContent, isDesktop && styles.desktopMainContent]}>
                    {isSubmissionsViewVisible ? (
                        <AssignmentSubmissionsView
                            selectedAssignment={selectedAssignment}
                            onClose={() => setIsSubmissionsViewVisible(false)}
                            token={token}
                            onGradeSubmitted={handleSubmissionGraded}
                            courses={courses}
                            marks={marks}
                            setMarks={setMarks}
                        />
                    ) : (
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={isDesktop ? styles.desktopScrollViewContent : null}
                        >
                            {activeTab === "home" && renderHomeTab()}
                            {activeTab === "courses" && renderCoursesTab()}
                            {activeTab === "attendance" && renderAttendanceTab()}
                            {activeTab === "grading" && renderGradingTab()}
                            {activeTab === "quizzes" && <QuizTab />}
                        </ScrollView>
                    )}
                </View>
            </View>

            {/* Mobile Navigation Bar */}
            {isMobile && (
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
                </View>
            )}

            {/* Modals */}
            <AssignmentModal
                visible={isAssignmentModalVisible}
                onClose={() => setIsAssignmentModalVisible(false)}
                newAssignment={newAssignment}
                setNewAssignment={setNewAssignment}
                courses={courses}
                handleCreateAssignment={handleCreateAssignment}
                isLoading={isLoading}
            />

            {/* Grading Modal */}
            <Modal
                visible={isGradingModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsGradingModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, isDesktop && styles.desktopModalContainer]}>
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

                                    <TouchableOpacity
                                        style={styles.viewSubmissionButton}
                                        onPress={() => {
                                            Linking.openURL(selectedSubmission.downloadUrl).catch((err) => {
                                                console.error("Error opening URL:", err)
                                                Alert.alert("Error", "Could not open the submission file")
                                            })
                                        }}
                                    >
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
        </SafeAreaView>
    )
}
