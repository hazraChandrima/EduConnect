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
import styles from "./styles/ProfessorDahsboard.styles";



export default function ProfessorDashboard() {

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
          <Text style={styles.profileName}>Dr. Smith</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>Hello, Dr. Smith!</Text>
          <Text style={styles.welcomeSubtitle}>
            Welcome back to your professor dashboard
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>78</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Courses</Text>
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
              <View style={styles.studentsContainer}>
                <Ionicons name="people" size={16} color="#777" />
                <Text style={styles.studentsText}>32 Students</Text>
              </View>
            </View>
          </View>

          <View style={styles.courseItem}>
            <View style={[styles.courseIcon, { backgroundColor: "#ff5694" }]}>
              <FontAwesome name="code" size={24} color="white" />
            </View>
            <View style={styles.courseDetails}>
              <Text style={styles.courseTitle}>Advanced Programming</Text>
              <View style={styles.studentsContainer}>
                <Ionicons name="people" size={16} color="#777" />
                <Text style={styles.studentsText}>24 Students</Text>
              </View>
            </View>
          </View>

          <View style={styles.courseItem}>
            <View style={[styles.courseIcon, { backgroundColor: "#5c51f3" }]}>
              <FontAwesome name="database" size={24} color="white" />
            </View>
            <View style={styles.courseDetails}>
              <Text style={styles.courseTitle}>Database Systems</Text>
              <View style={styles.studentsContainer}>
                <Ionicons name="people" size={16} color="#777" />
                <Text style={styles.studentsText}>22 Students</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pending Assignments Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Assignments</Text>
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
              <Text style={styles.submissionsText}>12 Submissions</Text>
            </View>
            <Text style={styles.assignmentTitle}>
              Algorithm Analysis Report
            </Text>
            <Text style={styles.assignmentDescription}>
              Students submitted reports analyzing the time and space complexity
              of algorithms.
            </Text>
            <View style={styles.assignmentFooter}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Needs Grading</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Grade Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <View style={[styles.courseTag, { backgroundColor: "#ff5694" }]}>
                <Text style={styles.courseTagText}>ADV PROG</Text>
              </View>
              <Text style={styles.submissionsText}>8 Submissions</Text>
            </View>
            <Text style={styles.assignmentTitle}>Final Project</Text>
            <Text style={styles.assignmentDescription}>
              Students submitted their final programming projects with
              documentation.
            </Text>
            <View style={styles.assignmentFooter}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Needs Grading</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Grade Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#5c51f3" />
          <Text style={[styles.navText, styles.navActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="date-range" size={24} color="#777" />
          <Text style={styles.navText}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="grading" size={24} color="#777" />
          <Text style={styles.navText}>Grading</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="people" size={24} color="#777" />
          <Text style={styles.navText}>Students</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}