import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import styles from "../../../styles/StudentDashboard.style"

interface StudentSidebarProps {
    activeTab: string
    setActiveTab: (tab: "home" | "courses" | "assignments" | "attendance") => void
    isSidebarCollapsed: boolean
    setIsSidebarCollapsed: (collapsed: boolean) => void
    handleLogout: () => void
    isDesktop: boolean
    isMobile: boolean
}

export default function StudentSidebar({
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    handleLogout,
    isDesktop,
    isMobile,
}: StudentSidebarProps) {
    return (
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
                        <Text style={[styles.sidebarItemText, activeTab === "home" && styles.sidebarItemTextActive]}>Home</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.sidebarItem, activeTab === "courses" && styles.sidebarItemActive]}
                    onPress={() => setActiveTab("courses")}
                >
                    <MaterialIcons name="menu-book" size={24} color={activeTab === "courses" ? "#a9a4ff" : "#b2bfd9"} />
                    {!isSidebarCollapsed && (
                        <Text style={[styles.sidebarItemText, activeTab === "courses" && styles.sidebarItemTextActive]}>
                            Courses
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.sidebarItem, activeTab === "assignments" && styles.sidebarItemActive]}
                    onPress={() => setActiveTab("assignments")}
                >
                    <MaterialIcons name="assignment" size={24} color={activeTab === "assignments" ? "#a9a4ff" : "#b2bfd9"} />
                    {!isSidebarCollapsed && (
                        <Text style={[styles.sidebarItemText, activeTab === "assignments" && styles.sidebarItemTextActive]}>
                            Assignments
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
            </View>

            <TouchableOpacity style={styles.sidebarLogout} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#b2bfd9" />
                {!isSidebarCollapsed && <Text style={styles.sidebarLogoutText}>Logout</Text>}
            </TouchableOpacity>
        </View>
    )
}
