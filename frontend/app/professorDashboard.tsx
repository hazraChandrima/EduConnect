"use client"

import { useState, useEffect, useContext } from "react"
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	StatusBar,
	Modal,
	TextInput,
	ActivityIndicator,
} from "react-native"
import { Ionicons, FontAwesome, MaterialIcons, AntDesign, Feather } from "@expo/vector-icons"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthContext } from "./context/AuthContext"
import styles from "./styles/ProfessorDashboard.style"
import { useRouter } from "expo-router"
import { IP_ADDRESS, PORT } from "@env"


interface Assignment {
	id: string
	title: string
	status: string
	submissionDate?: string
	dueDate?: string
	grade?: string | null
	feedback?: string
	courseColor?: string
	courseCode?: string
	submissions?: number
	description?: string
	course?: string
}

interface Course {
	id: string
	name: string
	code?: string
	students?: number
	color?: string
	icon?: string
	attendance: number
	grade?: string
	assignments: Assignment[] | number
	averageGrade?: number
}

interface Student {
	id: string
	name: string
	email: string
	courses: Course[]
}

interface AuthContextType {
	logout?: () => Promise<void>
}

interface AttendanceStatus {
	[key: string]: "present" | "absent"
}

const screenWidth = Dimensions.get("window").width

const dummyStudent: Student = {
	id: "S12345",
	name: "Chandrima Hazra",
	email: "chandrima.hazra@university.edu",
	courses: [
		{
			id: "CS101",
			name: "Computer Science 101",
			attendance: 85,
			grade: "B+",
			assignments: [
				{
					id: "A1",
					title: "Algorithm Analysis",
					status: "Submitted",
					submissionDate: "2023-10-15",
					grade: null,
					feedback: "",
				},
				{
					id: "A2",
					title: "Data Structures Implementation",
					status: "Pending",
					dueDate: "2023-11-05",
				},
			],
		},
	],
}

// Dummy courses data
const professorCourses: Course[] = [
	{
		id: "CS101",
		name: "Computer Science 101",
		code: "CS101",
		students: 32,
		color: "#52c4eb",
		icon: "laptop",
		attendance: 85,
		assignments: 3,
		averageGrade: 78,
	},
	{
		id: "PROG201",
		name: "Advanced Programming",
		code: "PROG201",
		students: 24,
		color: "#ff5694",
		icon: "code",
		attendance: 92,
		assignments: 4,
		averageGrade: 82,
	},
	{
		id: "DB301",
		name: "Database Systems",
		code: "DB301",
		students: 22,
		color: "#5c51f3",
		icon: "database",
		attendance: 78,
		assignments: 2,
		averageGrade: 75,
	},
	{
		id: "AI301",
		name: "Artificial Intelligence",
		code: "AI301",
		students: 40,
		color: "#19b8c6",
		icon: "laptop",
		attendance: 89,
		assignments: 1,
		averageGrade: 78,
	},
]

const pendingAssignments: Assignment[] = [
	{
		id: "A1",
		title: "Algorithm Analysis Report",
		course: "CS101",
		courseColor: "#52c4eb",
		courseCode: "CS 101",
		submissions: 12,
		description: "Students submitted reports analyzing the time and space complexity of algorithms.",
		status: "Needs Grading",
	},
	{
		id: "A2",
		title: "Final Project",
		course: "PROG201",
		courseColor: "#ff5694",
		courseCode: "ADV PROG",
		submissions: 8,
		description: "Students submitted their final programming projects with documentation.",
		status: "Needs Grading",
	},
]

const attendanceData = {
	labels: ["CS101", "PROG201", "DB301", "AI301"],
	datasets: [
		{
			data: [85, 92, 78, 87],
			color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
			strokeWidth: 2,
		},
	],
	legend: ["Attendance %"],
}

const gradeDistributionData = {
	labels: ["A", "B", "C", "D", "F"],
	data: [0.25, 0.35, 0.2, 0.15, 0.05],
	colors: ["#52c4eb", "#5c51f3", "#ff9f40", "#ff5694", "#ff4040"],
}

const assignmentCompletionData = {
	labels: ["CS101", "PROG201", "DB301", "AI301"],
	datasets: [
		{
			data: [75, 82, 68, 94],
			color: (opacity = 1) => `rgba(255, 86, 148, ${opacity})`,
		},
	],
}


interface UserData {
	_id: string;
	name: string;
	email: string;
	role: string;
	__v: number;
}

