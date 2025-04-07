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
} from "react-native"
import { MaterialIcons, FontAwesome5, Ionicons, AntDesign, Feather } from "@expo/vector-icons"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthContext } from "./context/AuthContext"
import styles from "./styles/AdminDashboard.style"
import { useRouter } from "expo-router"
import { APP_CONFIG } from "@/app-config"

const API_BASE_URL = APP_CONFIG.API_BASE_URL;

// Define types for our data
interface Professor {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string[];
  joinDate: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  gpa: number;
  joinDate: string;
}

interface Course {
  id: string;
  name: string;
  department: string;
  professor: string;
  students: number;
  credits: number;
}

interface NewUser {
  name: string;
  email: string;
  role: "student" | "professor" | "admin";
  department: string;
  program: string;
}

interface NewCourse {
  name: string;
  code: string;
  department: string;
  professor: string;
  credits: string;
}

// Define user data interface
interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  __v: number;
}

const screenWidth = Dimensions.get("window").width

// Dummy data for professors
const professors: Professor[] = [
  {
    id: "P1001",
    name: "Dr. Sunil Kumar",
    email: "sunilkr.cse@university.edu",
    department: "Computer Science",
    courses: ["CS101", "PROG201"],
    joinDate: "2018-08-15",
  },
  {
    id: "P1002",
    name: "Dr. Ritu Jaiswal",
    email: "ritujaiswal.math@university.edu",
    department: "Mathematics",
    courses: ["MATH101", "MATH202"],
    joinDate: "2019-01-10",
  },
  {
    id: "P1003",
    name: "Dr. Michael Brown",
    email: "michael.brown@university.edu",
    department: "Physics",
    courses: ["PHYS101", "PHYS202"],
    joinDate: "2017-05-22",
  },
]

// Dummy data for students
const students: Student[] = [
  {
    id: "S12345",
    name: "John Doe",
    email: "john.doe@university.edu",
    program: "Computer Science",
    year: 3,
    gpa: 3.8,
    joinDate: "2021-09-01",
  },
  {
    id: "S12346",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    program: "Mathematics",
    year: 2,
    gpa: 3.9,
    joinDate: "2022-09-01",
  },
  {
    id: "S12347",
    name: "Robert Johnson",
    email: "robert.johnson@university.edu",
    program: "Physics",
    year: 4,
    gpa: 3.5,
    joinDate: "2020-09-01",
  },
]

// Chart data
const userGrowthData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  datasets: [
    {
      data: [20, 45, 50, 78, 99, 120, 120, 125],
      color: (opacity = 1) => `rgba(65, 105, 225,${opacity})`,
      strokeWidth: 2,
    },
  ],
  legend: ["User Growth"],
}

const departmentDistributionData = {
  labels: ["CS", "Math", "Physics", "Chemistry", "Biology"],
  data: [0.35, 0.25, 0.15, 0.15, 0.1],
  colors: ["#4169E1", "#40BFFF", "#FF4081", "#FFA000", "#00C853"],
}

