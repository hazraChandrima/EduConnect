import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import styles from "./styles/StudentDashboard.style";
import { useRouter } from "expo-router";
import AcademicAnalytics from "./components/AcademicAnalytics";
import { useWindowDimensions } from "react-native";
import { AuthContext } from "./context/AuthContext"; // Adjust the import path as needed

// Define TypeScript interface for user data
interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  __v: number;
}

const { width } = useWindowDimensions();
const isSmallDevice = width < 500;

export default function StudentDashboard(): React.ReactElement {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Default name for fallback
  const displayName = userData?.name || "Student";
  const firstName = displayName.split(" ")[0];

  useEffect(() => {
    const checkAuthAndFetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);

        // Check if user is logged in
        if (!auth?.user) {
          console.log("No authenticated user, redirecting to login");
          router.replace("/login");
          return;
        }

        // Check if user role is student
        if (auth.user.role !== "student") {
          console.log(`User role is ${auth.user.role}, not authorized for student dashboard`);
          router.replace(`/${auth.user.role}Dashboard`);// Redirect to an unauthorized page
          return;
        }

        // Fetch user data
        const response = await fetch(`http://192.168.224.247:3000/api/user/${auth.user.userId}`);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json() as UserData;
        if (data && data.name) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error in StudentDashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [auth, router]);

  // Show loading indicator while checking auth
  if (auth?.isLoading || isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#5c51f3" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Redirect if user is not authorized
  if (!auth?.user || auth.user.role !== "student" || !userData) {
    router.replace("/login");
    return <></>;
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4252e5" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>EduConnect</Text>
        <View style={styles.profileContainer}>
          <View style={styles.profilePic}>
            <Ionicons name="person" size={24} color="white" />
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>Hello, {firstName}!</Text>
          <Text style={styles.welcomeSubtitle}>
            Welcome back to your student dashboard
          </Text>

          <View
            style={[
              styles.statsContainer,
              isSmallDevice && { flexDirection: "column", alignItems: "center" },
            ]}
          >
            <View style={styles.statCard}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3.8</Text>
              <Text style={styles.statLabel}>GPA</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>75%</Text>
              <Text style={styles.statLabel}>Semester Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
          </View>
        </View>

        {/* Academic Analytics Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Academic Analytics</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <AcademicAnalytics />
        </View>

        {/* Courses Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Courses</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Course Items */}
          <View style={styles.courseItem}>
            <View style={[styles.courseIcon, { backgroundColor: "#52c4eb" }]}>
              <FontAwesome name="laptop" size={24} color="white" />
            </View>
            <View style={styles.courseDetails}>
              <Text style={styles.courseTitle}>Computer Science 101</Text>
              <View style={styles.professorContainer}>
                <Ionicons name="person" size={16} color="#777" />
                <Text style={styles.professorName}>Prof. Smith</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: "75%" }]} />
              </View>
            </View>
          </View>

          <View style={styles.courseItem}>
            <View style={[styles.courseIcon, { backgroundColor: "#ff5694" }]}>
              <FontAwesome name="calculator" size={24} color="white" />
            </View>
            <View style={styles.courseDetails}>
              <Text style={styles.courseTitle}>Mathematics 202</Text>
              <View style={styles.professorContainer}>
                <Ionicons name="person" size={16} color="#777" />
                <Text style={styles.professorName}>Prof. Johnson</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: "60%" }]} />
              </View>
            </View>
          </View>

          <View style={styles.courseItem}>
            <View style={[styles.courseIcon, { backgroundColor: "#5c51f3" }]}>
              <Ionicons name="settings" size={24} color="white" />
            </View>
            <View style={styles.courseDetails}>
              <Text style={styles.courseTitle}>Physics 101</Text>
              <View style={styles.professorContainer}>
                <Ionicons name="person" size={16} color="#777" />
                <Text style={styles.professorName}>Prof. Williams</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: "45%" }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Assignments Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Assignment Items */}
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <View style={[styles.courseTag, { backgroundColor: "#52c4eb" }]}>
                <Text style={styles.courseTagText}>CS 101</Text>
              </View>
              <Text style={styles.assignmentDueDate}>Due: Tomorrow</Text>
            </View>
            <Text style={styles.assignmentTitle}>
              Algorithm Analysis Report
            </Text>
            <Text style={styles.assignmentDescription}>
              Submit a report analyzing the time and space complexity of the
              algorithms discussed in class.
            </Text>
            <View style={styles.assignmentFooter}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending</Text>
              </View>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/assignmentSubmission")}
              >
                <Text style={styles.actionButtonText}>Submit Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <View style={[styles.courseTag, { backgroundColor: "#ff5694" }]}>
                <Text style={styles.courseTagText}>MATH 202</Text>
              </View>
              <Text style={styles.assignmentDueDate}>Due: 3 days</Text>
            </View>
            <Text style={styles.assignmentTitle}>Calculus Problem Set</Text>
            <Text style={styles.assignmentDescription}>
              Complete problems 1-15 from Chapter 4 of the textbook.
            </Text>
            <View style={styles.assignmentFooter}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending</Text>
              </View>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/assignmentSubmission")}
              >
                <Text style={styles.actionButtonText}>Start Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Chatbot Floating Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          bottom: 80, // Positioned above the navigation bar
          backgroundColor: "#5c51f3",
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={() => router.push("/chatbotScreen")}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>

      {/* Navigation Bar with Logout Button */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#5c51f3" />
          <Text style={[styles.navText, styles.navActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="menu-book" size={24} color="#777" />
          <Text style={styles.navText}>Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="assignment" size={24} color="#777" />
          <Text style={styles.navText}>Assignments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="date-range" size={24} color="#777" />
          <Text style={styles.navText}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            auth?.logout().then(() => router.replace("/login"));
          }}
        >
          <Ionicons name="log-out" size={24} color="#777" />
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}