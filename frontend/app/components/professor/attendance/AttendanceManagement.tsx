"use client"

import { useState, useEffect } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    TextInput,
    Alert,
    Modal,
    SafeAreaView,
} from "react-native"
import { MaterialIcons, Ionicons, FontAwesome, AntDesign, Feather } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useToken } from "../../../hooks/useToken"
import { APP_CONFIG } from "@/app-config"
import styles from "../../../styles/ProfessorDashboard.style"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

interface Course {
    _id: string
    code: string
    title: string
    department: string
    students: Student[]
    color: string
    icon: string
    credits: number
}

interface Student {
    _id: string
    name: string
    email: string
    program?: string
    year?: number
}

interface Attendance {
    _id: string
    courseId: string
    studentId: string | {
        _id: string
        name: string
        email: string
    }
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
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
    const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({})
    const [filterType, setFilterType] = useState<"all" | "date" | "student">("all")
    const [filterDate, setFilterDate] = useState<string>("")
    const [filterStudent, setFilterStudent] = useState<string>("")
    const { token } = useToken()

    // Fetch attendance records on component mount
    useEffect(() => {
        fetchAttendanceRecords()
    }, [token])

    // Modify the fetchAttendanceRecords function to ensure student data is populated
    const fetchAttendanceRecords = async () => {
        setIsLoading(true)
        try {
            if (!token) {
                throw new Error("No authentication token found")
            }

            console.log("token", token)

            // Fetch courses with full student data first
            const coursesResponse = await fetch(`${API_BASE_URL}/api/courses`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const coursesWithStudents = await coursesResponse.json()

            // Update courses state if needed (this might be handled elsewhere)
            // setCourses(coursesWithStudents);

            // Fetch attendance for all courses taught by this professor
            const attendancePromises = coursesWithStudents.map((course: { _id: any }) =>
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

            // Add student information to attendance records
            const allAttendance = attendanceResults.flat().map((record) => {
                // Find the student in the course
                const course = coursesWithStudents.find((c: { _id: any }) => c._id === record.courseId)
                if (course) {
                    const student = course.students.find((s: { _id: any }) => s._id === record.studentId)
                    if (student) {
                        return { ...record, student }
                    }
                }
                return record
            })

            setAttendanceRecords(allAttendance)
            console.log(attendanceRecords);
            await AsyncStorage.setItem("professorDashboardAttendance", JSON.stringify(allAttendance))

        } catch (error) {
            console.error("Error fetching attendance records:", error)

            // Try to load cached data
            const cachedAttendance = await AsyncStorage.getItem("professorDashboardAttendance")
            if (cachedAttendance) {
                setAttendanceRecords(JSON.parse(cachedAttendance))
            } else {
                onError("Failed to fetch attendance records")
            }
        } finally {
            setIsLoading(false)
        }
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

            // Prepare attendance records for API
            const attendanceData: { studentId: string; status: string }[] = []

            Object.keys(attendanceStatus).forEach((studentId) => {
                attendanceData.push({
                    studentId,
                    status: attendanceStatus[studentId],
                })
            })

            // Call the API to record attendance for each student
            const promises = attendanceData.map((record) =>
                fetch(`${API_BASE_URL}/api/attendance/record`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        courseId: selectedCourse._id,
                        studentId: record.studentId,
                        date: attendanceDate,
                        status: record.status,
                    }),
                }),
            )

            await Promise.all(promises)

