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
    FlatList,
    Alert,
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/AdminDashboard.style";
import { useRouter } from "expo-router";
import { APP_CONFIG } from "@/app-config";

const API_BASE_URL = APP_CONFIG.API_BASE_URL;
const screenWidth = Dimensions.get("window").width;

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    program?: string;
    year?: number;
    joinDate?: string;
}

interface Course {
    _id: string;
    title: string;
    code: string;
    department: string;
    professor: {
        _id: string;
        name: string;
    };
    students: UserData[];
    credits: number;
    color?: string;
    icon?: string;
}

interface NewUser {
    name: string;
    email: string;
    password: string;
    role: "student" | "professor" | "admin";
    department: string;
    program: string;
    year?: number;
}

interface NewCourse {
    title: string;
    code: string;
    department: string;
    professorId: string;
    credits: string;
    color?: string;
    icon?: string;
}

export default function AdminDashboard({ userId }: { userId: string }) {
    const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "professors" | "students" | "courses" | "settings">("dashboard");
    const [selectedProfessor, setSelectedProfessor] = useState<UserData | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<UserData | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
    const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<UserData | Course | null>(null);
    const [deleteType, setDeleteType] = useState<"professor" | "student" | "course" | "">("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

    const [userData, setUserData] = useState<UserData | null>(null);
    const [professors, setProfessors] = useState<UserData[]>([]);
    const [students, setStudents] = useState<UserData[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    const [newUser, setNewUser] = useState<NewUser>({
        name: "",
        email: "",
        password: "",
        role: "student",
        department: "",
        program: "",
    });

    const [newCourse, setNewCourse] = useState<NewCourse>({
        title: "",
        code: "",
        department: "",
        professorId: "",
        credits: "",
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOffline, setIsOffline] = useState(false);

    const authContext = useContext(AuthContext);
    const router = useRouter();

    const displayName = userData?.name || "Admin";
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

                if (authContext.user.role !== "admin") {
                    console.log(`User role is ${authContext.user.role}, not authorized for admin dashboard`);
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
                await AsyncStorage.setItem("adminDashboardUserData", JSON.stringify(userData));

                // Fetch all professors
                const professorsResponse = await fetch(`${API_BASE_URL}/api/user/role/professor`);
                if (professorsResponse.ok) {
                    const professorsData = await professorsResponse.json();
                    setProfessors(professorsData);
                    await AsyncStorage.setItem("adminDashboardProfessors", JSON.stringify(professorsData));
                }

                // Fetch all students
                const studentsResponse = await fetch(`${API_BASE_URL}/api/user/role/student`);
                if (studentsResponse.ok) {
                    const studentsData = await studentsResponse.json();
                    setStudents(studentsData);
                    await AsyncStorage.setItem("adminDashboardStudents", JSON.stringify(studentsData));
                }

                // Fetch all courses
                const coursesResponse = await fetch(`${API_BASE_URL}/api/courses`);
                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json();
                    setCourses(coursesData);
                    await AsyncStorage.setItem("adminDashboardCourses", JSON.stringify(coursesData));
                }

            } catch (error) {
                console.error("Error in AdminDashboard:", error);

                // Load cached data if available
                const loadCachedData = async () => {
                    const cachedUserData = await AsyncStorage.getItem("adminDashboardUserData");
                    if (cachedUserData) setUserData(JSON.parse(cachedUserData));

                    const cachedProfessors = await AsyncStorage.getItem("adminDashboardProfessors");
                    if (cachedProfessors) setProfessors(JSON.parse(cachedProfessors));

                    const cachedStudents = await AsyncStorage.getItem("adminDashboardStudents");
                    if (cachedStudents) setStudents(JSON.parse(cachedStudents));

                    const cachedCourses = await AsyncStorage.getItem("adminDashboardCourses");
                    if (cachedCourses) setCourses(JSON.parse(cachedCourses));
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

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${API_BASE_URL}/api/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (response.ok) {
                // Update the appropriate state based on the user role
                if (newUser.role === "professor") {
                    const updatedProfessors = [...professors, data.user];
                    setProfessors(updatedProfessors);
                    await AsyncStorage.setItem("adminDashboardProfessors", JSON.stringify(updatedProfessors));
                } else if (newUser.role === "student") {
                    const updatedStudents = [...students, data.user];
                    setStudents(updatedStudents);
                    await AsyncStorage.setItem("adminDashboardStudents", JSON.stringify(updatedStudents));
                }

                Alert.alert("Success", "User created successfully");
            } else {
                Alert.alert("Error", data.error || "Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            Alert.alert("Error", "Failed to create user");
        } finally {
            setIsLoading(false);
            setIsUserModalVisible(false);
            setNewUser({
                name: "",
                email: "",
                password: "",
                role: "student",
                department: "",
                program: "",
            });
        }
    };

    const handleAddCourse = async () => {
        if (!newCourse.title || !newCourse.code || !newCourse.department || !newCourse.professorId) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${API_BASE_URL}/api/courses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newCourse.title,
                    code: newCourse.code,
                    department: newCourse.department,
                    professorId: newCourse.professorId,
                    credits: parseInt(newCourse.credits) || 3,
                    color: newCourse.color || "#5c51f3",
                    icon: newCourse.icon || "book",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update courses state
                const updatedCourses = [...courses, data.course];
                setCourses(updatedCourses);
                await AsyncStorage.setItem("adminDashboardCourses", JSON.stringify(updatedCourses));

                Alert.alert("Success", "Course created successfully");
            } else {
                Alert.alert("Error", data.error || "Failed to create course");
            }
        } catch (error) {
            console.error("Error creating course:", error);
            Alert.alert("Error", "Failed to create course");
        } finally {
            setIsLoading(false);
            setIsCourseModalVisible(false);
            setNewCourse({
                title: "",
                code: "",
                department: "",
                professorId: "",
                credits: "",
            });
        }
    };

    const handleDeleteConfirmation = (item: UserData | Course, type: "professor" | "student" | "course") => {
        setItemToDelete(item);
        setDeleteType(type);
        setIsConfirmDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete || !deleteType) return;

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            let endpoint = "";

            if (deleteType === "professor" || deleteType === "student") {
                endpoint = `${API_BASE_URL}/api/user/${itemToDelete._id}`;
            } else if (deleteType === "course") {
                endpoint = `${API_BASE_URL}/api/courses/${itemToDelete._id}`;
            }

            const response = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Update the appropriate state based on the delete type
                if (deleteType === "professor") {
                    const updatedProfessors = professors.filter(prof => prof._id !== itemToDelete._id);
                    setProfessors(updatedProfessors);
                    await AsyncStorage.setItem("adminDashboardProfessors", JSON.stringify(updatedProfessors));

                    if (selectedProfessor && selectedProfessor._id === itemToDelete._id) {
                        setSelectedProfessor(null);
                    }
                } else if (deleteType === "student") {
                    const updatedStudents = students.filter(student => student._id !== itemToDelete._id);
                    setStudents(updatedStudents);
                    await AsyncStorage.setItem("adminDashboardStudents", JSON.stringify(updatedStudents));

                    if (selectedStudent && selectedStudent._id === itemToDelete._id) {
                        setSelectedStudent(null);
                    }
                } else if (deleteType === "course") {
                    const updatedCourses = courses.filter(course => course._id !== itemToDelete._id);
                    setCourses(updatedCourses);
                    await AsyncStorage.setItem("adminDashboardCourses", JSON.stringify(updatedCourses));

                    if (selectedCourse && selectedCourse._id === itemToDelete._id) {
                        setSelectedCourse(null);
                    }
                }

                Alert.alert("Success", `${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted successfully`);
            } else {
                const data = await response.json();
                Alert.alert("Error", data.error || `Failed to delete ${deleteType}`);
            }
        } catch (error) {
            console.error(`Error deleting ${deleteType}:`, error);
            Alert.alert("Error", `Failed to delete ${deleteType}`);
        } finally {
            setIsLoading(false);
            setIsConfirmDeleteModalVisible(false);
            setItemToDelete(null);
            setDeleteType("");
        }
    };

    const filteredProfessors = professors.filter(
        (professor) =>
            professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            professor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (professor.department && professor.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (student.program && student.program.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredCourses = courses.filter(
        (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.professor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Prepare chart data
    const getUserGrowthData = () => {
        // Sort users by join date and count cumulative users over time
        const allUsers = [...professors, ...students].sort(
            (a, b) => new Date(a.joinDate || "").getTime() - new Date(b.joinDate || "").getTime()
        );

        const months: { [key: string]: number } = {};
        let cumulativeCount = 0;

        allUsers.forEach(user => {
            if (user.joinDate) {
                const month = new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short' });
                cumulativeCount++;
                months[month] = cumulativeCount;
            }
        });

        // If we have less than 9 months of data, add some placeholder months
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
        const labels = Object.keys(months).length >= 9 ? Object.keys(months).slice(-9) : allMonths;

        const data = labels.map(month => months[month] || 0);

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
        };
    };

    const getDepartmentDistributionData = () => {
        // Count users by department
        const departmentCounts: { [key: string]: number } = {};

        [...professors, ...students].forEach(user => {
            if (user.department) {
                departmentCounts[user.department] = (departmentCounts[user.department] || 0) + 1;
            }
        });

        // Get top 5 departments
        const sortedDepartments = Object.entries(departmentCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const labels = sortedDepartments.map(([dept]) => dept);
        const total = sortedDepartments.reduce((sum, [, count]) => sum + count, 0);
        const data = sortedDepartments.map(([, count]) => count / total);

        return {
            labels,
            data,
            colors: ["#4169E1", "#40BFFF", "#FF4081", "#FFA000", "#00C853"],
        };
    };

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
        };
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#4169E1" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    // Render dashboard tab content
    const renderDashboardTab = () => (
        <>
            {/* Dashboard Header */}
            <View style={styles.dashboardHeader}>
                <Text style={styles.dashboardTitle}>Admin Dashboard</Text>
                <Text style={styles.dashboardSubtitle}>System overview and management</Text>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{students.length}</Text>
                        <Text style={styles.statLabel}>Students</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{professors.length}</Text>
                        <Text style={styles.statLabel}>Professors</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{courses.length}</Text>
                        <Text style={styles.statLabel}>Courses</Text>
                    </View>
                </View>
            </View>

            {/* Charts Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Analytics</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>User Growth</Text>
                        <LineChart
                            data={getUserGrowthData()}
                            width={screenWidth - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#4169E1",
                                },
                            }}
                            style={styles.chart}
                        />
                    </View>
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Department Distribution</Text>
                        <PieChart
                            data={getDepartmentDistributionData().labels.map((label, index) => ({
                                name: label,
                                population: getDepartmentDistributionData().data[index] * 100,
                                color: getDepartmentDistributionData().colors[index],
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
                        <Text style={styles.chartTitle}>System Usage (Last Week)</Text>
                        <BarChart
                            data={getSystemUsageData()}
                            width={screenWidth - 40}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=" hrs"
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(64, 191, 255, ${opacity})`,
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

            {/* Recent Activity Section */}
            <View style={styles.section}>
                <View style={styles.serverStatusHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewDetailsLink}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.activityItem}>
                    <Text style={styles.activityLabel}>New User Registration</Text>
                    <Text style={styles.activityTime}>10 minutes ago</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.activityItem}>
                    <Text style={styles.activityLabel}>Course Added</Text>
                    <Text style={styles.activityTime}>2 hours ago</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.activityItem}>
                    <Text style={styles.activityLabel}>System Update</Text>
                    <Text style={styles.activityTime}>Yesterday</Text>
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
    );

    // Render users tab content
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
                                            .filter(course => course.professor._id === selectedProfessor._id)
                                            .map(course => (
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
                                    <Text style={styles.userInfoLabel}>Year:</Text>
                                    <Text style={styles.userInfoValue}>{selectedStudent.year || "Not specified"}</Text>
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
                                    <Text style={styles.userInfoLabel}>Courses:</Text>
                                    <View style={styles.courseTagsContainer}>
                                        {courses
                                            .filter(course => course.students.some(s => s._id === selectedStudent._id))
                                            .map(course => (
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
                                        <Text style={styles.userDepartment}>
                                            {item.program ? `${item.program}${item.year ? ` - Year ${item.year}` : ''}` : 'No program'}
                                        </Text>
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
    );

    // Render courses tab content
    const renderCoursesTab = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Course Management</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setIsCourseModalVisible(true)}>
                    <AntDesign name="plus" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close" size={20} color="#777" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {selectedCourse ? (
                <View style={styles.courseDetailContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => setSelectedCourse(null)}>
                        <Ionicons name="arrow-back" size={24} color="#4169E1" />
                        <Text style={styles.backButtonText}>Back to Courses</Text>
                    </TouchableOpacity>

                    <View style={styles.courseHeader}>
                        <MaterialIcons name="library-books" size={40} color="#4169E1" />
                        <View style={styles.courseHeaderInfo}>
                            <Text style={styles.courseHeaderTitle}>{selectedCourse.title}</Text>
                            <Text style={styles.courseHeaderCode}>{selectedCourse.code}</Text>
                        </View>
                    </View>

                    <View style={styles.courseInfoSection}>
                        <View style={styles.courseInfoItem}>
                            <Text style={styles.courseInfoLabel}>Department:</Text>
                            <Text style={styles.courseInfoValue}>{selectedCourse.department}</Text>
                        </View>
                        <View style={styles.courseInfoItem}>
                            <Text style={styles.courseInfoLabel}>Professor:</Text>
                            <Text style={styles.courseInfoValue}>{selectedCourse.professor.name}</Text>
                        </View>
                        <View style={styles.courseInfoItem}>
                            <Text style={styles.courseInfoLabel}>Students Enrolled:</Text>
                            <Text style={styles.courseInfoValue}>{selectedCourse.students.length}</Text>
                        </View>
                        <View style={styles.courseInfoItem}>
                            <Text style={styles.courseInfoLabel}>Credits:</Text>
                            <Text style={styles.courseInfoValue}>{selectedCourse.credits}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Enrolled Students</Text>
                    <FlatList
                        data={selectedCourse.students}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.studentItem}
                                onPress={() => {
                                    setSelectedStudent(item);
                                    setActiveTab("students");
                                }}
                            >
                                <View style={styles.studentAvatar}>
                                    <Ionicons name="person" size={24} color="white" />
                                </View>
                                <View style={styles.studentInfo}>
                                    <Text style={styles.studentName}>{item.name}</Text>
                                    <Text style={styles.studentEmail}>{item.email}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#ccc" />
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyListContainer}>
                                <Text style={styles.emptyListText}>No students enrolled</Text>
                            </View>
                        }
                    />

                    <View style={styles.courseActions}>
                        <TouchableOpacity style={styles.editButton}>
                            <Feather name="edit" size={20} color="white" />
                            <Text style={styles.editButtonText}>Edit Course</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteConfirmation(selectedCourse, "course")}
                        >
                            <Feather name="trash-2" size={20} color="white" />
                            <Text style={styles.deleteButtonText}>Delete Course</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={filteredCourses}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.courseItem} onPress={() => setSelectedCourse(item)}>
                            <View style={styles.courseItemIcon}>
                                <MaterialIcons name="library-books" size={24} color="white" />
                            </View>
                            <View style={styles.courseItemInfo}>
                                <Text style={styles.courseItemTitle}>{item.title}</Text>
                                <Text style={styles.courseItemCode}>{item.code}</Text>
                                <Text style={styles.courseItemDepartment}>{item.department}</Text>
                            </View>
                            <View style={styles.courseItemActions}>
                                <TouchableOpacity
                                    style={styles.courseItemActionButton}
                                    onPress={() => handleDeleteConfirmation(item, "course")}
                                >
                                    <Feather name="trash-2" size={20} color="#FF4081" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.courseItemActionButton}>
                                    <Feather name="edit" size={20} color="#4169E1" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyListContainer}>
                            <Text style={styles.emptyListText}>No courses found</Text>
                        </View>
                    }
                />
            )}
        </>
    );

    // Render settings tab content
    const renderSettingsTab = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>System Settings</Text>
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>General Settings</Text>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="school" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Institution Information</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="calendar" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Academic Calendar</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="notifications" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Notification Settings</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Security Settings</Text>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="lock-closed" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Authentication Settings</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="key" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>API Keys</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="shield" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Privacy Settings</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>System Maintenance</Text>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="cloud-upload" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Backup & Restore</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="refresh" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>System Updates</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="analytics" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>System Logs</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>
        </>
    );

    // Add User Modal
    const renderUserModal = () => (
        <Modal
            visible={isUserModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsUserModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New User</Text>
                        <TouchableOpacity onPress={() => setIsUserModalVisible(false)}>
                            <AntDesign name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter full name"
                            value={newUser.name}
                            onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                        />

                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter email address"
                            keyboardType="email-address"
                            value={newUser.email}
                            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                        />

                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter password"
                            secureTextEntry={true}
                            value={newUser.password}
                            onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                        />

                        <Text style={styles.inputLabel}>Role</Text>
                        <View style={styles.roleOptions}>
                            <TouchableOpacity
                                style={[styles.roleOption, newUser.role === "student" && styles.selectedRoleOption]}
                                onPress={() => setNewUser({ ...newUser, role: "student" })}
                            >
                                <Text style={[styles.roleOptionText, newUser.role === "student" && styles.selectedRoleOptionText]}>
                                    Student
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleOption, newUser.role === "professor" && styles.selectedRoleOption]}
                                onPress={() => setNewUser({ ...newUser, role: "professor" })}
                            >
                                <Text style={[styles.roleOptionText, newUser.role === "professor" && styles.selectedRoleOptionText]}>
                                    Professor
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleOption, newUser.role === "admin" && styles.selectedRoleOption]}
                                onPress={() => setNewUser({ ...newUser, role: "admin" })}
                            >
                                <Text style={[styles.roleOptionText, newUser.role === "admin" && styles.selectedRoleOptionText]}>
                                    Admin
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {newUser.role === "professor" && (
                            <>
                                <Text style={styles.inputLabel}>Department</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter department"
                                    value={newUser.department}
                                    onChangeText={(text) => setNewUser({ ...newUser, department: text })}
                                />
                            </>
                        )}

                        {newUser.role === "student" && (
                            <>
                                <Text style={styles.inputLabel}>Program</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter program"
                                    value={newUser.program}
                                    onChangeText={(text) => setNewUser({ ...newUser, program: text })}
                                />

                                <Text style={styles.inputLabel}>Year</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter year (1-4)"
                                    keyboardType="numeric"
                                    value={newUser.year?.toString() || ""}
                                    onChangeText={(text) => setNewUser({ ...newUser, year: parseInt(text) || undefined })}
                                />
                            </>
                        )}

                        <TouchableOpacity style={styles.submitButton} onPress={handleAddUser} disabled={isLoading}>
                            {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Add User</Text>}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    // Add Course Modal
    const renderCourseModal = () => (
        <Modal
            visible={isCourseModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsCourseModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Course</Text>
                        <TouchableOpacity onPress={() => setIsCourseModalVisible(false)}>
                            <AntDesign name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <Text style={styles.inputLabel}>Course Name</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter course name"
                            value={newCourse.title}
                            onChangeText={(text) => setNewCourse({ ...newCourse, title: text })}
                        />

                        <Text style={styles.inputLabel}>Course Code</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter course code"
                            value={newCourse.code}
                            onChangeText={(text) => setNewCourse({ ...newCourse, code: text })}
                        />

                        <Text style={styles.inputLabel}>Department</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter department"
                            value={newCourse.department}
                            onChangeText={(text) => setNewCourse({ ...newCourse, department: text })}
                        />

                        <Text style={styles.inputLabel}>Professor</Text>
                        <View style={styles.pickerContainer}>
                            {professors.map((professor) => (
                                <TouchableOpacity
                                    key={professor._id}
                                    style={[
                                        styles.professorOption,
                                        newCourse.professorId === professor._id && styles.selectedProfessorOption,
                                    ]}
                                    onPress={() => setNewCourse({ ...newCourse, professorId: professor._id })}
                                >
                                    <Text
                                        style={[
                                            styles.professorOptionText,
                                            newCourse.professorId === professor._id && styles.selectedProfessorOptionText,
                                        ]}
                                    >
                                        {professor.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.inputLabel}>Credits</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter credits"
                            keyboardType="numeric"
                            value={newCourse.credits}
                            onChangeText={(text) => setNewCourse({ ...newCourse, credits: text })}
                        />

                        <TouchableOpacity style={styles.submitButton} onPress={handleAddCourse} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitButtonText}>Add Course</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    // Confirm Delete Modal
    const renderConfirmDeleteModal = () => (
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

            <StatusBar backgroundColor="#4169E1" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>EduConnect</Text>
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
                                <TouchableOpacity
                                    style={styles.profileMenuItem}
                                    onPress={handleLogout}
                                >
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

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("dashboard")}>
                    <FontAwesome5 name="th-large" size={20} color={activeTab === "dashboard" ? "#4169E1" : "#777"} />
                    <Text style={[styles.navText, activeTab === "dashboard" && styles.activeNavText]}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("users")}>
                    <FontAwesome5
                        name="users"
                        size={20}
                        color={activeTab === "users" || activeTab === "professors" || activeTab === "students" ? "#4169E1" : "#777"}
                    />
                    <Text
                        style={[
                            styles.navText,
                            (activeTab === "users" || activeTab === "professors" || activeTab === "students") && styles.activeNavText,
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

            {/* Modals */}
            {renderUserModal()}
            {renderCourseModal()}
            {renderConfirmDeleteModal()}
        </SafeAreaView>
    );
}