// "use client"

// import { useContext, useEffect, useState } from "react"
// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     ActivityIndicator,
//     Dimensions,
//     Alert,
//     SafeAreaView,
// } from "react-native"
// import { MaterialIcons } from "@expo/vector-icons"
// import { LineChart } from "react-native-chart-kit"
// import { useRouter } from "expo-router"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { AuthContext } from "../context/AuthContext"
// import { useToken } from "../hooks/useToken"
// import { APP_CONFIG } from "@/app-config"
// import styles from "../styles/ProfessorDashboard.style"

// const screenWidth = Dimensions.get("window").width

// interface Attendance {
//     _id: string
//     courseId: string
//     studentId: string
//     date: string
//     status: "present" | "absent" | "excused"
//     student?: {
//         _id: string
//         name: string
//         email: string
//     }
//     course?: {
//         _id: string
//         code: string
//         title: string
//         color: string
//     }
// }

// interface Course {
//     _id: string
//     code: string
//     title: string
//     color: string
// }

// interface AuthUser {
//     userId: string
//     role: string
//     email?: string
//     hasAccess?: boolean
//     accessExpiresAt?: string
// }

// const AttendanceAccessScreen = () => {
//     const [isLoading, setIsLoading] = useState(true)
//     const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
//     const [courses, setCourses] = useState<Course[]>([])
//     const [selectedCourse, setSelectedCourse] = useState<string>("all")
//     const [attendanceStats, setAttendanceStats] = useState({
//         present: 0,
//         absent: 0,
//         excused: 0,
//         total: 0,
//     })
//     const [attendanceData, setAttendanceData] = useState({
//         labels: [] as string[],
//         datasets: [{ data: [] as number[] }],
//     })
//     const [accessExpiresAt, setAccessExpiresAt] = useState<Date | null>(null)
//     const [timeRemaining, setTimeRemaining] = useState("")

//     const auth = useContext(AuthContext)
//     const router = useRouter()
//     const { token } = useToken()
//     const API_BASE_URL = APP_CONFIG.API_BASE_URL

//     // Check if user has access and fetch attendance data
//     useEffect(() => {
//         const checkAccessAndFetchData = async () => {
//             try {
//                 setIsLoading(true)

//                 if (!auth?.user) {
//                     console.log("No authenticated user, redirecting to login")
//                     router.replace("/login")
//                     return
//                 }

//                 if (auth.user.role !== "student") {
//                     console.log(`User role is ${auth.user.role}, not authorized for student attendance access`)
//                     router.replace(`/${auth.user.role}/${auth.user.userId}` as never)
//                     return
//                 }

//                 if (!auth.user.hasAccess) {
//                     Alert.alert("Access Denied", "You don't have access to attendance records. Please contact your professor.", [
//                         {
//                             text: "Go to Dashboard",
//                             onPress: () => router.replace(`/student/${auth.user.userId}` as never),
//                         },
//                     ])
//                     return
//                 }

//                 // Set access expiration time
//                 if (auth.user.accessExpiresAt) {
//                     const expiresAt = new Date(auth.user.accessExpiresAt)
//                     setAccessExpiresAt(expiresAt)
//                 }

//                 // Fetch attendance data
//                 await fetchAttendanceData()
//             } catch (error) {
//                 console.error("Error in AttendanceAccessScreen:", error)
//                 Alert.alert("Error", "Failed to load attendance data")
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         checkAccessAndFetchData()
//     }, [auth?.user, router])

//     // Update time remaining
//     useEffect(() => {
//         if (!accessExpiresAt) return

//         const updateTimeRemaining = () => {
//             const now = new Date()
//             const diff = accessExpiresAt.getTime() - now.getTime()

//             if (diff <= 0) {
//                 setTimeRemaining("Access expired")
//                 return
//             }

//             const minutes = Math.floor(diff / 60000)
//             const seconds = Math.floor((diff % 60000) / 1000)
//             setTimeRemaining(`${minutes}m ${seconds}s`)
//         }

//         updateTimeRemaining()
//         const interval = setInterval(updateTimeRemaining, 1000)

//         return () => clearInterval(interval)
//     }, [accessExpiresAt])

//     const fetchAttendanceData = async () => {
//         if (!token || !auth?.user?.userId) return

