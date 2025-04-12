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
    FlatList,
    Alert,
    useWindowDimensions,
} from "react-native"
import { MaterialIcons, FontAwesome5, Ionicons, AntDesign, Feather } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"
import { AuthContext } from "../context/AuthContext"
import styles from "../styles/AdminDashboard.style"
import { useRouter } from "expo-router"
import { APP_CONFIG } from "@/app-config"
import DashboardHeader from "./admin/DashboardHeader"
import AnalyticsSection from "./admin/AnalyticsSection"
import UserForm from "./admin/UserForm"
import CourseForm from "./admin/CourseForm"
import CoursesList from "./admin/CoursesList"
import CourseDetail from "./admin/CourseDetail"
import SettingsTab from "./admin/SettingsTab"
import type { UserData, Course } from "@/types/types"
import { useToken } from "../hooks/useToken"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

export default function AdminDashboard({ userId }: { userId: string }) {
    const [activeTab, setActiveTab] = useState<
        "dashboard" | "users" | "professors" | "students" | "courses" | "settings"
    >("dashboard")
    const [selectedProfessor, setSelectedProfessor] = useState<UserData | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<UserData | null>(null)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [isUserModalVisible, setIsUserModalVisible] = useState(false)
    const [isCourseModalVisible, setIsCourseModalVisible] = useState(false)
    const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<UserData | Course | null>(null)
    const [deleteType, setDeleteType] = useState<"professor" | "student" | "course" | "">("")
    const [searchQuery, setSearchQuery] = useState("")
    const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    const [userData, setUserData] = useState<UserData | null>(null)
    const [professors, setProfessors] = useState<UserData[]>([])
    const [students, setStudents] = useState<UserData[]>([])
    const [courses, setCourses] = useState<Course[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isOffline, setIsOffline] = useState(false)

    const authContext = useContext(AuthContext)
    const router = useRouter()
    const { width } = useWindowDimensions()
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    const isDesktop = width >= 1024

    const { token } = useToken()

    const displayName = userData?.name || "Admin"
    const firstName = displayName.split(" ")[0]

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsOffline(!state.isConnected)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const checkAuthAndFetchData = async (): Promise<void> => {
            try {
                setIsLoading(true)

                if (!authContext?.user) {
                    console.log("No authenticated user, redirecting to login")
                    router.replace("/login")
                    return
                }

                if (!token) {
                    throw new Error("No authentication token found")
                }

                if (authContext.user.role !== "admin") {
                    console.log(`User role is ${authContext.user.role}, not authorized for admin dashboard`)
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
                await AsyncStorage.setItem("adminDashboardUserData", JSON.stringify(userData))

                // Fetch all professors
                const professorsResponse = await fetch(`${API_BASE_URL}/api/user/role/professor`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (professorsResponse.ok) {
                    const professorsData = await professorsResponse.json()
                    setProfessors(professorsData)
                    await AsyncStorage.setItem("adminDashboardProfessors", JSON.stringify(professorsData))
                }

                // Fetch all students
                const studentsResponse = await fetch(`${API_BASE_URL}/api/user/role/student`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (studentsResponse.ok) {
                    const studentsData = await studentsResponse.json()
                    setStudents(studentsData)
                    await AsyncStorage.setItem("adminDashboardStudents", JSON.stringify(studentsData))
                }

                // Fetch all courses
                const coursesResponse = await fetch(`${API_BASE_URL}/api/courses`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json()
                    setCourses(coursesData)
                    await AsyncStorage.setItem("adminDashboardCourses", JSON.stringify(coursesData))
                }
            } catch (error) {
                console.error("Error in AdminDashboard:", error)

                // Load cached data if available
                const loadCachedData = async () => {
                    const cachedUserData = await AsyncStorage.getItem("adminDashboardUserData")
                    if (cachedUserData) setUserData(JSON.parse(cachedUserData))

                    const cachedProfessors = await AsyncStorage.getItem("adminDashboardProfessors")
                    if (cachedProfessors) setProfessors(JSON.parse(cachedProfessors))

                    const cachedStudents = await AsyncStorage.getItem("adminDashboardStudents")
                    if (cachedStudents) setStudents(JSON.parse(cachedStudents))

                    const cachedCourses = await AsyncStorage.getItem("adminDashboardCourses")
                    if (cachedCourses) setCourses(JSON.parse(cachedCourses))
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

    const handleLogout = async () => {
        try {
            await authContext?.logout?.()
            router.replace("/login")
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const handleUserAdded = (newUser: UserData) => {
        if (newUser.role === "professor") {
            setProfessors([...professors, newUser])
        } else if (newUser.role === "student") {
            setStudents([...students, newUser])
        }
    }

    const handleCourseAdded = (newCourse: Course) => {
        setCourses([...courses, newCourse])
    }

    const handleDeleteConfirmation = (item: UserData | Course, type: "professor" | "student" | "course") => {
        setItemToDelete(item)
        setDeleteType(type)
        setIsConfirmDeleteModalVisible(true)
    }

    const handleDelete = async () => {
        if (!itemToDelete || !deleteType) return

        setIsLoading(true)

        try {
            const token = localStorage.getItem("token")
            if (!token) {
                throw new Error("No authentication token found")
            }

            let endpoint = ""

            if (deleteType === "professor" || deleteType === "student") {
                endpoint = `${API_BASE_URL}/api/user/${itemToDelete._id}`
            } else if (deleteType === "course") {
                endpoint = `${API_BASE_URL}/api/courses/${itemToDelete._id}`
            }

            const response = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                // Update the appropriate state based on the delete type
                if (deleteType === "professor") {
                    const updatedProfessors = professors.filter((prof) => prof._id !== itemToDelete._id)
                    setProfessors(updatedProfessors)
                    await AsyncStorage.setItem("adminDashboardProfessors", JSON.stringify(updatedProfessors))

                    if (selectedProfessor && selectedProfessor._id === itemToDelete._id) {
                        setSelectedProfessor(null)
                    }
                } else if (deleteType === "student") {
                    const updatedStudents = students.filter((student) => student._id !== itemToDelete._id)
                    setStudents(updatedStudents)
                    await AsyncStorage.setItem("adminDashboardStudents", JSON.stringify(updatedStudents))

                    if (selectedStudent && selectedStudent._id === itemToDelete._id) {
                        setSelectedStudent(null)
                    }
                } else if (deleteType === "course") {
                    const updatedCourses = courses.filter((course) => course._id !== itemToDelete._id)
                    setCourses(updatedCourses)
                    await AsyncStorage.setItem("adminDashboardCourses", JSON.stringify(updatedCourses))

                    if (selectedCourse && selectedCourse._id === itemToDelete._id) {
                        setSelectedCourse(null)
                    }
                }

                Alert.alert("Success", `${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted successfully`)
            } else {
                const data = await response.json()
                Alert.alert("Error", data.error || `Failed to delete ${deleteType}`)
            }
        } catch (error) {
            console.error(`Error deleting ${deleteType}:`, error)
            Alert.alert("Error", `Failed to delete ${deleteType}`)
        } finally {
            setIsLoading(false)
            setIsConfirmDeleteModalVisible(false)
            setItemToDelete(null)
            setDeleteType("")
        }
    }

    const filteredProfessors = professors.filter(
        (professor) =>
            professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            professor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (professor.department && professor.department.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (student.program && student.program.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    const filteredCourses = courses.filter(
        (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.professor.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Prepare chart data
    const getUserGrowthData = () => {
        // Sort users by join date and count cumulative users over time
        const allUsers = [...professors, ...students].sort(
            (a, b) => new Date(a.joinDate || "").getTime() - new Date(b.joinDate || "").getTime(),
        )

        const months: { [key: string]: number } = {}
        let cumulativeCount = 0

        allUsers.forEach((user) => {
            if (user.joinDate) {
                const month = new Date(user.joinDate).toLocaleDateString("en-US", { month: "short" })
                cumulativeCount++
                months[month] = cumulativeCount
            }
        })

        // If we have less than 9 months of data, add some placeholder months
        const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
        const labels = Object.keys(months).length >= 9 ? Object.keys(months).slice(-9) : allMonths

        const data = labels.map((month) => months[month] || 0)

        return {
            labels,
            datasets: [
                {
                    data,
                    color: (opacity = 1) => `rgba(65, 105, 225,${opacity})`,
                    strokeWidth: 2,
                },
            ],
            legend: ["User Growth"],
        }
    }

    const getDepartmentDistributionData = () => {
        const departmentCounts: { [key: string]: number } = {}
            ;[...professors, ...students].forEach((user) => {
                if (user.department) {
                    departmentCounts[user.department] = (departmentCounts[user.department] || 0) + 1
                }
            })

        const sortedDepartments = Object.entries(departmentCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)

        const labels = sortedDepartments.map(([dept]) => dept)
        const total = sortedDepartments.reduce((sum, [, count]) => sum + count, 0)
        const data = sortedDepartments.map(([, count]) => count / total)

        return {
            labels,
            data,
            colors: ["#4169E1", "#40BFFF", "#FF4081", "#FFA000", "#00C853"],
        }
    }

    const getSystemUsageData = () => {
        // This would typically come from analytics data
        // For now, we'll use placeholder data
        return {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    data: [65, 78, 90, 85, 92, 45, 30],
                    color: (opacity = 1) => `rgba(64, 191, 255, ${opacity})`,
                },
            ],
        }
    }

    const getDepartmentDistributionChartData = () => {
        const { labels, data, colors } = getDepartmentDistributionData()
        return labels.map((label, index) => ({
            name: label,
            population: Number.parseFloat((data[index] * 100).toFixed(2)),
            color: colors[index],
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        }))
    }

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#4169E1" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </SafeAreaView>
        )
    }

    const renderCoursesTab = () => (
        <>
            {selectedCourse ? (
                <CourseDetail
                    course={selectedCourse}
                    onBack={() => setSelectedCourse(null)}
                    onDelete={(course) => handleDeleteConfirmation(course, "course")}
                    onStudentSelect={(student) => {
                        setSelectedStudent(student)
                        setActiveTab("students")
                    }}
                />
            ) : (
                <CoursesList
                    courses={filteredCourses}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onCourseSelect={setSelectedCourse}
                    onAddCourse={() => setIsCourseModalVisible(true)}
                    onDeleteCourse={(course) => handleDeleteConfirmation(course, "course")}
                />
            )}
        </>
    )

    const renderSettingsTab = () => <SettingsTab />

    const renderDashboardTab = () => (
        <>
            <DashboardHeader
                studentsCount={students.length}
                professorsCount={professors.length}
                coursesCount={courses.length}
            />

            <AnalyticsSection
                userGrowthData={getUserGrowthData()}
                departmentDistributionData={getDepartmentDistributionChartData()}
                systemUsageData={getSystemUsageData()}
            />

            {/* System Status Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>System Status</Text>

                <View style={styles.serverStatusHeader}>
                    <Text style={styles.serverStatusTitle}>Server Status</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewDetailsLink}>View Details</Text>
                    </TouchableOpacity>
                </View>

                {/* Status Items */}
                <View style={styles.statusItem}>
                    <Text style={styles.statusLabel}>API Server</Text>
                    <View style={styles.statusIndicatorContainer}>
                        <View style={styles.onlineIndicator} />
                        <Text style={styles.statusText}>Online</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statusItem}>
                    <Text style={styles.statusLabel}>Database</Text>
                    <View style={styles.statusIndicatorContainer}>
                        <View style={styles.onlineIndicator} />
                        <Text style={styles.statusText}>Online</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statusItem}>
                    <Text style={styles.statusLabel}>Storage Service</Text>
                    <View style={styles.statusIndicatorContainer}>
                        <View style={styles.onlineIndicator} />
                        <Text style={styles.statusText}>Online</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statusItem}>
                    <Text style={styles.statusLabel}>AI Service</Text>
                    <View style={styles.statusIndicatorContainer}>
                        <View style={styles.degradedIndicator} />
                        <Text style={styles.statusText}>Degraded</Text>
                    </View>
                </View>
            </View>

            {/* Quick Actions Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => setIsUserModalVisible(true)}>
                        <FontAwesome5 name="user-plus" size={24} color="#4169E1" />
                        <Text style={styles.actionText}>Add User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={() => setIsCourseModalVisible(true)}>
                        <MaterialIcons name="library-books" size={24} color="#4169E1" />
                        <Text style={styles.actionText}>Add Course</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab("settings")}>
                        <Ionicons name="settings" size={24} color="#4169E1" />
                        <Text style={styles.actionText}>Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <MaterialIcons name="backup" size={24} color="#4169E1" />
                        <Text style={styles.actionText}>Backup Data</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )

    const renderUsersTab = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>User Management</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setIsUserModalVisible(true)}>
                    <AntDesign name="plus" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close" size={20} color="#777" />
                    </TouchableOpacity>
                ) : null}
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "professors" && styles.activeTabButton]}
                    onPress={() => setActiveTab("professors")}
                >
                    <Text style={[styles.tabButtonText, activeTab === "professors" && styles.activeTabButtonText]}>
                        Professors
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "students" && styles.activeTabButton]}
                    onPress={() => setActiveTab("students")}
                >
                    <Text style={[styles.tabButtonText, activeTab === "students" && styles.activeTabButtonText]}>Students</Text>
                </TouchableOpacity>
            </View>

            {activeTab === "professors" ? (
                <>
                    {selectedProfessor ? (
                        <View style={styles.userDetailContainer}>
                            <TouchableOpacity style={styles.backButton} onPress={() => setSelectedProfessor(null)}>
                                <Ionicons name="arrow-back" size={24} color="#4169E1" />
                                <Text style={styles.backButtonText}>Back to Professors</Text>
                            </TouchableOpacity>

                            <View style={styles.userProfile}>
                                <View style={styles.userProfileAvatar}>
                                    <FontAwesome5 name="user-tie" size={40} color="white" />
                                </View>
                                <Text style={styles.userProfileName}>{selectedProfessor.name}</Text>
                                <Text style={styles.userProfileId}>ID: {selectedProfessor._id}</Text>
                                <Text style={styles.userProfileEmail}>{selectedProfessor.email}</Text>
                            </View>

                            <View style={styles.userInfoSection}>
                                <View style={styles.userInfoItem}>
                                    <Text style={styles.userInfoLabel}>Department:</Text>
                                    <Text style={styles.userInfoValue}>{selectedProfessor.department || "Not specified"}</Text>
                                </View>
                                <View style={styles.userInfoItem}>
                                    <Text style={styles.userInfoLabel}>Join Date:</Text>
                                    <Text style={styles.userInfoValue}>
                                        {selectedProfessor.joinDate
                                            ? new Date(selectedProfessor.joinDate).toLocaleDateString()
                                            : "Not specified"}
                                    </Text>
                                </View>
                                <View style={styles.userInfoItem}>
                                    <Text style={styles.userInfoLabel}>Courses:</Text>
                                    <View style={styles.courseTagsContainer}>
                                        {courses
                                            .filter((course) => course.professor._id === selectedProfessor._id)
                                            .map((course) => (
                                                <View key={course._id} style={styles.courseTag}>
                                                    <Text style={styles.courseTagText}>{course.title}</Text>
                                                </View>
                                            ))}
                                    </View>
                                </View>
                            </View>

                            <View style={styles.userActions}>
                                <TouchableOpacity style={styles.editButton}>
                                    <Feather name="edit" size={20} color="white" />
                                    <Text style={styles.editButtonText}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteConfirmation(selectedProfessor, "professor")}
                                >
                                    <Feather name="trash-2" size={20} color="white" />
                                    <Text style={styles.deleteButtonText}>Delete User</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredProfessors}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.userItem} onPress={() => setSelectedProfessor(item)}>
                                    <View style={styles.userAvatar}>
                                        <FontAwesome5 name="user-tie" size={24} color="white" />
                                    </View>
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>{item.name}</Text>
                                        <Text style={styles.userEmail}>{item.email}</Text>
                                        <Text style={styles.userDepartment}>{item.department || "No department"}</Text>
                                    </View>
                                    <View style={styles.userActions}>
                                        <TouchableOpacity
                                            style={styles.userActionButton}
                                            onPress={() => handleDeleteConfirmation(item, "professor")}
                                        >
                                            <Feather name="trash-2" size={20} color="#FF4081" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.userActionButton}>
                                            <Feather name="edit" size={20} color="#4169E1" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyListContainer}>
                                    <Text style={styles.emptyListText}>No professors found</Text>
                                </View>
                            }
                        />
                    )}
                </>
            ) : (
                <>
                    {selectedStudent ? (
                        <View style={styles.userDetailContainer}>
                            <TouchableOpacity style={styles.backButton} onPress={() => setSelectedStudent(null)}>
                                <Ionicons name="arrow-back" size={24} color="#4169E1" />
                                <Text style={styles.backButtonText}>Back to Students</Text>
                            </TouchableOpacity>

                            <View style={styles.userProfile}>
                                <View style={styles.userProfileAvatar}>
                                    <FontAwesome5 name="user-graduate" size={40} color="white" />
                                </View>
                                <Text style={styles.userProfileName}>{selectedStudent.name}</Text>
                                <Text style={styles.userProfileId}>ID: {selectedStudent._id}</Text>
                                <Text style={styles.userProfileEmail}>{selectedStudent.email}</Text>
                            </View>

                            <View style={styles.userInfoSection}>
                                <View style={styles.userInfoItem}>
                                    <Text style={styles.userInfoLabel}>Program:</Text>
                                    <Text style={styles.userInfoValue}>{selectedStudent.program || "Not specified"}</Text>
                                </View>
                                <View style={styles.userInfoItem}>
                                    <Text style={styles.userInfoLabel}>Join Date:</Text>
                                    <Text style={styles.userInfoValue}>
                                        {selectedStudent.joinDate
                                            ? new Date(selectedStudent.joinDate).toLocaleDateString()
                                            : "Not specified"}
                                    </Text>
                                </View>
                                <View style={styles.userInfoItem}>
                                    <Text style={styles.userInfoLabel}>Enrolled Courses:</Text>
                                    <View style={styles.courseTagsContainer}>
                                        {courses
                                            .filter((course) =>
                                                course.enrolledStudents?.some((s: { _id: string }) => s._id === selectedStudent._id),
                                            )
                                            .map((course) => (
                                                <View key={course._id} style={styles.courseTag}>
                                                    <Text style={styles.courseTagText}>{course.title}</Text>
                                                </View>
                                            ))}
                                    </View>
                                </View>
                            </View>

                            <View style={styles.userActions}>
                                <TouchableOpacity style={styles.editButton}>
                                    <Feather name="edit" size={20} color="white" />
                                    <Text style={styles.editButtonText}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteConfirmation(selectedStudent, "student")}
                                >
                                    <Feather name="trash-2" size={20} color="white" />
                                    <Text style={styles.deleteButtonText}>Delete User</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredStudents}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.userItem} onPress={() => setSelectedStudent(item)}>
                                    <View style={styles.userAvatar}>
                                        <FontAwesome5 name="user-graduate" size={24} color="white" />
                                    </View>
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>{item.name}</Text>
                                        <Text style={styles.userEmail}>{item.email}</Text>
                                        <Text style={styles.userDepartment}>{item.program || "No program"}</Text>
                                    </View>
                                    <View style={styles.userActions}>
                                        <TouchableOpacity
                                            style={styles.userActionButton}
                                            onPress={() => handleDeleteConfirmation(item, "student")}
                                        >
                                            <Feather name="trash-2" size={20} color="#FF4081" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.userActionButton}>
                                            <Feather name="edit" size={20} color="#4169E1" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyListContainer}>
                                    <Text style={styles.emptyListText}>No students found</Text>
                                </View>
                            }
                        />
                    )}
                </>
            )}
        </>
    )

    // Sidebar navigation for desktop view
    const renderSidebar = () => {
        if (isMobile) return null

        return (
            <View style={[styles.sidebar, isSidebarCollapsed && styles.sidebarCollapsed]}>
                <View style={styles.sidebarHeader}>
                    <Text style={styles.sidebarTitle}>{!isSidebarCollapsed && "EduConnect"}</Text>
                    <TouchableOpacity style={styles.sidebarToggle} onPress={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                        <Ionicons name={isSidebarCollapsed ? "chevron-forward" : "chevron-back"} size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.sidebarContent}>
                    <TouchableOpacity
                        style={[styles.sidebarItem, activeTab === "dashboard" && styles.sidebarItemActive]}
                        onPress={() => setActiveTab("dashboard")}
                    >
                        <FontAwesome5 name="th-large" size={20} color={activeTab === "dashboard" ? "#4169E1" : "white"} />
                        {!isSidebarCollapsed && (
                            <Text style={[styles.sidebarItemText, activeTab === "dashboard" && styles.sidebarItemTextActive]}>
                                Dashboard
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.sidebarItem,
                            (activeTab === "users" || activeTab === "professors" || activeTab === "students") &&
                            styles.sidebarItemActive,
                        ]}
                        onPress={() => setActiveTab("users")}
                    >
                        <FontAwesome5
                            name="users"
                            size={20}
                            color={
                                activeTab === "users" || activeTab === "professors" || activeTab === "students" ? "#4169E1" : "white"
                            }
                        />
                        {!isSidebarCollapsed && (
                            <Text
                                style={[
                                    styles.sidebarItemText,
                                    (activeTab === "users" || activeTab === "professors" || activeTab === "students") &&
                                    styles.sidebarItemTextActive,
                                ]}
                            >
                                Users
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.sidebarItem, activeTab === "courses" && styles.sidebarItemActive]}
                        onPress={() => setActiveTab("courses")}
                    >
                        <MaterialIcons name="library-books" size={20} color={activeTab === "courses" ? "#4169E1" : "white"} />
                        {!isSidebarCollapsed && (
                            <Text style={[styles.sidebarItemText, activeTab === "courses" && styles.sidebarItemTextActive]}>
                                Courses
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.sidebarItem, activeTab === "settings" && styles.sidebarItemActive]}
                        onPress={() => setActiveTab("settings")}
                    >
                        <Ionicons name="settings-outline" size={20} color={activeTab === "settings" ? "#4169E1" : "white"} />
                        {!isSidebarCollapsed && (
                            <Text style={[styles.sidebarItemText, activeTab === "settings" && styles.sidebarItemTextActive]}>
                                Settings
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.sidebarFooter}>
                    <TouchableOpacity style={styles.sidebarItem} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="white" />
                        {!isSidebarCollapsed && <Text style={styles.sidebarItemText}>Logout</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {isOffline && (
                <View style={{ backgroundColor: "orange", padding: 10 }}>
                    <Text style={{ color: "white", textAlign: "center" }}>You are offline. Showing cached data.</Text>
                </View>
            )}

            <StatusBar backgroundColor="#4169E1" barStyle="light-content" />

            <View style={styles.appContainer}>
                {renderSidebar()}

                <View style={[styles.mainContent, !isMobile && { marginLeft: isSidebarCollapsed ? 60 : 240 }]}>
                    {/* Header for mobile and desktop */}
                    <View style={styles.header}>
                        {isMobile && <Text style={styles.headerTitle}>EduConnect</Text>}
                        <View style={styles.headerActions}>
                            <View style={styles.profileContainer}>
                                <TouchableOpacity
                                    style={styles.profileButton}
                                    onPress={() => setIsProfileMenuVisible(!isProfileMenuVisible)}
                                >
                                    <View style={styles.adminBadge}>
                                        <FontAwesome5 name="user-circle" size={24} color="white" />
                                    </View>
                                    <Text style={styles.adminText}>{firstName}</Text>
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
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {activeTab === "dashboard" && renderDashboardTab()}
                        {(activeTab === "users" || activeTab === "professors" || activeTab === "students") && renderUsersTab()}
                        {activeTab === "courses" && renderCoursesTab()}
                        {activeTab === "settings" && renderSettingsTab()}
                    </ScrollView>

                    {/* Bottom Navigation for mobile only */}
                    {isMobile && (
                        <View style={styles.bottomNav}>
                            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("dashboard")}>
                                <FontAwesome5 name="th-large" size={20} color={activeTab === "dashboard" ? "#4169E1" : "#777"} />
                                <Text style={[styles.navText, activeTab === "dashboard" && styles.activeNavText]}>Dashboard</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("users")}>
                                <FontAwesome5
                                    name="users"
                                    size={20}
                                    color={
                                        activeTab === "users" || activeTab === "professors" || activeTab === "students" ? "#4169E1" : "#777"
                                    }
                                />
                                <Text
                                    style={[
                                        styles.navText,
                                        (activeTab === "users" || activeTab === "professors" || activeTab === "students") &&
                                        styles.activeNavText,
                                    ]}
                                >
                                    Users
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("courses")}>
                                <MaterialIcons name="library-books" size={20} color={activeTab === "courses" ? "#4169E1" : "#777"} />
                                <Text style={[styles.navText, activeTab === "courses" && styles.activeNavText]}>Courses</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("settings")}>
                                <Ionicons name="settings-outline" size={20} color={activeTab === "settings" ? "#4169E1" : "#777"} />
                                <Text style={[styles.navText, activeTab === "settings" && styles.activeNavText]}>Settings</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* Modals */}
            <Modal
                visible={isUserModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsUserModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <UserForm onClose={() => setIsUserModalVisible(false)} onSuccess={handleUserAdded} />
                </View>
            </Modal>

            <Modal
                visible={isCourseModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsCourseModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <CourseForm
                        professors={professors}
                        onClose={() => setIsCourseModalVisible(false)}
                        onSuccess={handleCourseAdded}
                    />
                </View>
            </Modal>

            {/* Confirm Delete Modal */}
            <Modal
                visible={isConfirmDeleteModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setIsConfirmDeleteModalVisible(false)}
            >
                <View style={styles.confirmModalOverlay}>
                    <View style={styles.confirmModalContainer}>
                        <View style={styles.confirmModalHeader}>
                            <Text style={styles.confirmModalTitle}>Confirm Delete</Text>
                            <TouchableOpacity onPress={() => setIsConfirmDeleteModalVisible(false)}>
                                <AntDesign name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.confirmModalContent}>
                            <Text style={styles.confirmModalText}>Are you sure you want to delete this {deleteType}?</Text>
                            <Text style={styles.confirmModalSubtext}>This action cannot be undone.</Text>
                        </View>

                        <View style={styles.confirmModalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsConfirmDeleteModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteConfirmButton} onPress={handleDelete} disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text style={styles.deleteConfirmButtonText}>Delete</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}