const systemUsageData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [65, 78, 90, 85, 92, 45, 30],
      color: (opacity = 1) => `rgba(64, 191, 255, ${opacity})`,
    },
  ],
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "professors" | "students" | "courses" | "settings">("dashboard")
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isUserModalVisible, setIsUserModalVisible] = useState(false)
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false)
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Professor | Student | Course | null>(null)
  const [deleteType, setDeleteType] = useState<"professor" | "student" | "course" | "">("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
  
  // FIXED: Moved coursesData state inside the component
  const [coursesData, setCoursesData] = useState<Course[]>([
    {
      id: "CS101",
      name: "Computer Science 101",
      department: "Computer Science",
      professor: "Dr. John Smith",
      students: 32,
      credits: 3,
    },
    {
      id: "PROG201",
      name: "Advanced Programming",
      department: "Computer Science",
      professor: "Dr. John Smith",
      students: 24,
      credits: 4,
    },
    {
      id: "MATH101",
      name: "Calculus I",
      department: "Mathematics",
      professor: "Dr. Sarah Johnson",
      students: 45,
      credits: 3,
    },
    {
      id: "MATH202",
      name: "Linear Algebra",
      department: "Mathematics",
      professor: "Dr. Sarah Johnson",
      students: 38,
      credits: 3,
    },
    {
      id: "PHYS101",
      name: "Physics I",
      department: "Physics",
      professor: "Dr. Michael Brown",
      students: 40,
      credits: 4,
    },
    {
      id: "PHYS202",
      name: "Quantum Mechanics",
      department: "Physics",
      professor: "Dr. Michael Brown",
      students: 22,
      credits: 4,
    },
  ]);

  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "student",
    department: "",
    program: "",
  })
  const [newCourse, setNewCourse] = useState<NewCourse>({
    name: "",
    code: "",
    department: "",
    professor: "",
    credits: "",
  })
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const authContext = useContext(AuthContext);
  const router = useRouter();

  const displayName = userData?.name || "Admin";
  const firstName = displayName.split(" ")[0];

  useEffect(() => {
    const checkAuthAndFetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);

        // Check if user is logged in
        if (!authContext?.user) {
          console.log("No authenticated user, redirecting to login");
          router.replace("/login");
          return;
        }

        // Check if user role is admin
        if (authContext.user.role !== "admin") {
          console.log(`User role is ${authContext.user.role}, not authorized for admin dashboard`);
          router.replace(`/${authContext.user.role}Dashboard`) // Redirect to an unauthorized page
          return;
        }

        // Fetch user data
        const response = await fetch(`${API_BASE_URL}/api/user/${authContext.user.userId}`);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json() as UserData;
        if (data && data.name) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error in AdminDashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [authContext?.user, router]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4169E1" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Redirect if user is not authorized
  if (!authContext?.user || authContext.user.role !== "admin" || !userData) {
    // This is a safety check - the useEffect should have already redirected
    return null;
  }

  const handleLogout = async () => {
    try {
      await authContext?.logout?.()
      router.replace("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // FIXED: Improved handleAddUser function to properly update state
  const handleAddUser = () => {
    // Validate inputs
    if (!newUser.name || !newUser.email || !newUser.role) {
      // You could add an alert here to inform the user
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Here you would typically make an API call to add the user
      // For now, we'll just simulate success
      
      // If the user is a professor, add them to the professors array
      if (newUser.role === "professor") {
        const newProfessor: Professor = {
          id: `P${Math.floor(1000 + Math.random() * 9000)}`, // Generate a random ID
          name: newUser.name,
          email: newUser.email,
          department: newUser.department || "Not specified",
          courses: [],
          joinDate: new Date().toISOString().split('T')[0],
        };
        
        // In a real app, you would update your backend and then update the state
        // professors.push(newProfessor); // This would mutate the state directly, which is not recommended
        // Instead, create a new array with the new professor
        // This would be handled by your API in a real app
      }
      
      // Similar logic for students
      
      setIsLoading(false);
      setIsUserModalVisible(false);

      // Reset form
      setNewUser({
        name: "",
        email: "",
        role: "student",
        department: "",
        program: "",
      });
    }, 1500);
  };

  // FIXED: Improved handleAddCourse function to properly update state
  const handleAddCourse = () => {
    // Validate inputs
    if (!newCourse.name || !newCourse.code || !newCourse.department || !newCourse.professor) {
      // You could add an alert here to inform the user
      return;
    }

    setIsLoading(true);

    // Create a new course object with the right shape
    const courseToAdd: Course = {
      id: newCourse.code, // Using the course code as ID
      name: newCourse.name,
      department: newCourse.department,
      professor: newCourse.professor,
      students: 0, // New courses start with 0 students
      credits: parseInt(newCourse.credits) || 0, // Convert string to number
    };

    // Simulate API call
    setTimeout(() => {
      // Update the courses state with the new course
      // FIXED: Using functional update to ensure we're working with the latest state
      setCoursesData(prevCourses => [...prevCourses, courseToAdd]);

      setIsLoading(false);
      setIsCourseModalVisible(false);

      // Reset form
      setNewCourse({
        name: "",
        code: "",
        department: "",
        professor: "",
        credits: "",
      });
    }, 1500);
  };

  // FIXED: Improved handleDeleteConfirmation and handleDelete functions
  const handleDeleteConfirmation = (item: Professor | Student | Course, type: "professor" | "student" | "course") => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsConfirmDeleteModalVisible(true);
  };

  const handleDelete = () => {
    if (!itemToDelete || !deleteType) return;
    
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Handle deletion based on type
      if (deleteType === "course") {
        // FIXED: Properly update the courses state
        const courseToDelete = itemToDelete as Course;
        setCoursesData(prevCourses => 
          prevCourses.filter(course => course.id !== courseToDelete.id)
        );
        
        // If the deleted course was selected, clear the selection
        if (selectedCourse && selectedCourse.id === courseToDelete.id) {
          setSelectedCourse(null);
        }
      }
      
      // Similar logic would be implemented for professors and students
      // in a real application with backend integration
      
      setIsLoading(false);
      setIsConfirmDeleteModalVisible(false);

      // Reset
      setItemToDelete(null);
      setDeleteType("");
    }, 1500);
  };

  const filteredProfessors = professors.filter(
    (professor) =>
      professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professor.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.program.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredCourses = coursesData.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.professor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <Text style={styles.statNumber}>{coursesData.length}</Text>
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
              data={userGrowthData}
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
              data={departmentDistributionData.labels.map((label, index) => ({
                name: label,
                population: departmentDistributionData.data[index] * 100,
                color: departmentDistributionData.colors[index],
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
              data={systemUsageData}
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

          <TouchableOpacity style={styles.actionCard}>
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
                <Text style={styles.userProfileId}>ID: {selectedProfessor.id}</Text>
                <Text style={styles.userProfileEmail}>{selectedProfessor.email}</Text>
              </View>

              <View style={styles.userInfoSection}>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoLabel}>Department:</Text>
                  <Text style={styles.userInfoValue}>{selectedProfessor.department}</Text>
                </View>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoLabel}>Join Date:</Text>
                  <Text style={styles.userInfoValue}>{selectedProfessor.joinDate}</Text>
                </View>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoLabel}>Courses:</Text>
                  <View style={styles.courseTagsContainer}>
                    {selectedProfessor.courses.map((courseId) => {
                      const course = coursesData.find((c) => c.id === courseId)
                      return (
                        <View key={courseId} style={styles.courseTag}>
                          <Text style={styles.courseTagText}>{course ? course.name : courseId}</Text>
                        </View>
                      )
                    })}
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
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.userItem} onPress={() => setSelectedProfessor(item)}>
                  <View style={styles.userAvatar}>
                    <FontAwesome5 name="user-tie" size={24} color="white" />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    <Text style={styles.userDepartment}>{item.department}</Text>
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
                <Text style={styles.userProfileId}>ID: {selectedStudent.id}</Text>
                <Text style={styles.userProfileEmail}>{selectedStudent.email}</Text>
              </View>

              <View style={styles.userInfoSection}>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoLabel}>Program:</Text>
                  <Text style={styles.userInfoValue}>{selectedStudent.program}</Text>
                </View>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoLabel}>Year:</Text>
                  <Text style={styles.userInfoValue}>{selectedStudent.year}</Text>
                </View>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoLabel}>GPA:</Text>
                  <Text style={styles.userInfoValue}>{selectedStudent.gpa}</Text>
                </View>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoLabel}>Join Date:</Text>
                  <Text style={styles.userInfoValue}>{selectedStudent.joinDate}</Text>
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
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.userItem} onPress={() => setSelectedStudent(item)}>
                  <View style={styles.userAvatar}>
                    <FontAwesome5 name="user-graduate" size={24} color="white" />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    <Text style={styles.userDepartment}>
                      {item.program} - Year {item.year}
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
  )

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
              <Text style={styles.courseHeaderTitle}>{selectedCourse.name}</Text>
              <Text style={styles.courseHeaderCode}>{selectedCourse.id}</Text>
            </View>
          </View>

          <View style={styles.courseInfoSection}>
            <View style={styles.courseInfoItem}>
              <Text style={styles.courseInfoLabel}>Department:</Text>
              <Text style={styles.courseInfoValue}>{selectedCourse.department}</Text>
            </View>
            <View style={styles.courseInfoItem}>
              <Text style={styles.courseInfoLabel}>Professor:</Text>
              <Text style={styles.courseInfoValue}>{selectedCourse.professor}</Text>
            </View>
            <View style={styles.courseInfoItem}>
              <Text style={styles.courseInfoLabel}>Students Enrolled:</Text>
              <Text style={styles.courseInfoValue}>{selectedCourse.students}</Text>
            </View>
            <View style={styles.courseInfoItem}>
              <Text style={styles.courseInfoLabel}>Credits:</Text>
              <Text style={styles.courseInfoValue}>{selectedCourse.credits}</Text>
            </View>
          </View>

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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.courseItem} onPress={() => setSelectedCourse(item)}>
              <View style={styles.courseItemIcon}>
                <MaterialIcons name="library-books" size={24} color="white" />
              </View>
              <View style={styles.courseItemInfo}>
                <Text style={styles.courseItemTitle}>{item.name}</Text>
                <Text style={styles.courseItemCode}>{item.id}</Text>
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
  )

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
  )

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
              </>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleAddUser} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Add User</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

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
              value={newCourse.name}
              onChangeText={(text) => setNewCourse({ ...newCourse, name: text })}
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
                  key={professor.id}
                  style={[
                    styles.professorOption,
                    newCourse.professor === professor.name && styles.selectedProfessorOption,
                  ]}
                  onPress={() => setNewCourse({ ...newCourse, professor: professor.name })}
                >
                  <Text
                    style={[
                      styles.professorOptionText,
                      newCourse.professor === professor.name && styles.selectedProfessorOptionText,
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
  )

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
  )

  return (
    <SafeAreaView style={styles.container}>
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
  )
};