//         try {
//             // Fetch student's attendance records
//             const response = await fetch(`${API_BASE_URL}/api/attendance/student/${auth.user.userId}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             })

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch attendance: ${response.status}`)
//             }

//             const data = await response.json()
//             setAttendanceRecords(data)

//             // Extract unique courses from attendance records
//             const uniqueCourses = Array.from(new Set(data.map((record: Attendance) => record.courseId))).map((courseId) => {
//                 const courseRecord = data.find((record: Attendance) => record.courseId === courseId)
//                 return {
//                     _id: courseId as string,
//                     code: courseRecord.course?.code || "Unknown",
//                     title: courseRecord.course?.title || "Unknown Course",
//                     color: courseRecord.course?.color || "#4252e5",
//                 }
//             })

//             setCourses(uniqueCourses)

//             // Calculate attendance statistics
//             calculateAttendanceStats(data)

//             // Prepare chart data
//             prepareChartData(data, uniqueCourses)

//             // Cache the data
//             await AsyncStorage.setItem("studentAttendanceRecords", JSON.stringify(data))
//             await AsyncStorage.setItem("studentAttendanceCourses", JSON.stringify(uniqueCourses))
//         } catch (error) {
//             console.error("Error fetching attendance data:", error)

//             // Try to load cached data
//             const cachedRecords = await AsyncStorage.getItem("studentAttendanceRecords")
//             const cachedCourses = await AsyncStorage.getItem("studentAttendanceCourses")

//             if (cachedRecords) {
//                 const records = JSON.parse(cachedRecords)
//                 setAttendanceRecords(records)
//                 calculateAttendanceStats(records)

//                 if (cachedCourses) {
//                     const courses = JSON.parse(cachedCourses)
//                     setCourses(courses)
//                     prepareChartData(records, courses)
//                 }
//             }
//         }
//     }

//     const calculateAttendanceStats = (records: Attendance[]) => {
//         const filteredRecords =
//             selectedCourse === "all" ? records : records.filter((record) => record.courseId === selectedCourse)

//         const present = filteredRecords.filter((record) => record.status === "present").length
//         const absent = filteredRecords.filter((record) => record.status === "absent").length
//         const excused = filteredRecords.filter((record) => record.status === "excused").length
//         const total = filteredRecords.length

//         setAttendanceStats({
//             present,
//             absent,
//             excused,
//             total,
//         })
//     }

//     const prepareChartData = (records: Attendance[], courses: Course[]) => {
//         // Group attendance by course
//         const courseAttendance = courses.map((course) => {
//             const courseRecords = records.filter((record) => record.courseId === course._id)
//             const presentCount = courseRecords.filter(
//                 (record) => record.status === "present" || record.status === "excused",
//             ).length
//             const attendanceRate = courseRecords.length > 0 ? (presentCount / courseRecords.length) * 100 : 0

//             return {
//                 code: course.code,
//                 attendanceRate: Math.round(attendanceRate),
//             }
//         })

//         // Sort by course code
//         courseAttendance.sort((a, b) => a.code.localeCompare(b.code))

//         setAttendanceData({
//             labels: courseAttendance.map((item) => item.code),
//             datasets: [
//                 {
//                     data: courseAttendance.map((item) => item.attendanceRate),
//                     strokeWidth: 2,
//                 },
//             ],
//         })
//     }

//     const handleCourseFilter = (courseId: string) => {
//         setSelectedCourse(courseId)
//         calculateAttendanceStats(
//             courseId === "all" ? attendanceRecords : attendanceRecords.filter((record) => record.courseId === courseId),
//         )
//     }

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString)
//         return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
//     }

//     if (isLoading) {
//         return (
//             <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//                 <ActivityIndicator size="large" color="#5c51f3" />
//                 <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
//             </SafeAreaView>
//         )
//     }

//     if (!auth?.user?.hasAccess) {
//         return (
//             <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
//                 <MaterialIcons name="lock" size={64} color="#ccc" />
//                 <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20, textAlign: "center" }}>Access Denied</Text>
//                 <Text style={{ textAlign: "center", marginTop: 10, color: "#666" }}>
//                     You don't have access to attendance records. Please contact your professor.
//                 </Text>
//                 <TouchableOpacity
//                     style={{
//                         backgroundColor: "#4252e5",
//                         padding: 12,
//                         borderRadius: 8,
//                         alignItems: "center",
//                         marginTop: 20,
//                         width: "100%",
//                         maxWidth: 300,
//                     }}
//                     onPress={() => router.replace(`/student/${auth.user?.userId}` as never)}
//                 >
//                     <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Go to Dashboard</Text>
//                 </TouchableOpacity>
//             </SafeAreaView>
//         )
//     }

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9ff" }}>
//             <ScrollView style={{ flex: 1, padding: 20 }}>
//                 <View style={styles.tabHeader}>
//                     <Text style={styles.tabTitle}>Attendance Records</Text>
//                     {accessExpiresAt && (
//                         <View style={styles.accessTimerContainer}>
//                             <MaterialIcons name="timer" size={18} color="#ff5694" />
//                             <Text style={styles.accessTimerText}>Access expires in: {timeRemaining}</Text>
//                         </View>
//                     )}
//                 </View>

//                 {/* Course Filters */}
//                 <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView}>
//                     <View style={styles.attendanceFilters}>
//                         <TouchableOpacity
//                             style={[styles.filterButton, selectedCourse === "all" && styles.activeFilter]}
//                             onPress={() => handleCourseFilter("all")}
//                         >
//                             <Text style={selectedCourse === "all" ? styles.activeFilterText : styles.filterText}>All Courses</Text>
//                         </TouchableOpacity>

//                         {courses.map((course) => (
//                             <TouchableOpacity
//                                 key={course._id}
//                                 style={[styles.filterButton, selectedCourse === course._id && styles.activeFilter]}
//                                 onPress={() => handleCourseFilter(course._id)}
//                             >
//                                 <Text style={selectedCourse === course._id ? styles.activeFilterText : styles.filterText}>
//                                     {course.code}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </ScrollView>

//                 {/* Dashboard Actions */}
//                 <View style={{ marginTop: 20, marginBottom: 20 }}>
//                     <TouchableOpacity
//                         style={{
//                             backgroundColor: "#4252e5",
//                             padding: 12,
//                             borderRadius: 8,
//                             alignItems: "center",
//                         }}
//                         onPress={() => router.replace(`/student/${auth?.user?.userId}` as never)}
//                     >
//                         <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Return to Dashboard</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Attendance Stats */}
//                 <View style={styles.attendanceStatsContainer}>
//                     <Text style={styles.sectionTitle}>Attendance Summary</Text>
//                     <View style={styles.attendanceStatsGrid}>
//                         <View style={[styles.attendanceStatCard, { backgroundColor: "#e0eaff" }]}>
//                             <Text style={[styles.attendanceStatValue, { color: "#4252e5" }]}>{attendanceStats.present}</Text>
//                             <Text style={styles.attendanceStatLabel}>Present</Text>
//                         </View>
//                         <View style={[styles.attendanceStatCard, { backgroundColor: "#ffe0e0" }]}>
//                             <Text style={[styles.attendanceStatValue, { color: "#e53e3e" }]}>{attendanceStats.absent}</Text>
//                             <Text style={styles.attendanceStatLabel}>Absent</Text>
//                         </View>
//                         <View style={[styles.attendanceStatCard, { backgroundColor: "#e0f5e9" }]}>
//                             <Text style={[styles.attendanceStatValue, { color: "#38a169" }]}>{attendanceStats.excused}</Text>
//                             <Text style={styles.attendanceStatLabel}>Excused</Text>
//                         </View>
//                         <View style={[styles.attendanceStatCard, { backgroundColor: "#f0f0f0" }]}>
//                             <Text style={[styles.attendanceStatValue, { color: "#718096" }]}>
//                                 {attendanceStats.total > 0
//                                     ? Math.round(((attendanceStats.present + attendanceStats.excused) / attendanceStats.total) * 100)
//                                     : 0}
//                                 %
//                             </Text>
//                             <Text style={styles.attendanceStatLabel}>Rate</Text>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Chart */}
//                 {attendanceData.labels.length > 0 && (
//                     <View style={styles.chartCard}>
//                         <Text style={styles.chartTitle}>Attendance by Course</Text>
//                         <LineChart
//                             data={attendanceData}
//                             width={screenWidth - 40}
//                             height={220}
//                             chartConfig={{
//                                 backgroundColor: "#ffffff",
//                                 backgroundGradientFrom: "#ffffff",
//                                 backgroundGradientTo: "#ffffff",
//                                 decimalPlaces: 0,
//                                 color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
//                                 labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                                 propsForDots: {
//                                     r: "6",
//                                     strokeWidth: "2",
//                                     stroke: "#5c51f3",
//                                 },
//                             }}
//                             bezier
//                             style={styles.chart}
//                         />
//                     </View>
//                 )}

//                 {/* Records */}
//                 <Text style={styles.sectionTitle}>Attendance History</Text>
//                 {attendanceRecords.length > 0 ? (
//                     attendanceRecords
//                         .filter((record) => selectedCourse === "all" || record.courseId === selectedCourse)
//                         .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//                         .map((record, index) => {
//                             const course = courses.find((c) => c._id === record.courseId)
//                             return (
//                                 <View style={styles.attendanceRecord} key={record._id || index}>
//                                     <View style={styles.attendanceRecordHeader}>
//                                         <Text style={styles.attendanceRecordDate}>{formatDate(record.date)}</Text>
//                                         <View style={[styles.courseTag, { backgroundColor: course?.color || "#52c4eb" }]}>
//                                             <Text style={styles.courseTagText}>{course?.code || "Unknown"}</Text>
//                                         </View>
//                                     </View>
//                                     <View style={styles.attendanceRecordStatus}>
//                                         <View
//                                             style={[
//                                                 styles.statusBadge,
//                                                 record.status === "present"
//                                                     ? styles.presentBadge
//                                                     : record.status === "excused"
//                                                         ? styles.excusedBadge
//                                                         : styles.absentBadge,
//                                             ]}
//                                         >
//                                             <Text style={styles.statusBadgeText}>
//                                                 {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
//                                             </Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                             )
//                         })
//                 ) : (
//                     <View style={styles.emptyState}>
//                         <MaterialIcons name="event-busy" size={48} color="#ccc" />
//                         <Text style={styles.emptyStateTitle}>No Attendance Records</Text>
//                         <Text style={styles.emptyStateMessage}>
//                             There are no attendance records available for you at this time.
//                         </Text>
//                     </View>
//                 )}
//             </ScrollView>
//         </SafeAreaView>
//     )
// }

// export default AttendanceAccessScreen
