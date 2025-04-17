import { View, Text } from "react-native"
import styles from "../../../styles/StudentDashboard.style"
import AttendanceOverview from "../attendance/AttendanceOverview"

interface AttendanceTabProps {
    userId: string
}

export default function AttendanceTab({ userId }: AttendanceTabProps) {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Your Attendance</Text>

            {/* This component was already in your original code */}
            <AttendanceOverview userId={userId} />
        </View>
    )
}
