"use client"

import type React from "react"
import { useState, useEffect, useContext } from "react"
import { View, Text, SafeAreaView, StatusBar, ActivityIndicator, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from "@react-native-async-storage/async-storage"

import styles from "@/app//styles/StudentDashboard.style"
import { AuthContext } from "@/app//context/AuthContext"
import { useToken } from "@/app//hooks/useToken"
import { useStudentData } from "@/app//hooks/useStudentData"
import { useIsSmallDevice } from "@/app//hooks/useResponsive"

// Components
import StudentHeader from "./student/layout/StudentHeader"
import StudentSidebar from "./student/layout/StudentSidebar"
import StudentNavBar from "./student/layout/StudentNavBar"
import HomeTab from "./student/tabs/HomeTab"
import CoursesTab from "./student/tabs/CoursesTab"
import AssignmentsTab from "./student/tabs/AssignmentsTab"
import AttendanceTab from "./student/tabs/AttendanceTab"
import CourseModal from "./student/modals/CourseModal"
import SubmissionModal from "./student/modals/SubmissionModal"
import ChatbotButton from "./common/ChatbotButton"
import OfflineNotice from "./common/OfflineNotice"

export default function StudentDashboard({ userId }: { userId: string }): React.ReactElement {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const { token } = useToken()
  const isSmallDevice = useIsSmallDevice()

  // State
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"home" | "courses" | "assignments" | "attendance">("home")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(!isSmallDevice)
  const [isOffline, setIsOffline] = useState(false)

  // Modal states
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false)
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)

  // Custom hook for fetching and managing student data
  const { userData, courses, assignments, attendance, courseAttendance, marks, remarks, curriculum, gpa, fetchData } =
    useStudentData(userId, token)

  const [assignmentsState, setAssignments] = useState(assignments)

  // Responsive layout helpers
  const { width } = useIsSmallDevice()
  const isDesktop = width >= 1024
  const isTablet = width >= 768 && width < 1024
  const isMobile = width < 768

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected)
    })
    return () => unsubscribe()
  }, [])

  // Update sidebar visibility when screen size changes
  useEffect(() => {
    setSidebarOpen(!isSmallDevice)
  }, [isSmallDevice])

  // Authentication and data fetching
  useEffect(() => {
    const checkAuthAndFetchData = async (): Promise<void> => {
      try {
        setIsLoading(true)

        if (!auth?.user) {
          console.log("No authenticated user, redirecting to login")
          router.replace("/login")
          return
        }

        if (auth.user.role !== "student") {
          console.log(`User role is ${auth.user.role}, not authorized for student dashboard`)
          router.replace(`/${auth.user.role}/${auth.user.userId}` as never)
          return
        }

        await fetchData()
      } catch (error) {
        console.error("Error in StudentDashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [auth, router, userId, token])

  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout().then(() => router.replace("/login"))
    }
  }

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course)
    setIsCourseModalVisible(true)
  }

  function handleAssignmentSelect(assignment: any) {
    setSelectedAssignment(assignment)
    setIsSubmissionModalVisible(true)
  }

  const updateAssignmentStatus = (assignmentId: string, newStatus: string, submissionUrl?: string) => {
    const updatedAssignments = assignments.map((assignment) =>
      assignment._id === assignmentId
        ? { ...assignment, status: newStatus, submissionUrl: submissionUrl || assignment.submissionUrl }
        : assignment,
    )

    setAssignments(updatedAssignments)

    // Update in AsyncStorage for offline access
    AsyncStorage.setItem("studentDashboardAssignments", JSON.stringify(updatedAssignments))
  }

  if (auth?.isLoading || isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#5c51f3" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </SafeAreaView>
    )
  }

  if (!auth?.user || auth.user.role !== "student" || !userData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#5c51f3" />
        <Text style={{ marginTop: 10 }}>Redirecting...</Text>
      </SafeAreaView>
    )
  }

  const displayName = userData?.name || "Student"
  const firstName = displayName.split(" ")[0]

  return (
    <SafeAreaView style={[styles.container, isDesktop && styles.desktopContainer]}>
      {isOffline && <OfflineNotice />}

      <StatusBar backgroundColor="#4252e5" barStyle="light-content" />

      {/* Desktop Layout */}
      {isDesktop ? (
        <View style={styles.desktopLayout}>
          {/* Header */}
          <StudentHeader
            activeTab={activeTab}
            displayName={displayName}
            isProfileMenuVisible={isProfileMenuVisible}
            setIsProfileMenuVisible={setIsProfileMenuVisible}
            handleLogout={handleLogout}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          <View style={styles.contentContainer}>
            {/* Sidebar */}
            <StudentSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
              handleLogout={handleLogout}
              isDesktop={isDesktop}
              isMobile={isMobile}
            />

            {/* Main Content */}
            <View
              style={[
                styles.mainContent,
                isSidebarCollapsed ? styles.mainContentWithCollapsedSidebar : styles.mainContentWithSidebar,
              ]}
            >
              <ScrollView style={styles.desktopScrollView}>
                {activeTab === "home" && (
                  <HomeTab
                    firstName={firstName}
                    courses={courses}
                    assignments={assignments}
                    attendance={attendance}
                    gpa={gpa}
                    userId={userId}
                    handleCourseSelect={handleCourseSelect}
                    handleAssignmentSelect={handleAssignmentSelect}
                    isDesktop={isDesktop}
                    isSmallDevice={isSmallDevice}
                  />
                )}
                {activeTab === "courses" && (
                  <CoursesTab
                    courses={courses}
                    marks={marks}
                    attendance={attendance}
                    courseAttendance={courseAttendance}
                    handleCourseSelect={handleCourseSelect}
                    isDesktop={isDesktop}
                  />
                )}
                {activeTab === "assignments" && (
                  <AssignmentsTab
                    assignments={assignments}
                    handleAssignmentSelect={handleAssignmentSelect}
                    isDesktop={isDesktop}
                  />
                )}
                {activeTab === "attendance" && <AttendanceTab userId={auth?.user?.userId || ""} />}
              </ScrollView>

              <ChatbotButton onPress={() => router.push("/chatbotScreen")} />
            </View>
          </View>
        </View>
      ) : (
        // Mobile Layout
        <>
          {/* Header */}
          <StudentHeader
            activeTab={activeTab}
            displayName={displayName}
            isProfileMenuVisible={isProfileMenuVisible}
            setIsProfileMenuVisible={setIsProfileMenuVisible}
            handleLogout={handleLogout}
            isMobile={true}
          />

          <ScrollView style={styles.scrollView}>
            {activeTab === "home" && (
              <HomeTab
                firstName={firstName}
                courses={courses}
                assignments={assignments}
                attendance={attendance}
                gpa={gpa}
                userId={userId}
                handleCourseSelect={handleCourseSelect}
                handleAssignmentSelect={handleAssignmentSelect}
                isDesktop={false}
                isSmallDevice={isSmallDevice}
              />
            )}
            {activeTab === "courses" && (
              <CoursesTab
                courses={courses}
                marks={marks}
                attendance={attendance}
                courseAttendance={courseAttendance}
                handleCourseSelect={handleCourseSelect}
                isDesktop={false}
              />
            )}
            {activeTab === "assignments" && (
              <AssignmentsTab
                assignments={assignments}
                handleAssignmentSelect={handleAssignmentSelect}
                isDesktop={false}
              />
            )}
            {activeTab === "attendance" && <AttendanceTab userId={auth?.user?.userId || ""} />}
          </ScrollView>

          <ChatbotButton onPress={() => router.push("/chatbotScreen")} />

          {/* Navigation Bar */}
          <StudentNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}

      {/* Modals */}
      <CourseModal
        isVisible={isCourseModalVisible}
        setIsVisible={setIsCourseModalVisible}
        course={selectedCourse}
        curriculum={curriculum}
        courseAttendance={courseAttendance}
        marks={marks}
        remarks={remarks}
        isDesktop={isDesktop}
        studentId={userId}
      />

      <SubmissionModal
        isVisible={isSubmissionModalVisible}
        setIsVisible={setIsSubmissionModalVisible}
        assignment={selectedAssignment}
        token={token}
        userId={userId}
        onSubmitSuccess={(updatedAssignment) => {
          updateAssignmentStatus(updatedAssignment._id, updatedAssignment.status, updatedAssignment.submissionUrl)
        }}
        isDesktop={isDesktop}
      />
    </SafeAreaView>
  )
}
