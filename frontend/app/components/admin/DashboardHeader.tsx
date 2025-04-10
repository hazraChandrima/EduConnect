import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/AdminDashboard.style";

interface DashboardHeaderProps {
    studentsCount: number;
    professorsCount: number;
    coursesCount: number;
}

export default function DashboardHeader({ studentsCount, professorsCount, coursesCount }: DashboardHeaderProps) {
    return (
        <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>Admin Dashboard</Text>
            <Text style={styles.dashboardSubtitle}>System overview and management</Text>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{studentsCount}</Text>
                    <Text style={styles.statLabel}>Students</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{professorsCount}</Text>
                    <Text style={styles.statLabel}>Professors</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{coursesCount}</Text>
                    <Text style={styles.statLabel}>Courses</Text>
                </View>
            </View>
        </View>
    );
}