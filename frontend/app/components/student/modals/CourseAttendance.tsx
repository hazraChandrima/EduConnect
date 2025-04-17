import { View, Text } from "react-native"
import styles from "../../../styles/StudentDashboard.style"

interface CourseAttendanceProps {
    courseId: string
    attendance: any[]
}

export default function CourseAttendance({ courseId, attendance }: CourseAttendanceProps) {
    const calculateAttendancePercentage = (): number => {
        if (attendance.length === 0) return 0
        const presentCount = attendance.filter((a) => a.status === "present" || a.status === "excused").length
        return Math.round((presentCount / attendance.length) * 100)
    }

    return (
        <View style={styles.attendanceContainer}>
            <View style={styles.attendanceSummary}>
                <View style={styles.attendanceChart}>
                    <View style={styles.attendancePercentage}>
                        <Text style={styles.attendancePercentageText}>{calculateAttendancePercentage()}%</Text>
                    </View>
                </View>
                <View style={styles.attendanceStats}>
                    <View style={styles.attendanceStat}>
                        <View style={[styles.attendanceIndicator, { backgroundColor: "#4CAF50" }]} />
                        <Text style={styles.attendanceStatText}>Present</Text>
                    </View>
                    <View style={styles.attendanceStat}>
                        <View style={[styles.attendanceIndicator, { backgroundColor: "#FFC107" }]} />
                        <Text style={styles.attendanceStatText}>Excused</Text>
                    </View>
                    <View style={styles.attendanceStat}>
                        <View style={[styles.attendanceIndicator, { backgroundColor: "#F44336" }]} />
                        <Text style={styles.attendanceStatText}>Absent</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.attendanceHistoryTitle}>Attendance History</Text>
            {attendance
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((a) => (
                    <View key={a._id} style={styles.attendanceRecord}>
                        <View style={styles.attendanceDate}>
                            <Text style={styles.attendanceDateText}>
                                {new Date(a.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.attendanceStatus,
                                a.status === "present"
                                    ? styles.statusPresent
                                    : a.status === "excused"
                                        ? styles.statusExcused
                                        : styles.statusAbsent,
                            ]}
                        >
                            <Text style={styles.attendanceStatusText}>{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</Text>
                        </View>
                    </View>
                ))}
        </View>
    )
}
