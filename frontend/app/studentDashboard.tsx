import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import styles from "./styles/StudentDashboard.styles";
import { useRouter } from "expo-router";


export default function StudentDashboard() {
  const router = useRouter();


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
          <Text style={styles.profileName}>John Doe</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>Hello, John!</Text>
          <Text style={styles.welcomeSubtitle}>
            Welcome back to your student dashboard
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3.8</Text>
              <Text style={styles.statLabel}>GPA</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
          </View>
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
              <TouchableOpacity style={styles.actionButton}>
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
              <TouchableOpacity style={styles.actionButton}>
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

      {/* Navigation Bar */}
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
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#777" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