export default function ProfessorDashboard() {
	const [activeTab, setActiveTab] = useState("home")
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
	const [isAssignmentModalVisible, setIsAssignmentModalVisible] = useState(false)
	const [isGradingModalVisible, setIsGradingModalVisible] = useState(false)
	const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false)
	const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
	const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
	const [newAssignment, setNewAssignment] = useState({
		title: "",
		description: "",
		dueDate: "",
		course: "",
	})
	const [gradeInput, setGradeInput] = useState("")
	const [feedbackInput, setFeedbackInput] = useState("")
	const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
	const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({})
	const authContext = useContext(AuthContext);
	const router = useRouter();
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const displayName = userData?.name || "Professor";
	const firstName = displayName.split(" ")[0];



	useEffect(() => {
		const checkAuthAndFetchData = async (): Promise<void> => {
			try {
				setIsLoading(true);

				if (!authContext?.user) {
					console.log("No authenticated user, redirecting to login");
					router.replace("/login");
					return;
				}

				if (authContext.user.role !== "professor") {
					console.log(`User role is ${authContext.user.role}, not authorized for professor dashboard`);
					router.replace(`/${authContext.user.role}Dashboard`)
					return;
				}

				const response = await fetch(`http://${IP_ADDRESS}:${PORT}/api/user/${authContext.user.userId}`);

				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}`);
				}

				const data = await response.json() as UserData;
				if (data && data.name) {
					setUserData(data);
				}
			} catch (error) {
				console.error("Error in ProfessorDashboard:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuthAndFetchData();
	}, [authContext?.user, router]);


	if (isLoading) {
		return (
			<SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
				<ActivityIndicator size="large" color="#5c51f3" />
				<Text style={{ marginTop: 10 }}>Loading...</Text>
			</SafeAreaView>
		);
	}

	if (!authContext?.user || authContext.user.role !== "professor" || !userData) {
		router.replace("/login");
		return <></>;
	}


	const handleLogout = async () => {
		try {
			await authContext?.logout?.()
			router.replace("/login")
		} catch (error) {
			console.error("Logout error:", error)
		}
	}

	const handleCreateAssignment = () => {
		if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate || !newAssignment.course) {
			return
		}
		setIsLoading(true)
		setIsLoading(false)
		setIsAssignmentModalVisible(false)
		setNewAssignment({
			title: "",
			description: "",
			dueDate: "",
			course: "",
		})
	}

	const handleGradeSubmission = () => {
		if (!gradeInput) {
			return
		}
		setIsLoading(true)
		setIsLoading(false)
		setIsGradingModalVisible(false)
		setGradeInput("")
		setFeedbackInput("")
	}

	const handleSaveAttendance = () => {
		setIsLoading(true)
		setIsLoading(false)
		setIsAttendanceModalVisible(false)
		setAttendanceStatus({})
	}


	
	const renderHomeTab = () => (
		<>
			{/* Welcome Banner */}
			<View style={styles.welcomeBanner}>
				<Text style={styles.welcomeTitle}>Hello, Dr. {firstName}</Text>
				<Text style={styles.welcomeSubtitle}>Welcome back to your professor dashboard</Text>

				<View style={styles.statsContainer}>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>3</Text>
						<Text style={styles.statLabel}>Courses</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>78</Text>
						<Text style={styles.statLabel}>Students</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>9</Text>
						<Text style={styles.statLabel}>Assignments</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>85%</Text>
						<Text style={styles.statLabel}>Avg. Attendance</Text>
					</View>
				</View>
			</View>

			{/* Charts Section */}
			<View style={styles.sectionContainer}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Course Analytics</Text>
				</View>

				<ScrollView horizontal showsHorizontalScrollIndicator={true}>
					<View style={styles.chartCard}>
						<Text style={styles.chartTitle}>Attendance by Course</Text>
						<LineChart
							data={attendanceData}
							width={screenWidth - 40}
							height={220}
							chartConfig={{
								backgroundColor: "#ffffff",
								backgroundGradientFrom: "#ffffff",
								backgroundGradientTo: "#ffffff",
								decimalPlaces: 0,
								color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
								labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
								style: {
									borderRadius: 16,
								},
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
				</ScrollView>



				<ScrollView horizontal showsHorizontalScrollIndicator={true}>
					<View style={styles.chartCard}>
						<Text style={styles.chartTitle}>Grade Distribution</Text>
						<PieChart
							data={gradeDistributionData.labels.map((label, index) => ({
								name: label,
								population: gradeDistributionData.data[index] * 100,
								color: gradeDistributionData.colors[index],
								legendFontColor: "#7F7F7F",
								legendFontSize: 12,
							}))}
							width={screenWidth - 40}
							height={220}
							chartConfig={{
								backgroundColor: "#ffffff",
								backgroundGradientFrom: "#ffffff",
								backgroundGradientTo: "#ffffff",
								color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
							}}
							accessor="population"
							backgroundColor="transparent"
							paddingLeft="15"
							absolute
						/>

					</View>
				</ScrollView>


				<ScrollView horizontal showsHorizontalScrollIndicator={true}>

					<View style={styles.chartCard}>
						<Text style={styles.chartTitle}>Assignment Completion Rate (%)</Text>
						<BarChart
							data={assignmentCompletionData}
							width={screenWidth - 40}
							height={220}
							yAxisLabel=""
							yAxisSuffix="%"
							chartConfig={{
								backgroundColor: "#ffffff",
								backgroundGradientFrom: "#ffffff",
								backgroundGradientTo: "#ffffff",
								decimalPlaces: 0,
								color: (opacity = 1) => `rgba(255, 86, 148, ${opacity})`,
								labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
								style: {
									borderRadius: 16,
								},
								barPercentage: 0.7,
							}}
							style={styles.chart}
						/>
					</View>
				</ScrollView>
			</View>

			{/* Courses Section */}
			<View style={styles.sectionContainer}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Your Courses</Text>
					<TouchableOpacity onPress={() => setActiveTab("courses")}>
						<Text style={styles.viewAllText}>View All</Text>
					</TouchableOpacity>
				</View>

				{/* Course Items */}
				{professorCourses.map((course) => (
					<TouchableOpacity
						key={course.id}
						style={styles.courseItem}
						onPress={() => {
							setSelectedCourse(course)
							setActiveTab("courses")
						}}
					>
						<View style={[styles.courseIcon, { backgroundColor: course.color }]}>
							<FontAwesome name={course.icon as any} size={24} color="white" />
						</View>
						<View style={styles.courseDetails}>
							<Text style={styles.courseTitle}>{course.name}</Text>
							<View style={styles.studentsContainer}>
								<Ionicons name="people" size={16} color="#777" />
								<Text style={styles.studentsText}>{course.students} Students</Text>
							</View>
						</View>
						<Ionicons name="chevron-forward" size={24} color="#ccc" />
					</TouchableOpacity>
				))}
			</View>

			{/* Pending Assignments Section */}
			<View style={styles.sectionContainer}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Pending Assignments</Text>
					<TouchableOpacity onPress={() => setActiveTab("grading")}>
						<Text style={styles.viewAllText}>View All</Text>
					</TouchableOpacity>
				</View>

				{/* Assignment Items */}
				{pendingAssignments.map((assignment) => (
					<View key={assignment.id} style={styles.assignmentItem}>
						<View style={styles.assignmentHeader}>
							<View style={[styles.courseTag, { backgroundColor: assignment.courseColor }]}>
								<Text style={styles.courseTagText}>{assignment.courseCode}</Text>
							</View>
							<Text style={styles.submissionsText}>{assignment.submissions} Submissions</Text>
						</View>
						<Text style={styles.assignmentTitle}>{assignment.title}</Text>
						<Text style={styles.assignmentDescription}>{assignment.description}</Text>
						<View style={styles.assignmentFooter}>
							<View style={styles.statusBadge}>
								<Text style={styles.statusText}>{assignment.status}</Text>
							</View>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={() => {
									setSelectedAssignment(assignment)
									setIsGradingModalVisible(true)
								}}
							>
								<Text style={styles.actionButtonText}>Grade Now</Text>
							</TouchableOpacity>
						</View>
					</View>
				))}

				<TouchableOpacity style={styles.createButton} onPress={() => setIsAssignmentModalVisible(true)}>
					<AntDesign name="plus" size={20} color="white" />
					<Text style={styles.createButtonText}>Create New Assignment</Text>
				</TouchableOpacity>
			</View>
		</>
	)

	const renderCoursesTab = () => (
		<>
			<View style={styles.tabHeader}>
				<Text style={styles.tabTitle}>Your Courses</Text>
				<TouchableOpacity style={styles.addButton}>
					<AntDesign name="plus" size={20} color="white" />
				</TouchableOpacity>
			</View>

			{selectedCourse ? (
				<View style={styles.courseDetailContainer}>
					<TouchableOpacity style={styles.backButton} onPress={() => setSelectedCourse(null)}>
						<Ionicons name="arrow-back" size={24} color="#4252e5" />
						<Text style={styles.backButtonText}>Back to Courses</Text>
					</TouchableOpacity>

					<View style={[styles.courseHeader, { backgroundColor: selectedCourse.color }]}>
						<FontAwesome name={selectedCourse.icon as any} size={32} color="white" />
						<View style={styles.courseHeaderInfo}>
							<Text style={styles.courseHeaderTitle}>{selectedCourse.name}</Text>
							<Text style={styles.courseHeaderCode}>{selectedCourse.code}</Text>
						</View>
					</View>

					<View style={styles.courseStats}>
						<View style={styles.courseStat}>
							<Text style={styles.courseStatValue}>{selectedCourse.students}</Text>
							<Text style={styles.courseStatLabel}>Students</Text>
						</View>
						<View style={styles.courseStat}>
							<Text style={styles.courseStatValue}>{selectedCourse.attendance}%</Text>
							<Text style={styles.courseStatLabel}>Attendance</Text>
						</View>
						<View style={styles.courseStat}>
							<Text style={styles.courseStatValue}>
								{typeof selectedCourse.assignments === "number"
									? selectedCourse.assignments
									: selectedCourse.assignments.length}
							</Text>
							<Text style={styles.courseStatLabel}>Assignments</Text>
						</View>
						<View style={styles.courseStat}>
							<Text style={styles.courseStatValue}>{selectedCourse.averageGrade}%</Text>
							<Text style={styles.courseStatLabel}>Avg. Grade</Text>
						</View>
					</View>

					<View style={styles.courseActions}>
						<TouchableOpacity style={styles.courseAction} onPress={() => setIsAttendanceModalVisible(true)}>
							<MaterialIcons name="date-range" size={24} color="#4252e5" />
							<Text style={styles.courseActionText}>Take Attendance</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.courseAction} onPress={() => setIsAssignmentModalVisible(true)}>
							<MaterialIcons name="assignment" size={24} color="#4252e5" />
							<Text style={styles.courseActionText}>Create Assignment</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.courseAction}>
							<MaterialIcons name="grading" size={24} color="#4252e5" />
							<Text style={styles.courseActionText}>Grade Assignments</Text>
						</TouchableOpacity>
					</View>

					<Text style={styles.sectionTitle}>Students</Text>
					<TouchableOpacity
						style={styles.studentItem}
						onPress={() => {
							setSelectedStudent(dummyStudent)
							setActiveTab("students")
						}}
					>
						<View style={styles.studentAvatar}>
							<Ionicons name="person" size={24} color="white" />
						</View>
						<View style={styles.studentInfo}>
							<Text style={styles.studentName}>{dummyStudent.name}</Text>
							<Text style={styles.studentEmail}>{dummyStudent.email}</Text>
						</View>
						<Ionicons name="chevron-forward" size={24} color="#ccc" />
					</TouchableOpacity>
				</View>
			) : (
				<>
					<View style={styles.courseFilters}>
						<TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
							<Text style={styles.activeFilterText}>All Courses</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.filterButton}>
							<Text style={styles.filterText}>Active</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.filterButton}>
							<Text style={styles.filterText}>Archived</Text>
						</TouchableOpacity>
					</View>

					{professorCourses.map((course) => (
						<TouchableOpacity key={course.id} style={styles.courseCard} onPress={() => setSelectedCourse(course)}>
							<View style={[styles.courseCardHeader, { backgroundColor: course.color }]}>
								<FontAwesome name={course.icon as any} size={24} color="white" />
								<Text style={styles.courseCardCode}>{course.code}</Text>
							</View>
							<View style={styles.courseCardBody}>
								<Text style={styles.courseCardTitle}>{course.name}</Text>
								<View style={styles.courseCardStats}>
									<View style={styles.courseCardStat}>
										<Ionicons name="people" size={16} color="#777" />
										<Text style={styles.courseCardStatText}>{course.students} Students</Text>
									</View>
									<View style={styles.courseCardStat}>
										<MaterialIcons name="assignment" size={16} color="#777" />
										<Text style={styles.courseCardStatText}>
											{typeof course.assignments === "number" ? course.assignments : course.assignments.length}{" "}
											Assignments
										</Text>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					))}
				</>
			)}
		</>
	)

	const renderAttendanceTab = () => (
		<>
			<View style={styles.tabHeader}>
				<Text style={styles.tabTitle}>Attendance Management</Text>
			</View>

			<View style={styles.attendanceFilters}>
				<TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
					<Text style={styles.activeFilterText}>All Courses</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.filterButton}>
					<Text style={styles.filterText}>CS101</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.filterButton}>
					<Text style={styles.filterText}>PROG201</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.filterButton}>
					<Text style={styles.filterText}>DB301</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.attendanceActions}>
				<TouchableOpacity style={styles.attendanceAction} onPress={() => setIsAttendanceModalVisible(true)}>
					<MaterialIcons name="add" size={24} color="#4252e5" />
					<Text style={styles.attendanceActionText}>Take Attendance</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.attendanceAction}>
					<MaterialIcons name="history" size={24} color="#4252e5" />
					<Text style={styles.attendanceActionText}>View History</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.chartCard}>
				<Text style={styles.chartTitle}>Attendance Trends</Text>
				<LineChart
					data={attendanceData}
					width={screenWidth - 40}
					height={220}
					chartConfig={{
						backgroundColor: "#ffffff",
						backgroundGradientFrom: "#ffffff",
						backgroundGradientTo: "#ffffff",
						decimalPlaces: 0,
						color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
						style: {
							borderRadius: 16,
						},
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

			<Text style={styles.sectionTitle}>Recent Attendance Records</Text>

			<View style={styles.attendanceRecord}>
				<View style={styles.attendanceRecordHeader}>
					<Text style={styles.attendanceRecordDate}>October 25, 2023</Text>
					<View style={[styles.courseTag, { backgroundColor: "#52c4eb" }]}>
						<Text style={styles.courseTagText}>CS101</Text>
					</View>
				</View>
				<View style={styles.attendanceStats}>
					<View style={styles.attendanceStat}>
						<Text style={styles.attendanceStatValue}>28</Text>
						<Text style={styles.attendanceStatLabel}>Present</Text>
					</View>
					<View style={styles.attendanceStat}>
						<Text style={styles.attendanceStatValue}>4</Text>
						<Text style={styles.attendanceStatLabel}>Absent</Text>
					</View>
					<View style={styles.attendanceStat}>
						<Text style={styles.attendanceStatValue}>87.5%</Text>
						<Text style={styles.attendanceStatLabel}>Attendance Rate</Text>
					</View>
				</View>
			</View>

			<View style={styles.attendanceRecord}>
				<View style={styles.attendanceRecordHeader}>
					<Text style={styles.attendanceRecordDate}>October 23, 2023</Text>
					<View style={[styles.courseTag, { backgroundColor: "#ff5694" }]}>
						<Text style={styles.courseTagText}>PROG201</Text>
					</View>
				</View>
				<View style={styles.attendanceStats}>
					<View style={styles.attendanceStat}>
						<Text style={styles.attendanceStatValue}>22</Text>
						<Text style={styles.attendanceStatLabel}>Present</Text>
					</View>
					<View style={styles.attendanceStat}>
						<Text style={styles.attendanceStatValue}>2</Text>
						<Text style={styles.attendanceStatLabel}>Absent</Text>
					</View>
					<View style={styles.attendanceStat}>
						<Text style={styles.attendanceStatValue}>91.7%</Text>
						<Text style={styles.attendanceStatLabel}>Attendance Rate</Text>
					</View>
				</View>
			</View>
		</>
	)

	const renderGradingTab = () => (
		<>
			<View style={styles.tabHeader}>
				<Text style={styles.tabTitle}>Assignment Grading</Text>
			</View>

			<View style={styles.gradingFilters}>
				<TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
					<Text style={styles.activeFilterText}>Needs Grading</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.filterButton}>
					<Text style={styles.filterText}>Graded</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.filterButton}>
					<Text style={styles.filterText}>All</Text>
				</TouchableOpacity>
			</View>

			{pendingAssignments.map((assignment) => (
				<View key={assignment.id} style={styles.gradingItem}>
					<View style={styles.gradingItemHeader}>
						<View style={[styles.courseTag, { backgroundColor: assignment.courseColor }]}>
							<Text style={styles.courseTagText}>{assignment.courseCode}</Text>
						</View>
						<Text style={styles.submissionsText}>{assignment.submissions} Submissions</Text>
					</View>
					<Text style={styles.gradingItemTitle}>{assignment.title}</Text>
					<Text style={styles.gradingItemDescription}>{assignment.description}</Text>
					<View style={styles.gradingItemFooter}>
						<View style={styles.statusBadge}>
							<Text style={styles.statusText}>{assignment.status}</Text>
						</View>
						<TouchableOpacity
							style={styles.gradingButton}
							onPress={() => {
								setSelectedAssignment(assignment)
								setIsGradingModalVisible(true)
							}}
						>
							<MaterialIcons name="grading" size={20} color="white" />
							<Text style={styles.gradingButtonText}>Grade Submissions</Text>
						</TouchableOpacity>
					</View>
				</View>
			))}

			<TouchableOpacity style={styles.createButton} onPress={() => setIsAssignmentModalVisible(true)}>
				<AntDesign name="plus" size={20} color="white" />
				<Text style={styles.createButtonText}>Create New Assignment</Text>
			</TouchableOpacity>
		</>
	)

	const renderStudentsTab = () => (
		<>
			<View style={styles.tabHeader}>
				<Text style={styles.tabTitle}>Students</Text>
			</View>

			{selectedStudent ? (
				<View style={styles.studentDetailContainer}>
					<TouchableOpacity style={styles.backButton} onPress={() => setSelectedStudent(null)}>
						<Ionicons name="arrow-back" size={24} color="#4252e5" />
						<Text style={styles.backButtonText}>Back to Students</Text>
					</TouchableOpacity>

					<View style={styles.studentProfile}>
						<View style={styles.studentProfileAvatar}>
							<Ionicons name="person" size={40} color="white" />
						</View>
						<Text style={styles.studentProfileName}>{selectedStudent.name}</Text>
						<Text style={styles.studentProfileId}>ID: {selectedStudent.id}</Text>
						<Text style={styles.studentProfileEmail}>{selectedStudent.email}</Text>
					</View>

					<View style={styles.studentCoursePerformance}>
						<Text style={styles.sectionTitle}>Course Performance</Text>

						{selectedStudent.courses.map((course) => (
							<View key={course.id} style={styles.studentCourseItem}>
								<View style={styles.studentCourseHeader}>
									<Text style={styles.studentCourseTitle}>{course.name}</Text>
									<View style={styles.studentCourseGrade}>
										<Text style={styles.studentCourseGradeText}>{course.grade}</Text>
									</View>
								</View>

								<View style={styles.studentCourseStat}>
									<Text style={styles.studentCourseStatLabel}>Attendance:</Text>
									<View style={styles.progressBar}>
										<View style={[styles.progressFill, { width: `${course.attendance}%` }]} />
									</View>
									<Text style={styles.studentCourseStatValue}>{course.attendance}%</Text>
								</View>

								<Text style={styles.assignmentsHeader}>Assignments</Text>
								{Array.isArray(course.assignments) &&
									course.assignments.map((assignment) => (
										<View key={assignment.id} style={styles.studentAssignmentItem}>
											<View style={styles.studentAssignmentHeader}>
												<Text style={styles.studentAssignmentTitle}>{assignment.title}</Text>
												<Text style={styles.studentAssignmentStatus}>{assignment.status}</Text>
											</View>

											{assignment.status === "Submitted" ? (
												<View style={styles.studentAssignmentGrading}>
													<Text style={styles.studentAssignmentLabel}>Grade:</Text>
													{assignment.grade ? (
														<Text style={styles.studentAssignmentGrade}>{assignment.grade}</Text>
													) : (
														<TouchableOpacity
															style={styles.gradeButton}
															onPress={() => {
																setSelectedAssignment(assignment)
																setIsGradingModalVisible(true)
															}}
														>
															<Text style={styles.gradeButtonText}>Grade Now</Text>
														</TouchableOpacity>
													)}
												</View>
											) : (
												<Text style={styles.studentAssignmentDueDate}>Due: {assignment.dueDate}</Text>
											)}
										</View>
									))}
							</View>
						))}
					</View>
				</View>
			) : (
				<>
					<View style={styles.studentFilters}>
						<TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
							<Text style={styles.activeFilterText}>All Students</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.filterButton}>
							<Text style={styles.filterText}>CS101</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.filterButton}>
							<Text style={styles.filterText}>PROG201</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.filterButton}>
							<Text style={styles.filterText}>DB301</Text>
						</TouchableOpacity>
					</View>

					<TouchableOpacity style={styles.studentItem} onPress={() => setSelectedStudent(dummyStudent)}>
						<View style={styles.studentAvatar}>
							<Ionicons name="person" size={24} color="white" />
						</View>
						<View style={styles.studentInfo}>
							<Text style={styles.studentName}>{dummyStudent.name}</Text>
							<Text style={styles.studentEmail}>{dummyStudent.email}</Text>
						</View>
						<Ionicons name="chevron-forward" size={24} color="#ccc" />
					</TouchableOpacity>
				</>
			)}
		</>
	)

	// Create Assignment Modal
	const renderAssignmentModal = () => (
		<Modal
			visible={isAssignmentModalVisible}
			animationType="slide"
			transparent={true}
			onRequestClose={() => setIsAssignmentModalVisible(false)}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Create New Assignment</Text>
						<TouchableOpacity onPress={() => setIsAssignmentModalVisible(false)}>
							<AntDesign name="close" size={24} color="#333" />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						<Text style={styles.inputLabel}>Assignment Title</Text>
						<TextInput
							style={styles.textInput}
							placeholder="Enter assignment title"
							value={newAssignment.title}
							onChangeText={(text) => setNewAssignment({ ...newAssignment, title: text })}
						/>

						<Text style={styles.inputLabel}>Description</Text>
						<TextInput
							style={[styles.textInput, styles.textArea]}
							placeholder="Enter assignment description"
							multiline={true}
							numberOfLines={4}
							value={newAssignment.description}
							onChangeText={(text) => setNewAssignment({ ...newAssignment, description: text })}
						/>

						<Text style={styles.inputLabel}>Due Date</Text>
						<TextInput
							style={styles.textInput}
							placeholder="YYYY-MM-DD"
							value={newAssignment.dueDate}
							onChangeText={(text) => setNewAssignment({ ...newAssignment, dueDate: text })}
						/>

						<Text style={styles.inputLabel}>Course</Text>
						<View style={styles.pickerContainer}>
							{professorCourses.map((course) => (
								<TouchableOpacity
									key={course.id}
									style={[styles.courseOption, newAssignment.course === course.id && styles.selectedCourseOption]}
									onPress={() => setNewAssignment({ ...newAssignment, course: course.id })}
								>
									<Text
										style={[
											styles.courseOptionText,
											newAssignment.course === course.id && styles.selectedCourseOptionText,
										]}
									>
										{course.name}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						<TouchableOpacity style={styles.submitButton} onPress={handleCreateAssignment} disabled={isLoading}>
							{isLoading ? (
								<ActivityIndicator color="white" />
							) : (
								<Text style={styles.submitButtonText}>Create Assignment</Text>
							)}
						</TouchableOpacity>
					</ScrollView>
				</View>
			</View>
		</Modal>
	)

	// Grading Modal
	const renderGradingModal = () => (
		<Modal
			visible={isGradingModalVisible}
			animationType="slide"
			transparent={true}
			onRequestClose={() => setIsGradingModalVisible(false)}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Grade Assignment</Text>
						<TouchableOpacity onPress={() => setIsGradingModalVisible(false)}>
							<AntDesign name="close" size={24} color="#333" />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						{selectedAssignment && (
							<>
								<View style={styles.gradingAssignmentInfo}>
									<Text style={styles.gradingAssignmentTitle}>{selectedAssignment.title}</Text>
									<View style={[styles.courseTag, { backgroundColor: selectedAssignment.courseColor }]}>
										<Text style={styles.courseTagText}>{selectedAssignment.courseCode}</Text>
									</View>
								</View>

								<Text style={styles.gradingStudentName}>Student: {dummyStudent.name}</Text>

								<Text style={styles.inputLabel}>Grade (0-100)</Text>
								<TextInput
									style={styles.textInput}
									placeholder="Enter grade"
									keyboardType="numeric"
									value={gradeInput}
									onChangeText={setGradeInput}
								/>

								<Text style={styles.inputLabel}>Feedback</Text>
								<TextInput
									style={[styles.textInput, styles.textArea]}
									placeholder="Enter feedback for student"
									multiline={true}
									numberOfLines={4}
									value={feedbackInput}
									onChangeText={setFeedbackInput}
								/>

								<TouchableOpacity style={styles.submitButton} onPress={handleGradeSubmission} disabled={isLoading}>
									{isLoading ? (
										<ActivityIndicator color="white" />
									) : (
										<Text style={styles.submitButtonText}>Submit Grade</Text>
									)}
								</TouchableOpacity>
							</>
						)}
					</ScrollView>
				</View>
			</View>
		</Modal>
	)

	// Attendance Modal
	const renderAttendanceModal = () => (
		<Modal
			visible={isAttendanceModalVisible}
			animationType="slide"
			transparent={true}
			onRequestClose={() => setIsAttendanceModalVisible(false)}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
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
							{professorCourses.map((course) => (
								<TouchableOpacity
									key={course.id}
									style={[styles.courseOption, selectedCourse?.id === course.id && styles.selectedCourseOption]}
									onPress={() => setSelectedCourse(course)}
								>
									<Text
										style={[
											styles.courseOptionText,
											selectedCourse?.id === course.id && styles.selectedCourseOptionText,
										]}
									>
										{course.name}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						<Text style={styles.inputLabel}>Students</Text>
						<View style={styles.attendanceList}>
							<View style={styles.attendanceListItem}>
								<View style={styles.attendanceStudentInfo}>
									<View style={styles.studentAvatar}>
										<Ionicons name="person" size={20} color="white" />
									</View>
									<Text style={styles.attendanceStudentName}>{dummyStudent.name}</Text>
								</View>
								<View style={styles.attendanceOptions}>
									<TouchableOpacity
										style={[
											styles.attendanceOption,
											attendanceStatus[dummyStudent.id] === "present" && styles.presentOption,
										]}
										onPress={() => setAttendanceStatus({ ...attendanceStatus, [dummyStudent.id]: "present" })}
									>
										<Feather
											name="check"
											size={20}
											color={attendanceStatus[dummyStudent.id] === "present" ? "white" : "#4252e5"}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.attendanceOption,
											attendanceStatus[dummyStudent.id] === "absent" && styles.absentOption,
										]}
										onPress={() => setAttendanceStatus({ ...attendanceStatus, [dummyStudent.id]: "absent" })}
									>
										<Feather
											name="x"
											size={20}
											color={attendanceStatus[dummyStudent.id] === "absent" ? "white" : "#ff5694"}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>

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
	)

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor="#4252e5" barStyle="light-content" />

			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.logo}>EduConnect</Text>
				<View style={styles.profileContainer}>
					<TouchableOpacity
						style={styles.profileButton}
						onPress={() => setIsProfileMenuVisible(!isProfileMenuVisible)}
					>
						<View style={styles.profilePic}>
							<Ionicons name="person" size={24} color="white" />
						</View>
						<Text style={styles.profileName}>Dr. {firstName}</Text>
						<Ionicons
							name={isProfileMenuVisible ? "chevron-up" : "chevron-down"}
							size={16}
							color="white"
							style={{ marginLeft: 4 }}
						/>
					</TouchableOpacity>

					{isProfileMenuVisible && (
						<View style={styles.profileDropdown}>
							<TouchableOpacity
								style={styles.profileMenuItem}
								onPress={handleLogout}
							>
								<Ionicons name="log-out-outline" size={20} color="#333" />
								<Text style={styles.profileMenuItemText}>Logout</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>

			<ScrollView style={styles.scrollView}>
				{activeTab === "home" && renderHomeTab()}
				{activeTab === "courses" && renderCoursesTab()}
				{activeTab === "attendance" && renderAttendanceTab()}
				{activeTab === "grading" && renderGradingTab()}
				{activeTab === "students" && renderStudentsTab()}
			</ScrollView>

			{/* Navigation Bar */}
			<View style={styles.navigationBar}>
				<TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
					<Ionicons name="home" size={24} color={activeTab === "home" ? "#5c51f3" : "#777"} />
					<Text style={[styles.navText, activeTab === "home" && styles.navActive]}>Home</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("courses")}>
					<MaterialIcons name="library-books" size={24} color={activeTab === "courses" ? "#5c51f3" : "#777"} />
					<Text style={[styles.navText, activeTab === "courses" && styles.navActive]}>Courses</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("attendance")}>
					<MaterialIcons name="date-range" size={24} color={activeTab === "attendance" ? "#5c51f3" : "#777"} />
					<Text style={[styles.navText, activeTab === "attendance" && styles.navActive]}>Attendance</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("grading")}>
					<MaterialIcons name="grading" size={24} color={activeTab === "grading" ? "#5c51f3" : "#777"} />
					<Text style={[styles.navText, activeTab === "grading" && styles.navActive]}>Grading</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("students")}>
					<Ionicons name="people" size={24} color={activeTab === "students" ? "#5c51f3" : "#777"} />
					<Text style={[styles.navText, activeTab === "students" && styles.navActive]}>Students</Text>
				</TouchableOpacity>
			</View>

			{/* Modals */}
			{renderAssignmentModal()}
			{renderGradingModal()}
			{renderAttendanceModal()}
		</SafeAreaView>
	)
}