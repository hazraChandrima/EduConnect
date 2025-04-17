import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../../../styles/StudentDashboard.style"

interface StudentHeaderProps {
    activeTab: string
    displayName: string
    isProfileMenuVisible: boolean
    setIsProfileMenuVisible: (visible: boolean) => void
    handleLogout: () => void
    isSidebarCollapsed?: boolean
    isMobile?: boolean
}

export default function StudentHeader({
    activeTab,
    displayName,
    isProfileMenuVisible,
    setIsProfileMenuVisible,
    handleLogout,
    isSidebarCollapsed,
    isMobile,
}: StudentHeaderProps) {
    return isMobile ? (
        // Mobile Header
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text style={styles.logo}>EduConnect</Text>
            </View>
            <View style={styles.profileContainer}>
                <TouchableOpacity style={styles.profileButton} onPress={() => setIsProfileMenuVisible(!isProfileMenuVisible)}>
                    <View style={styles.profilePic}>
                        <Ionicons name="person" size={24} color="white" />
                    </View>
                    <Text style={styles.profileName}>{displayName}</Text>
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
    ) : (
        // Desktop Header
        <View style={[styles.desktopHeader, isSidebarCollapsed && styles.desktopHeaderWithCollapsedSidebar]}>
            <View style={styles.headerTitle}>
                <Text style={styles.headerTitleText}>
                    {activeTab === "home"
                        ? "Dashboard"
                        : activeTab === "courses"
                            ? "Your Courses"
                            : activeTab === "assignments"
                                ? "Your Assignments"
                                : "Your Attendance"}
                </Text>
            </View>

            <View style={styles.profileContainer}>
                <TouchableOpacity style={styles.profileButton} onPress={() => setIsProfileMenuVisible(!isProfileMenuVisible)}>
                    <View style={styles.profilePic}>
                        <Ionicons name="person" size={24} color="white" />
                    </View>
                    <Text style={styles.profileName}>{displayName}</Text>
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
    )
}
