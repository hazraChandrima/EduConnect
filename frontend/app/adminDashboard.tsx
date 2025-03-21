import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import styles from "./styles/AdminDashboard.style";


export default function AdminDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4169E1" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EduConnect</Text>
        <View style={styles.adminBadge}>
          <FontAwesome5 name="user-circle" size={24} color="white" />
          <Text style={styles.adminText}>Admin</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Dashboard Header */}
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardTitle}>Admin Dashboard</Text>
          <Text style={styles.dashboardSubtitle}>
            System overview and management
          </Text>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Professors</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
          </View>
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
            <TouchableOpacity style={styles.actionCard}>
              <FontAwesome5 name="user-plus" size={24} color="#4169E1" />
              <Text style={styles.actionText}>Add User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
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
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="th-large" size={20} color="#4169E1" />
          <Text style={[styles.navText, styles.activeNavText]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="users" size={20} color="#777" />
          <Text style={styles.navText}>Users</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={20} color="#777" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="analytics" size={20} color="#777" />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
