import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import styles from "../../../styles/StudentDashboard.style"

interface StudentNavBarProps {
    activeTab: string
    setActiveTab: (tab: "home" | "courses" | "assignments" | "attendance") => void
}

export default function StudentNavBar({ activeTab, setActiveTab }: StudentNavBarProps) {
    return (
        <View style={styles.navigationBar}>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
                <Ionicons name="home" size={24} color={activeTab === "home" ? "#5c51f3" : "#777"} />
                <Text style={[styles.navText, activeTab === "home" && styles.navActive]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("courses")}>
                <MaterialIcons name="menu-book" size={24} color={activeTab === "courses" ? "#5c51f3" : "#777"} />
                <Text style={[styles.navText, activeTab === "courses" && styles.navActive]}>Courses</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("assignments")}>
                <MaterialIcons name="assignment" size={24} color={activeTab === "assignments" ? "#5c51f3" : "#777"} />
                <Text style={[styles.navText, activeTab === "assignments" && styles.navActive]}>Assignments</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("attendance")}>
                <MaterialIcons name="date-range" size={24} color={activeTab === "attendance" ? "#5c51f3" : "#777"} />
                <Text style={[styles.navText, activeTab === "attendance" && styles.navActive]}>Attendance</Text>
            </TouchableOpacity>
        </View>
    )
}
