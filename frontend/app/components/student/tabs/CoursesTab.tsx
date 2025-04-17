import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"
import styles from "../../../styles/StudentDashboard.style"

interface CoursesTabProps {
    courses: any[]
    marks: any[]
    attendance: any[]
    courseAttendance: { [courseId: string]: any[] }
    handleCourseSelect: (course: any) => void
    isDesktop: boolean
}

export default function CoursesTab({
    courses,
    marks,
    attendance,
    courseAttendance,
    handleCourseSelect,
    isDesktop,
}: CoursesTabProps) {
    // Helper functions
    const calculateAttendancePercentage = (courseId: string): number => {
        // First check if we have course-specific attendance data
        if (courseAttendance && courseAttendance[courseId] && courseAttendance[courseId].length > 0) {
            const records = courseAttendance[courseId]
            const presentCount = records.filter((a) => a.status === "present" || a.status === "excused").length
            return Math.round((presentCount / records.length) * 100)
        }

        // Fall back to filtering the overall attendance
        const courseAttendanceRecords = attendance.filter((a) => a.courseId === courseId)
        if (courseAttendanceRecords.length === 0) return 0

        const presentCount = courseAttendanceRecords.filter((a) => a.status === "present" || a.status === "excused").length
        return Math.round((presentCount / courseAttendanceRecords.length) * 100)
    }

    const calculateAverageScore = (courseId: string): number => {
        const courseMarks = marks.filter((m) => m.courseId === courseId)
        if (courseMarks.length === 0) return 0

        const totalPercentage = courseMarks.reduce((sum, mark) => sum + mark.score / mark.maxScore, 0)
        return Math.round((totalPercentage / courseMarks.length) * 100)
    }

    return (
        <View style={[styles.tabContent, isDesktop && styles.desktopTabContent]}>
            <Text style={styles.tabTitle}>Your Courses</Text>

            <FlatList
                data={courses}
                key={isDesktop ? "desktop-grid" : "mobile-list"}
                numColumns={isDesktop ? 2 : 1}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.courseCard, isDesktop && styles.desktopCourseCard]}
                        onPress={() => handleCourseSelect(item)}
                    >
                        <View style={[styles.courseCardHeader, { backgroundColor: item.color }]}>
                            <FontAwesome name={item.icon as any} size={24} color="white" />
                            <Text style={styles.courseCardCode}>{item.code}</Text>
                        </View>
                        <View style={styles.courseCardBody}>
                            <Text style={styles.courseCardTitle}>{item.title}</Text>
                            <Text style={styles.courseCardProfessor}>{item.professor.name}</Text>

                            <View style={styles.courseCardStats}>
                                <View style={styles.courseCardStat}>
                                    <MaterialIcons name="date-range" size={16} color="#5c51f3" />
                                    <Text style={styles.courseCardStatText}>{calculateAttendancePercentage(item._id)}% Attendance</Text>
                                </View>
                                <View style={styles.courseCardStat}>
                                    <MaterialIcons name="grade" size={16} color="#5c51f3" />
                                    <Text style={styles.courseCardStatText}>{calculateAverageScore(item._id)}% Average</Text>
                                </View>
                            </View>

                            <View style={styles.courseCardProgress}>
                                <View style={styles.courseCardProgressBar}>
                                    <View
                                        style={[
                                            styles.courseCardProgressFill,
                                            {
                                                width: `${item.progress}%`,
                                                backgroundColor: item.color,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.courseCardProgressText}>{item.progress}% Complete</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={[styles.coursesList, isDesktop && styles.desktopCoursesList]}
            />
        </View>
    )
}
