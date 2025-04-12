"use client"

import { useState, useEffect, useContext } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    ActivityIndicator,
    Alert,
    useWindowDimensions,
} from "react-native"
import { MaterialIcons, Ionicons, Feather, AntDesign } from "@expo/vector-icons"
import { useToken } from "@/app/hooks/useToken"
import { APP_CONFIG } from "@/app-config"
import styles from "@/app/styles/ProfessorDashboard.style"
import { LineChart } from "react-native-chart-kit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthContext } from "@/app/context/AuthContext"

interface Course {
    _id: string
    code: string
    title: string
    color: string
    students: Student[]
}

interface Student {
    _id: string
    name: string
    email: string
}

interface Attendance {
    _id: string
    courseId: string
    studentId: string
    date: string
    status: "present" | "absent" | "excused"
    student?: {
        _id: string
        name: string
        email: string
    }
}

interface AttendanceStatus {
    [key: string]: "present" | "absent" | "excused"
}

interface AttendanceManagementProps {
    courses: Course[]
    isDesktop: boolean
    onError: (message: string) => void
}

const AttendanceManagement = ({ courses, isDesktop, onError }: AttendanceManagementProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false)
    const [isAccessModalVisible, setIsAccessModalVisible] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
    const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({})
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
    const [filteredRecords, setFilteredRecords] = useState<Attendance[]>([])
    const [selectedFilter, setSelectedFilter] = useState("all")
    const [studentEmail, setStudentEmail] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    const { token } = useToken()
    const { width } = useWindowDimensions()
    const API_BASE_URL = APP_CONFIG.API_BASE_URL
    const auth = useContext(AuthContext)

    // Fetch attendance records when component mounts or courses change
    useEffect(() => {
        if (courses.length > 0) {
            fetchAttendanceRecords()
        }
    }, [courses])

    // Filter records when selectedFilter or search query changes
    useEffect(() => {
        filterAttendanceRecords()
    }, [selectedFilter, attendanceRecords, searchQuery])

    const fetchAttendanceRecords = async () => {
        if (!token || courses.length === 0) return

        setIsLoading(true)

        try {
            // Fetch attendance for all courses
            const attendancePromises = courses.map((course) =>
                fetch(`${API_BASE_URL}/api/attendance/course/${course._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => (res.ok ? res.json() : []))
                    .catch(() => []),
            )

            const attendanceResults = await Promise.all(attendancePromises)
            const allAttendance = attendanceResults.flat()
            setAttendanceRecords(allAttendance)
            await AsyncStorage.setItem("professorDashboardAttendance", JSON.stringify(allAttendance))
        } catch (error) {
            console.error("Error fetching attendance records:", error)
            onError("Failed to fetch attendance records")

            // Try to load cached data
            const cachedAttendance = await AsyncStorage.getItem("professorDashboardAttendance")
            if (cachedAttendance) {
                setAttendanceRecords(JSON.parse(cachedAttendance))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const filterAttendanceRecords = () => {
        let filtered = [...attendanceRecords]

        // Apply course/time filter
        if (selectedFilter === "all") {
            // No additional filtering needed
        } else if (selectedFilter === "today") {
            const today = new Date().toISOString().split("T")[0]
            filtered = filtered.filter((record) => record.date.startsWith(today))
        } else if (selectedFilter === "week") {
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
            filtered = filtered.filter((record) => new Date(record.date) >= oneWeekAgo)
        } else {
            // Filter by course
            filtered = filtered.filter((record) => record.courseId === selectedFilter)
        }

        // Apply search query if present
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (record) =>
                    record.student?.name?.toLowerCase().includes(query) ||
                    record.student?.email?.toLowerCase().includes(query) ||
                    courses
                        .find((c) => c._id === record.courseId)
                        ?.code.toLowerCase()
                        .includes(query),
            )
        }

        setFilteredRecords(filtered)
    }

    const handleSaveAttendance = async () => {
        if (Object.keys(attendanceStatus).length === 0 || !selectedCourse) {
            Alert.alert("Error", "No attendance data to save")
            return
        }

        setIsLoading(true)

        try {
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`${API_BASE_URL}/api/attendance/record`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courseId: selectedCourse._id,
                    date: attendanceDate,
                    attendanceData: attendanceStatus,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                // Update attendance records state
                const newRecords = data.attendanceRecords || []
                const updatedAttendance = [...attendanceRecords, ...newRecords]
                setAttendanceRecords(updatedAttendance)
                await AsyncStorage.setItem("professorDashboardAttendance", JSON.stringify(updatedAttendance))

                Alert.alert("Success", "Attendance recorded successfully")
            } else {
                Alert.alert("Error", data.error || "Failed to record attendance")
            }
        } catch (error) {
            console.error("Error recording attendance:", error)
            Alert.alert("Error", "Failed to record attendance")
        } finally {
            setIsLoading(false)
            setIsAttendanceModalVisible(false)
            setAttendanceStatus({})
        }
    }

    const handleGrantAccess = async () => {
        if (!studentEmail) {
            Alert.alert("Error", "Please enter a student email")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/grant-access`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    studentEmail,
                    professorEmail: auth?.user?.email,
                    grant: true,
                }),
            })

            if (response.ok) {
                Alert.alert("Success", "Access granted successfully")
                setStudentEmail("")
            } else {
                const data = await response.json()
                Alert.alert("Error", data.message || "Failed to grant access")
            }
        } catch (error) {
            console.error("Error granting access:", error)
            Alert.alert("Error", "Failed to grant access")
        } finally {
            setIsLoading(false)
            setIsAccessModalVisible(false)
        }
    }

    const handleRevokeAccess = async () => {
        if (!studentEmail) {
            Alert.alert("Error", "Please enter a student email")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/grant-access`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    studentEmail,
                    professorEmail: auth?.user?.email,
                    grant: false, // Set to false to revoke access
                }),
            })

            if (response.ok) {
                Alert.alert("Success", "Access revoked successfully")
                setStudentEmail("")
            } else {
                const data = await response.json()
                Alert.alert("Error", data.message || "Failed to revoke access")
            }
        } catch (error) {
            console.error("Error revoking access:", error)
            Alert.alert("Error", "Failed to revoke access")
        } finally {
            setIsLoading(false)
            setIsAccessModalVisible(false)
        }
    }

    // Calculate attendance percentage for a course
    const calculateCourseAttendance = (courseId: string): number => {
        const courseAttendance = attendanceRecords.filter((record) => record.courseId === courseId)
        if (courseAttendance.length === 0) return 0

        const presentCount = courseAttendance.filter(
            (record) => record.status === "present" || record.status === "excused",
        ).length

        return Math.round((presentCount / courseAttendance.length) * 100)
    }

    // Prepare chart data
    const getAttendanceChartData = () => {
        const courseData = courses.map((course) => ({
            code: course.code,
            attendance: calculateCourseAttendance(course._id),
        }))

        return {
            labels: courseData.map((item) => item.code),
            datasets: [
                {
                    data: courseData.map((item) => item.attendance),
                    strokeWidth: 2,
                },
            ],
        }
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
    }

    // Mark all students as present
    const markAllPresent = () => {
        if (!selectedCourse) return

        const newStatus = { ...attendanceStatus }
        selectedCourse.students.forEach((student) => {
            newStatus[student._id] = "present"
        })
        setAttendanceStatus(newStatus)
    }

    // Mark all students as absent
    const markAllAbsent = () => {
        if (!selectedCourse) return

        const newStatus = { ...attendanceStatus }
        selectedCourse.students.forEach((student) => {
            newStatus[student._id] = "absent"
        })
        setAttendanceStatus(newStatus)
    }

    // Get student name from ID
    const getStudentName = (studentId: string) => {
        for (const course of courses) {
            const student = course.students.find((s) => s._id === studentId)
            if (student) return student.name
        }
        return "Unknown Student"
    }

    // Delete attendance record
    const handleDeleteAttendance = async (recordId: string) => {
        Alert.alert(
            "Delete Attendance",
            "Are you sure you want to delete this attendance record?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setIsLoading(true)
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/attendance/${recordId}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                            })

                            if (response.ok) {
                                // Remove the record from state
                                const updatedRecords = attendanceRecords.filter((record) => record._id !== recordId)
                                setAttendanceRecords(updatedRecords)
                                await AsyncStorage.setItem("professorDashboardAttendance", JSON.stringify(updatedRecords))
                                Alert.alert("Success", "Attendance record deleted successfully")
                            } else {
                                const data = await response.json()
                                Alert.alert("Error", data.error || "Failed to delete attendance record")
                            }
                        } catch (error) {
                            console.error("Error deleting attendance record:", error)
                            Alert.alert("Error", "Failed to delete attendance record")
                        } finally {
                            setIsLoading(false)
                        }
                    },
                },
            ],
            { cancelable: true },
        )
    }

    // Update attendance status
    const handleUpdateAttendance = async (recordId: string, newStatus: "present" | "absent" | "excused") => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/attendance/${recordId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: newStatus,
                }),
            })

            if (response.ok) {
                // Update the record in state
                const updatedRecords = attendanceRecords.map((record) =>
                    record._id === recordId ? { ...record, status: newStatus } : record,
                )
                setAttendanceRecords(updatedRecords)
                await AsyncStorage.setItem("professorDashboardAttendance", JSON.stringify(updatedRecords))
                Alert.alert("Success", "Attendance status updated successfully")
            } else {
                const data = await response.json()
                Alert.alert("Error", data.error || "Failed to update attendance status")
            }
        } catch (error) {
            console.error("Error updating attendance status:", error)
            Alert.alert("Error", "Failed to update attendance status")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Attendance Management</Text>
            </View>

            <View style={[styles.tabContent, isDesktop && styles.desktopTabContent]}>
                {/* Search and Filters */}
                <View style={styles.searchAndFilters}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by student name or course"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView}>
                        <View style={styles.attendanceFilters}>
                            <TouchableOpacity
                                style={[styles.filterButton, selectedFilter === "all" && styles.activeFilter]}
                                onPress={() => setSelectedFilter("all")}
                            >
                                <Text style={selectedFilter === "all" ? styles.activeFilterText : styles.filterText}>All Records</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterButton, selectedFilter === "today" && styles.activeFilter]}
                                onPress={() => setSelectedFilter("today")}
                            >
                                <Text style={selectedFilter === "today" ? styles.activeFilterText : styles.filterText}>Today</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterButton, selectedFilter === "week" && styles.activeFilter]}
                                onPress={() => setSelectedFilter("week")}
                            >
                                <Text style={selectedFilter === "week" ? styles.activeFilterText : styles.filterText}>This Week</Text>
                            </TouchableOpacity>
                            {courses.map((course) => (
                                <TouchableOpacity
                                    key={course._id}
                                    style={[styles.filterButton, selectedFilter === course._id && styles.activeFilter]}
                                    onPress={() => setSelectedFilter(course._id)}
                                >
                                    <Text style={selectedFilter === course._id ? styles.activeFilterText : styles.filterText}>
                                        {course.code}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Actions */}
                <View style={styles.attendanceActions}>
                    <TouchableOpacity style={styles.attendanceAction} onPress={() => setIsAttendanceModalVisible(true)}>
                        <MaterialIcons name="add" size={24} color="#4252e5" />
                        <Text style={styles.attendanceActionText}>Take Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attendanceAction} onPress={() => setIsAccessModalVisible(true)}>
                        <MaterialIcons name="vpn-key" size={24} color="#4252e5" />
                        <Text style={styles.attendanceActionText}>Manage Access</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attendanceAction} onPress={fetchAttendanceRecords}>
                        <MaterialIcons name="refresh" size={24} color="#4252e5" />
                        <Text style={styles.attendanceActionText}>Refresh Data</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Summary */}
                <View style={styles.attendanceStatsContainer}>
                    <Text style={styles.sectionTitle}>Attendance Summary</Text>
                    <View style={styles.attendanceStatsGrid}>
                        <View style={[styles.attendanceStatCard, { backgroundColor: "#e0eaff" }]}>
                            <Text style={[styles.attendanceStatValue, { color: "#4252e5" }]}>
                                {attendanceRecords.filter((r) => r.status === "present").length}
                            </Text>
                            <Text style={styles.attendanceStatLabel}>Present</Text>
                        </View>
                        <View style={[styles.attendanceStatCard, { backgroundColor: "#ffe0e0" }]}>
                            <Text style={[styles.attendanceStatValue, { color: "#e53e3e" }]}>
                                {attendanceRecords.filter((r) => r.status === "absent").length}
                            </Text>
                            <Text style={styles.attendanceStatLabel}>Absent</Text>
                        </View>
                        <View style={[styles.attendanceStatCard, { backgroundColor: "#e0f5e9" }]}>
                            <Text style={[styles.attendanceStatValue, { color: "#38a169" }]}>
                                {attendanceRecords.filter((r) => r.status === "excused").length}
                            </Text>
                            <Text style={styles.attendanceStatLabel}>Excused</Text>
                        </View>
                        <View style={[styles.attendanceStatCard, { backgroundColor: "#f0f0f0" }]}>
                            <Text style={[styles.attendanceStatValue, { color: "#718096" }]}>
                                {attendanceRecords.length > 0
                                    ? Math.round(
                                        ((attendanceRecords.filter((r) => r.status === "present").length +
                                            attendanceRecords.filter((r) => r.status === "excused").length) /
                                            attendanceRecords.length) *
                                        100,
                                    )
                                    : 0}
                                %
                            </Text>
                            <Text style={styles.attendanceStatLabel}>Rate</Text>
                        </View>
                    </View>
                </View>

                {/* Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Attendance Trends by Course</Text>
                    <LineChart
                        data={getAttendanceChartData()}
                        width={width - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#5c51f3",
                            },
                        }}
                        bezier
                        style={styles.chart}
                    />
                </View>

                {/* Records */}
                <View style={styles.attendanceRecordsHeader}>
                    <Text style={styles.sectionTitle}>Attendance Records</Text>
                    <Text style={styles.recordsCount}>{filteredRecords.length} records found</Text>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#5c51f3" />
                        <Text style={styles.loadingText}>Loading attendance records...</Text>
                    </View>
                ) : filteredRecords.length > 0 ? (
                    <View style={isDesktop ? styles.desktopAttendanceGrid : null}>
                        {filteredRecords
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((record) => {
                                const course = courses.find((c) => c._id === record.courseId)
                                return (
                                    <View key={record._id} style={[styles.attendanceRecord, isDesktop && styles.desktopAttendanceRecord]}>
                                        <View style={styles.attendanceRecordHeader}>
                                            <Text style={styles.attendanceRecordDate}>{formatDate(record.date)}</Text>
                                            <View style={[styles.courseTag, { backgroundColor: course?.color || "#52c4eb" }]}>
                                                <Text style={styles.courseTagText}>{course?.code || "Unknown"}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.attendanceRecordDetails}>
                                            <View>
                                                <View style={styles.studentAvatar}>
                                                    <Ionicons name="person" size={16} color="white" />
                                                </View>
                                                <Text style={styles.attendanceRecordStudentName}>
                                                    {record.student?.name || getStudentName(record.studentId) || "Unknown Student"}
                                                </Text>
                                            </View>
                                            <View style={styles.attendanceRecordActions}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.statusBadge,
                                                        record.status === "present"
                                                            ? styles.presentBadge
                                                            : record.status === "excused"
                                                                ? styles.excusedBadge
                                                                : styles.absentBadge,
                                                    ]}
                                                    onPress={() => {
                                                        // Show status change options
                                                        Alert.alert(
                                                            "Update Status",
                                                            "Change attendance status to:",
                                                            [
                                                                {
                                                                    text: "Present",
                                                                    onPress: () => handleUpdateAttendance(record._id, "present"),
                                                                },
                                                                {
                                                                    text: "Absent",
                                                                    onPress: () => handleUpdateAttendance(record._id, "absent"),
                                                                },
                                                                {
                                                                    text: "Excused",
                                                                    onPress: () => handleUpdateAttendance(record._id, "excused"),
                                                                },
                                                                {
                                                                    text: "Cancel",
                                                                    style: "cancel",
                                                                },
                                                            ],
                                                            { cancelable: true },
                                                        )
                                                    }}
                                                >
                                                    <Text style={styles.statusBadgeText}>
                                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => handleDeleteAttendance(record._id)}
                                                >
                                                    <MaterialIcons name="delete" size={18} color="#e53e3e" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="event-busy" size={48} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>No Attendance Records</Text>
                        <Text style={styles.emptyStateMessage}>
                            {searchQuery
                                ? "No records match your search criteria."
                                : "There are no attendance records matching your filter criteria."}
                        </Text>
                    </View>
                )}
            </View>

            {/* Take Attendance Modal */}
            <Modal
                visible={isAttendanceModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsAttendanceModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, isDesktop && styles.desktopModalContainer]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Take Attendance</Text>
                            <TouchableOpacity onPress={() => setIsAttendanceModalVisible(false)}>
                                <AntDesign name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.inputLabel}>Date</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="YYYY-MM-DD"
                                value={attendanceDate}
                                onChangeText={setAttendanceDate}
                            />

                            <Text style={styles.inputLabel}>Course</Text>
                            <View style={styles.pickerContainer}>
                                {courses.map((course) => (
                                    <TouchableOpacity
                                        key={course._id}
                                        style={[styles.courseOption, selectedCourse?._id === course._id && styles.selectedCourseOption]}
                                        onPress={() => setSelectedCourse(course)}
                                    >
                                        <Text
                                            style={[
                                                styles.courseOptionText,
                                                selectedCourse?._id === course._id && styles.selectedCourseOptionText,
                                            ]}
                                        >
                                            {course.code}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {selectedCourse && (
                                <>
                                    <View style={styles.bulkActionContainer}>
                                        <TouchableOpacity style={styles.bulkActionButton} onPress={markAllPresent}>
                                            <Text style={styles.bulkActionText}>Mark All Present</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.bulkActionButton} onPress={markAllAbsent}>
                                            <Text style={styles.bulkActionText}>Mark All Absent</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.inputLabel}>
                                        Students ({selectedCourse.students.length}) - {Object.keys(attendanceStatus).length} marked
                                    </Text>
                                    <View style={styles.attendanceList}>
                                        {selectedCourse.students.map((student) => (
                                            <View key={student._id} style={styles.attendanceListItem}>
                                                <View style={styles.attendanceStudentInfo}>
                                                    <View style={styles.studentAvatar}>
                                                        <Ionicons name="person" size={20} color="white" />
                                                    </View>
                                                    <Text style={styles.attendanceStudentName}>{student.name}</Text>
                                                </View>
                                                <View style={styles.attendanceOptions}>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.attendanceOption,
                                                            attendanceStatus[student._id] === "present" && styles.presentOption,
                                                        ]}
                                                        onPress={() =>
                                                            setAttendanceStatus({
                                                                ...attendanceStatus,
                                                                [student._id]: "present",
                                                            })
                                                        }
                                                    >
                                                        <Feather
                                                            name="check"
                                                            size={20}
                                                            color={attendanceStatus[student._id] === "present" ? "white" : "#4252e5"}
                                                        />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.attendanceOption,
                                                            attendanceStatus[student._id] === "absent" && styles.absentOption,
                                                        ]}
                                                        onPress={() =>
                                                            setAttendanceStatus({
                                                                ...attendanceStatus,
                                                                [student._id]: "absent",
                                                            })
                                                        }
                                                    >
                                                        <Feather
                                                            name="x"
                                                            size={20}
                                                            color={attendanceStatus[student._id] === "absent" ? "white" : "#ff5694"}
                                                        />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.attendanceOption,
                                                            attendanceStatus[student._id] === "excused" && styles.excusedOption,
                                                        ]}
                                                        onPress={() =>
                                                            setAttendanceStatus({
                                                                ...attendanceStatus,
                                                                [student._id]: "excused",
                                                            })
                                                        }
                                                    >
                                                        <MaterialIcons
                                                            name="event-available"
                                                            size={20}
                                                            color={attendanceStatus[student._id] === "excused" ? "white" : "#38a169"}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    (!selectedCourse || Object.keys(attendanceStatus).length === 0) && styles.disabledButton,
                                ]}
                                onPress={handleSaveAttendance}
                                disabled={isLoading || !selectedCourse || Object.keys(attendanceStatus).length === 0}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Save Attendance</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Grant Access Modal */}
            <Modal
                visible={isAccessModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsAccessModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, isDesktop && styles.desktopModalContainer]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Manage Attendance Access</Text>
                            <TouchableOpacity onPress={() => setIsAccessModalVisible(false)}>
                                <AntDesign name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={styles.modalDescription}>
                                Grant or revoke temporary access for a student to view their attendance records. Access will expire
                                after 1 hour.
                            </Text>

                            <Text style={styles.inputLabel}>Student Email</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="student@example.com"
                                value={studentEmail}
                                onChangeText={setStudentEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <View style={styles.accessButtonsContainer}>
                                <TouchableOpacity
                                    style={[styles.grantButton, !studentEmail && styles.disabledButton]}
                                    onPress={handleGrantAccess}
                                    disabled={isLoading || !studentEmail}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <>
                                            <MaterialIcons name="vpn-key" size={18} color="white" />
                                            <Text style={styles.grantButtonText}>Grant Access</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.revokeButton, !studentEmail && styles.disabledButton]}
                                    onPress={handleRevokeAccess}
                                    disabled={isLoading || !studentEmail}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <>
                                            <MaterialIcons name="block" size={18} color="white" />
                                            <Text style={styles.revokeButtonText}>Revoke Access</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default AttendanceManagement