            // Refresh attendance records
            await fetchAttendanceRecords()
            Alert.alert("Success", "Attendance recorded successfully")
            setIsAttendanceModalVisible(false)
            setAttendanceStatus({})

        } catch (error) {
            console.error("Error recording attendance:", error)
            Alert.alert("Error", "Failed to record attendance")
        } finally {
            setIsLoading(false)
        }
    }

    // Filter attendance records based on selected filter
    const getFilteredAttendanceRecords = () => {
        if (filterType === "all") {
            return attendanceRecords
        } else if (filterType === "date" && filterDate) {
            return attendanceRecords.filter((record) => record.date.includes(filterDate))
        } else if (filterType === "student" && filterStudent) {
            return attendanceRecords.filter((record) => {
                const student = courses.flatMap((course) => course.students).find((student) => student._id === record.studentId)

                return student && student.name.toLowerCase().includes(filterStudent.toLowerCase())
            })
        }
        return attendanceRecords
    }

    // Group attendance records by course and date
    const groupAttendanceRecords = () => {
        const filteredRecords = getFilteredAttendanceRecords()
        const groupedByCourse: Record<string, Attendance[]> = {}

        filteredRecords.forEach((record) => {
            if (!groupedByCourse[record.courseId]) {
                groupedByCourse[record.courseId] = []
            }
            groupedByCourse[record.courseId].push(record)
        })

        return groupedByCourse
    }

    // Group attendance records by date for a specific course
    const groupAttendanceByDate = (courseAttendance: Attendance[]) => {
        const attendanceByDate: Record<string, Attendance[]> = {}

        courseAttendance.forEach((record) => {
            const date = record.date.split("T")[0]
            if (!attendanceByDate[date]) {
                attendanceByDate[date] = []
            }
            attendanceByDate[date].push(record)
        })

        return attendanceByDate
    }

    return (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Attendance Management</Text>
            </View>
            <View style={[styles.tabContent, isDesktop && styles.desktopTabContent]}>
                <View style={styles.attendanceFilters}>
                    <TouchableOpacity
                        style={[styles.filterButton, filterType === "all" && styles.activeFilter]}
                        onPress={() => setFilterType("all")}
                    >
                        <Text style={filterType === "all" ? styles.activeFilterText : styles.filterText}>All Courses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filterType === "date" && styles.activeFilter]}
                        onPress={() => setFilterType("date")}
                    >
                        <Text style={filterType === "date" ? styles.activeFilterText : styles.filterText}>By Date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filterType === "student" && styles.activeFilter]}
                        onPress={() => setFilterType("student")}
                    >
                        <Text style={filterType === "student" ? styles.activeFilterText : styles.filterText}>By Student</Text>
                    </TouchableOpacity>
                </View>

                {filterType === "date" && (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter date (YYYY-MM-DD)"
                        value={filterDate}
                        onChangeText={setFilterDate}
                    />
                )}

                {filterType === "student" && (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter student name"
                        value={filterStudent}
                        onChangeText={setFilterStudent}
                    />
                )}

                <Text style={styles.sectionTitle}>Recent Attendance Records</Text>

                {isLoading ? (
                    <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                        <ActivityIndicator size="large" color="#5c51f3" />
                        <Text style={{ marginTop: 10 }}>Loading attendance records...</Text>
                    </SafeAreaView>
                ) : attendanceRecords.length > 0 ? (
                    <View style={isDesktop ? styles.desktopAttendanceGrid : null}>
                        {Object.entries(groupAttendanceRecords()).map(([courseId, courseAttendance]) => {
                            const course = courses.find((c) => c._id === courseId)
                            if (!course) return null

                            // Group by date
                            const attendanceByDate = groupAttendanceByDate(courseAttendance)

                            return (
                                <View
                                    key={courseId}
                                    style={[styles.attendanceCourseSection, isDesktop && styles.desktopAttendanceCourseSection]}
                                >
                                    <View style={[styles.courseHeader, { backgroundColor: course.color }]}>
                                        <FontAwesome name={course.icon as any} size={24} color="white" />
                                        <View style={styles.courseHeaderInfo}>
                                            <Text style={styles.courseHeaderTitle}>{course.title}</Text>
                                            <Text style={styles.courseHeaderCode}>{course.code}</Text>
                                        </View>
                                    </View>

                                    {Object.keys(attendanceByDate).map((date) => (
                                        <View key={date} style={styles.attendanceDateCard}>
                                            <View style={styles.attendanceDateHeader}>
                                                <MaterialIcons name="date-range" size={20} color="#4252e5" />
                                                <Text style={styles.attendanceDateText}>{date}</Text>
                                                <Text style={styles.attendanceCountText}>
                                                    {attendanceByDate[date].filter((r) => r.status === "present").length} /{" "}
                                                    {course.students.length} present
                                                </Text>
                                            </View>

                                            <View style={styles.attendanceStudentsList}>
                                                {attendanceByDate[date].map((record) => {

                                                    const student = record.student ||
                                                        (typeof record.studentId === 'object' && record.studentId !== null ?
                                                            record.studentId :
                                                            course.students.find((s) => s._id === record.studentId));

                                                    if (!student) return null;

                                                    return (
                                                        <View key={typeof record.studentId === 'object' ? record.studentId._id : record.studentId} style={styles.attendanceStudentItem}>
                                                            <View style={styles.studentAvatar}>
                                                                <Ionicons name="person" size={16} color="white" />
                                                            </View>
                                                            <Text style={styles.attendanceStudentName}>
                                                                {typeof student === 'object' && student.name ? student.name : "Unknown Student"}
                                                            </Text>
                                                            {/* rest of your code */}
                                                            <View
                                                                style={[
                                                                    styles.attendanceStatusBadge,
                                                                    record.status === "present"
                                                                        ? styles.presentBadge
                                                                        : record.status === "excused"
                                                                            ? styles.excusedBadge
                                                                            : record.status === "absent"
                                                                                ? styles.absentBadge
                                                                                : styles.unknownBadge,
                                                                ]}
                                                            >
                                                                <Text style={styles.attendanceStatusText}>
                                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    );

                                                    // const student = record.student || course.students.find((s) => s._id === record.studentId)
                                                    // if (!student) return null

                                                    // return (
                                                    //     <View key={record.studentId} style={styles.attendanceStudentItem}>
                                                    //         <View style={styles.studentAvatar}>
                                                    //             <Ionicons name="person" size={16} color="white" />
                                                    //         </View>
                                                    //         <Text style={styles.attendanceStudentName}>{student.name || "Unknown Student"}</Text>
                                                    //         <View
                                                    //             style={[
                                                    //                 styles.attendanceStatusBadge,
                                                    //                 record.status === "present"
                                                    //                     ? styles.presentBadge
                                                    //                     : record.status === "excused"
                                                    //                         ? styles.excusedBadge
                                                    //                         : record.status === "absent"
                                                    //                             ? styles.absentBadge
                                                    //                             : styles.unknownBadge,
                                                    //             ]}
                                                    //         >
                                                    //             <Text style={styles.attendanceStatusText}>
                                                    //                 {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                    //             </Text>
                                                    //         </View>
                                                    //     </View>
                                                    // )
                                                })}

                                                {/* Show "View more" button if needed */}
                                                {course.students.length > attendanceByDate[date].length && (
                                                    <TouchableOpacity style={styles.viewMoreButton}>
                                                        <Text style={styles.viewMoreText}>
                                                            View {course.students.length - attendanceByDate[date].length} more students
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    ))}

                                    <TouchableOpacity
                                        style={styles.takeAttendanceButton}
                                        onPress={() => {
                                            console.log("Opening modal with course:", course); // Log the course
                                            console.log("Course students:", course.students); // Log the students
                                            setSelectedCourse(course);
                                            setIsAttendanceModalVisible(true);
                                        }}
                                    >
                                        <MaterialIcons name="date-range" size={20} color="white" />
                                        <Text style={styles.takeAttendanceButtonText}>Take Attendance</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="date-range" size={48} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>No Attendance Records</Text>
                        <Text style={styles.emptyStateMessage}>
                            You haven't recorded any attendance yet. Start by selecting a course and taking attendance.
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyStateButton}
                            onPress={() => {
                                if (courses.length > 0) {
                                    setSelectedCourse(courses[0])
                                    setIsAttendanceModalVisible(true)
                                }
                            }}
                        >
                            <Text style={styles.emptyStateButtonText}>Take Attendance</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>



            {/* Attendance Modal */}
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
                                        onPress={() => {
                                            setSelectedCourse(course);
                                            console.log("Selected course students:", course.students);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.courseOptionText,
                                                selectedCourse?._id === course._id && styles.selectedCourseOptionText,
                                            ]}
                                        >
                                            {course.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {selectedCourse && (
                                <>
                                    <Text style={styles.inputLabel}>Students</Text>
                                    <View style={styles.attendanceList}>
                                        {selectedCourse.students && selectedCourse.students.length > 0 ? (
                                            selectedCourse.students.map((student) => {
                                                // Find existing attendance for this student on this date
                                                const existingAttendance = attendanceRecords.find(
                                                    record =>
                                                        record.courseId === selectedCourse._id &&
                                                        (
                                                            (typeof record.studentId === 'string' && record.studentId === student._id) ||
                                                            (typeof record.studentId === 'object' && record.studentId._id === student._id)
                                                        ) &&
                                                        record.date.split('T')[0] === attendanceDate
                                                );

                                                // Use existing status if available, otherwise use the current status or default to undefined
                                                const status = existingAttendance ? existingAttendance.status : attendanceStatus[student._id];

                                                return (
                                                    <View key={student._id} style={styles.attendanceListItem}>
                                                        <View style={styles.attendanceStudentInfo}>
                                                            <View style={styles.studentAvatar}>
                                                                <Ionicons name="person" size={20} color="white" />
                                                            </View>
                                                            <Text style={styles.attendanceStudentName}>
                                                                {student.name || "Unknown"}
                                                            </Text>
                                                            <Text >
                                                                {student.email || ""}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.attendanceOptions}>
                                                            <TouchableOpacity
                                                                style={[
                                                                    styles.attendanceOption,
                                                                    status === "present" && styles.presentOption,
                                                                ]}
                                                                onPress={() => setAttendanceStatus({ ...attendanceStatus, [student._id]: "present" })}
                                                            >
                                                                <Feather
                                                                    name="check"
                                                                    size={20}
                                                                    color={status === "present" ? "white" : "#4252e5"}
                                                                />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={[
                                                                    styles.attendanceOption,
                                                                    status === "excused" && styles.excusedOption,
                                                                ]}
                                                                onPress={() => setAttendanceStatus({ ...attendanceStatus, [student._id]: "excused" })}
                                                            >
                                                                <Feather
                                                                    name="alert-circle"
                                                                    size={20}
                                                                    color={status === "excused" ? "white" : "#FFC107"}
                                                                />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={[
                                                                    styles.attendanceOption,
                                                                    status === "absent" && styles.absentOption,
                                                                ]}
                                                                onPress={() => setAttendanceStatus({ ...attendanceStatus, [student._id]: "absent" })}
                                                            >
                                                                <Feather
                                                                    name="x"
                                                                    size={20}
                                                                    color={status === "absent" ? "white" : "#ff5694"}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            })
                                        ) : (
                                            <Text style={styles.emptyStateMessage}>No students found in this course.</Text>
                                        )}
                                    </View>
                                </>
                            )}

                            <TouchableOpacity style={styles.submitButton} onPress={handleSaveAttendance} disabled={isLoading}>
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
        </>
    )
}

export default AttendanceManagement
