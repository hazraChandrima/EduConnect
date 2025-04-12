"use client"

import type React from "react"
import { useState, useEffect, useContext } from "react"
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	useWindowDimensions,
	SafeAreaView,
	ActivityIndicator,
} from "react-native"
import { BarChart } from "react-native-chart-kit"
import { Ionicons } from "@expo/vector-icons"
import styles from "../../styles/AcademicAnalytics.style"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"
import { AuthContext } from "../../context/AuthContext"
import { APP_CONFIG } from "@/app-config"
import { useToken } from "@/app/hooks/useToken"
import GPAChart from "./GpaChart"
import GradeDistributionChart from "./GradeDistributionChart"
import AttendanceChartView from "./AttendanceChart"
import MarksAnalyticsView from "./MarksChart"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

const ensureSafeData = (data: number[]): number[] => {
	return data.map((value) => {
		if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
			return 0
		}
		return value
	})
}

const ensureMinimumDataLength = (data: number[], minLength = 2): number[] => {
	if (!data || data.length === 0) return new Array(minLength).fill(0)
	if (data.length === 1) return [...data, ...new Array(minLength - 1).fill(data[0])]
	return data
}

type TabType = "performance" | "attendance" | "marks" | "curriculum"

interface TabItem {
	id: TabType
	label: string
	icon: keyof typeof Ionicons.glyphMap
}

interface GradeDistributionItem {
	name: string
	population: number
	color: string
	legendFontColor: string
	legendFontSize: number
}

interface MarkItem {
	_id: string
	courseId: string
	title: string
	score: number
	maxScore: number
	type: string
	feedback?: string
	courseName?: string
	courseCode?: string
	color?: string
}

interface Unit {
	_id: string
	title: string
	topics: string[]
	resources: string[]
}

interface CurriculumItem {
	_id: string
	courseId: string
	title: string
	description: string
	units: Unit[]
	courseName?: string
	courseCode?: string
	color?: string
}

interface Course {
	_id: string
	code: string
	title: string
	color: string
	icon: string
	progress: number
	professor: {
		_id: string
		name: string
	}
}

interface Attendance {
	_id: string
	courseId: string
	date: string
	status: "present" | "absent" | "excused"
	courseName?: string
	courseCode?: string
}

interface AcademicAnalyticsProps {
	userId: string
}

const AcademicAnalytics: React.FC<AcademicAnalyticsProps> = ({ userId }) => {
	const [activeTab, setActiveTab] = useState<TabType>("performance")
	const { width } = useWindowDimensions()
	const auth = useContext(AuthContext)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isOffline, setIsOffline] = useState<boolean>(false)

	const [courses, setCourses] = useState<Course[]>([])
	const [marks, setMarks] = useState<MarkItem[]>([])
	const [attendance, setAttendance] = useState<Attendance[]>([])
	const [curriculum, setCurriculum] = useState<CurriculumItem[]>([])

	const { token } = useToken()

	const [gradeDistribution, setGradeDistribution] = useState<GradeDistributionItem[]>([])

	// Responsive layout helpers
	const isDesktop = width >= 1024
	const isTablet = width >= 768 && width < 1024

	// Attendance data
	const [attendanceData, setAttendanceData] = useState<{
		labels: string[]
		data: number[]
	}>({
		labels: [],
		data: [],
	})

	// Subject performance data
	const [subjectPerformanceData, setSubjectPerformanceData] = useState<{
		labels: string[]
		datasets: { data: number[] }[]
	}>({
		labels: [],
		datasets: [{ data: [] }],
	})

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setIsOffline(!state.isConnected)
		})
		return () => unsubscribe()
	}, [])

	useEffect(() => {
		let isMounted = true

		const fetchData = async () => {
			if (!auth?.user?.userId) {
				console.log("No user ID available")
				setIsLoading(false)
				return
			}

			setIsLoading(true)
			try {
				const userId = auth.user.userId
				console.log(token, userId)

				let coursesData: Course[] = []

				try {
					if (!token) {
						throw new Error("No token available")
					}

					const coursesResponse = await fetch(`${API_BASE_URL}/api/courses/student/${userId}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					})

					if (coursesResponse.ok) {
						coursesData = await coursesResponse.json()
						if (isMounted) {
							setCourses(coursesData)
						}
						await AsyncStorage.setItem("academicAnalyticsCourses", JSON.stringify(coursesData))
					}
				} catch (error) {
					console.error("Error fetching courses:", error)
					try {
						const cachedCourses = await AsyncStorage.getItem("academicAnalyticsCourses")
						if (cachedCourses) {
							coursesData = JSON.parse(cachedCourses)
							if (isMounted) {
								setCourses(coursesData)
							}
						}
					} catch (storageError) {
						console.error("Error reading from storage:", storageError)
					}
				}

				// Fetch marks
				let marksData: MarkItem[] = []
				try {
					if (!token) {
						throw new Error("No token available")
					}

					const marksResponse = await fetch(`${API_BASE_URL}/api/marks/student/${userId}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					})

					if (marksResponse.ok) {
						marksData = await marksResponse.json()

						const enrichedMarks = marksData.map((mark) => {
							const course = coursesData.find((c) => c._id === mark.courseId)
							return {
								...mark,
								courseName: course?.title || "Unknown Course",
								courseCode: course?.code || "N/A",
								color: course?.color || "#5c51f3",
							}
						})

						if (isMounted) {
							setMarks(enrichedMarks)
						}
						await AsyncStorage.setItem("academicAnalyticsMarks", JSON.stringify(enrichedMarks))
						processMarksData(enrichedMarks, coursesData)
					}
				} catch (error) {
					console.error("Error fetching marks:", error)
					try {
						const cachedMarks = await AsyncStorage.getItem("academicAnalyticsMarks")
						if (cachedMarks) {
							const parsedMarks = JSON.parse(cachedMarks)
							if (isMounted) {
								setMarks(parsedMarks)
							}
							processMarksData(parsedMarks, coursesData)
						}
					} catch (storageError) {
						console.error("Error reading from storage:", storageError)
					}
				}

				// Fetch attendance
				let attendanceData: Attendance[] = []
				try {
					if (!token) {
						throw new Error("No token available")
					}

					const attendanceResponse = await fetch(`${API_BASE_URL}/api/attendance/student/${userId}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					})

					if (attendanceResponse.ok) {
						attendanceData = await attendanceResponse.json()

						const enrichedAttendance = attendanceData.map((record) => {
							const course = coursesData.find((c) => c._id === record.courseId)
							return {
								...record,
								courseName: course?.title || "Unknown Course",
								courseCode: course?.code || "N/A",
							}
						})

						if (isMounted) {
							setAttendance(enrichedAttendance)
						}
						await AsyncStorage.setItem("academicAnalyticsAttendance", JSON.stringify(enrichedAttendance))
						processAttendanceData(enrichedAttendance, coursesData)
					}
				} catch (error) {
					console.error("Error fetching attendance:", error)
					try {
						const cachedAttendance = await AsyncStorage.getItem("academicAnalyticsAttendance")
						if (cachedAttendance) {
							const parsedAttendance = JSON.parse(cachedAttendance)
							if (isMounted) {
								setAttendance(parsedAttendance)
							}
							processAttendanceData(parsedAttendance, coursesData)
						}
					} catch (storageError) {
						console.error("Error reading from storage:", storageError)
					}
				}

				// Fetch curriculum
				try {
					if (coursesData.length > 0) {
						const curriculumPromises = coursesData.map(
							(course) =>
								fetch(`${API_BASE_URL}/api/curriculum/course/${course._id}`, {
									headers: {
										Authorization: `Bearer ${token}`,
									},
								})
									.then((res) => (res.ok ? res.json() : []))
									.catch(() => []), // Return empty array for any failed requests
						)

						const curriculumResults = await Promise.all(curriculumPromises)
						const allCurriculum = curriculumResults.flat()

						// Enrich curriculum with course information
						const enrichedCurriculum = allCurriculum.map((item) => {
							const course = coursesData.find((c) => c._id === item.courseId)
							return {
								...item,
								courseName: course?.title || "Unknown Course",
								courseCode: course?.code || "N/A",
								color: course?.color || "#5c51f3",
							}
						})

						if (isMounted) {
							setCurriculum(enrichedCurriculum)
						}
						await AsyncStorage.setItem("academicAnalyticsCurriculum", JSON.stringify(enrichedCurriculum))
					}
				} catch (error) {
					console.error("Error fetching curriculum:", error)
					try {
						const cachedCurriculum = await AsyncStorage.getItem("academicAnalyticsCurriculum")
						if (cachedCurriculum && isMounted) {
							setCurriculum(JSON.parse(cachedCurriculum))
						}
					} catch (storageError) {
						console.error("Error reading from storage:", storageError)
					}
				}
			} catch (error) {
				console.error("Error fetching academic analytics data:", error)
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		fetchData()

		return () => {
			isMounted = false
		}
	}, [auth, token, auth?.user?.userId])

	const processMarksData = (marksData: MarkItem[], coursesData: Course[]) => {
		// Process grade distribution
		const gradeCount = {
			A: 0,
			B: 0,
			C: 0,
			D: 0,
			F: 0,
		}

		marksData.forEach((mark) => {
			if (mark.score != null && mark.maxScore && mark.maxScore > 0) {
				const percentage = (mark.score / mark.maxScore) * 100
				if (percentage >= 90) gradeCount.A++
				else if (percentage >= 80) gradeCount.B++
				else if (percentage >= 70) gradeCount.C++
				else if (percentage >= 60) gradeCount.D++
				else gradeCount.F++
			}
		})

		// Ensure at least one grade exists to prevent empty charts
		if (Object.values(gradeCount).reduce((a, b) => a + b, 0) === 0) {
			gradeCount.A = 1 // Add a default grade if no grades exist
		}

		setGradeDistribution([
			{
				name: "A",
				population: gradeCount.A,
				color: "#5c51f3",
				legendFontColor: "#7F7F7F",
				legendFontSize: 12,
			},
			{
				name: "B",
				population: gradeCount.B,
				color: "#52c4eb",
				legendFontColor: "#7F7F7F",
				legendFontSize: 12,
			},
			{
				name: "C",
				population: gradeCount.C,
				color: "#ff5694",
				legendFontColor: "#7F7F7F",
				legendFontSize: 12,
			},
			{
				name: "D",
				population: gradeCount.D,
				color: "#ffc107",
				legendFontColor: "#7F7F7F",
				legendFontSize: 12,
			},
			{
				name: "F",
				population: gradeCount.F,
				color: "#ff5252",
				legendFontColor: "#7F7F7F",
				legendFontSize: 12,
			},
		])

		// Process subject performance data
		const courseAverages: { [key: string]: { total: number; count: number } } = {}

		marksData.forEach((mark) => {
			if (mark.score != null && mark.maxScore && mark.maxScore > 0) {
				const courseId = mark.courseId
				if (!courseAverages[courseId]) {
					courseAverages[courseId] = { total: 0, count: 0 }
				}
				courseAverages[courseId].total += (mark.score / mark.maxScore) * 100
				courseAverages[courseId].count += 1
			}
		})

		const courseLabels: string[] = []
		const courseScores: number[] = []

		Object.entries(courseAverages).forEach(([courseId, data]) => {
			const course = coursesData.find((c) => c._id === courseId)
			if (course && data.count > 0) {
				courseLabels.push(course.code)
				courseScores.push(Math.round(data.total / data.count))
			}
		})

		// Ensure we have at least some data to display
		if (courseLabels.length === 0) {
			courseLabels.push("No Data")
			courseScores.push(0)
		}

		setSubjectPerformanceData({
			labels: courseLabels,
			datasets: [{ data: ensureSafeData(courseScores) }],
		})
	}

	const processAttendanceData = (attendanceData: Attendance[], coursesData: Course[]) => {
		const courseAttendance: { [key: string]: { present: number; total: number } } = {}

		attendanceData.forEach((record) => {
			const courseId = record.courseId
			if (!courseAttendance[courseId]) {
				courseAttendance[courseId] = { present: 0, total: 0 }
			}

			if (record.status === "present" || record.status === "excused") {
				courseAttendance[courseId].present += 1
			}
			courseAttendance[courseId].total += 1
		})

		const courseLabels: string[] = []
		const attendanceRates: number[] = []

		Object.entries(courseAttendance).forEach(([courseId, data]) => {
			const course = coursesData.find((c) => c._id === courseId)
			if (course && data.total > 0) {
				courseLabels.push(course.code)
				attendanceRates.push(data.present / data.total)
			}
		})

		// Ensure we have at least some data to display
		if (courseLabels.length === 0) {
			courseLabels.push("No Data")
			attendanceRates.push(0)
		}

		setAttendanceData({
			labels: courseLabels,
			data: ensureSafeData(attendanceRates),
		})
	}

	// Add this helper function
	const isSafeNumber = (value: any): number => {
		if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
			return 0
		}
		return value
	}

	const calculateGPA = (marksData: MarkItem[]): number => {
		if (marksData.length === 0) return 0

		let totalPoints = 0
		let totalCredits = 0

		// Assuming each course has equal credits (1.0)
		// In a real app, you would get the credits from the course data
		const processedCourses = new Set<string>()

		marksData.forEach((mark) => {
			// Only count each course once for GPA calculation
			// This assumes the marks are aggregated per course
			if (!processedCourses.has(mark.courseId)) {
				processedCourses.add(mark.courseId)

				const percentage = (mark.score / mark.maxScore) * 100
				let gradePoints = 0

				if (percentage >= 90) gradePoints = 4.0
				else if (percentage >= 87) gradePoints = 3.7
				else if (percentage >= 83) gradePoints = 3.3
				else if (percentage >= 80) gradePoints = 3.0
				else if (percentage >= 77) gradePoints = 2.7
				else if (percentage >= 73) gradePoints = 2.3
				else if (percentage >= 70) gradePoints = 2.0
				else if (percentage >= 67) gradePoints = 1.7
				else if (percentage >= 63) gradePoints = 1.3
				else if (percentage >= 60) gradePoints = 1.0
				else gradePoints = 0.0

				totalPoints += gradePoints
				totalCredits += 1
			}
		})

		return totalCredits > 0 ? Number.parseFloat((totalPoints / totalCredits).toFixed(1)) : 0
	}

	const calculateAttendancePercentage = (courseId: string): number => {
		const courseAttendance = attendance.filter((a) => a.courseId === courseId)
		if (courseAttendance.length === 0) return 0

		const presentCount = courseAttendance.filter((a) => a.status === "present" || a.status === "excused").length

		return Math.round((presentCount / courseAttendance.length) * 100)
	}

	const calculateCourseProgress = (courseId: string): number => {
		const courseCurriculum = curriculum.filter((c) => c.courseId === courseId)
		if (courseCurriculum.length === 0) return 0

		// In a real app, you would have a way to track progress through curriculum units
		// For now, we'll use the course progress from the course data
		const course = courses.find((c) => c._id === courseId)
		return course ? course.progress : 0
	}

	// Responsive chart width calculation
	const getChartWidth = (): number => {
		if (isDesktop) return Math.min(800, width - 100)
		if (isTablet) return Math.min(600, width - 60)
		return Math.max(width - 40, 300)
	}

	// Chart configuration
	const chartConfig = {
		backgroundGradientFrom: "#ffffff",
		backgroundGradientTo: "#ffffff",
		decimalPlaces: 1,
		color: (opacity = 1) => `rgba(92, 81, 243, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
		style: {
			borderRadius: 16,
		},
		propsForDots: {
			r: "6",
			strokeWidth: "2",
			stroke: "#5c51f3",
		},
	}

	const renderTabContent = () => {
		if (isLoading) {
			return (
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
					<ActivityIndicator size="large" color="#5c51f3" />
					<Text style={{ marginTop: 10, color: "#666" }}>Loading academic data...</Text>
				</View>
			)
		}

		switch (activeTab) {
			case "performance":
				return (
					<View style={[styles.chartContainer, isDesktop && styles.desktopChartContainer]}>
						<Text style={styles.chartTitle}>GPA Trend</Text>
						<Text style={styles.chartSubtitle}>Your academic performance over time</Text>
						<GPAChart userId={auth?.user?.userId || ""} />
						<GradeDistributionChart userId={auth?.user?.userId || ""} />
					</View>
				)
			case "attendance":
				return (				
					<AttendanceChartView userId={auth?.user?.userId || ""} isDesktop={isDesktop} />
				)
			case "marks":
				return (
					<MarksAnalyticsView userId={auth?.user?.userId || ""} isDesktop={isDesktop} />
				)
			case "curriculum":
				return (
					<View style={[styles.chartContainer, isDesktop && styles.desktopChartContainer]}>
						<Text style={styles.chartTitle}>Curriculum Progress</Text>
						<Text style={styles.chartSubtitle}>Your progress through course materials</Text>

						<View style={isDesktop ? styles.desktopCurriculumGrid : undefined}>
							{courses.map((course) => {
								const courseCurriculum = curriculum.filter((c) => c.courseId === course._id)

								return (
									<View key={course._id} style={[styles.curriculumItem, isDesktop && styles.desktopCurriculumItem]}>
										<View style={[styles.curriculumHeader, { backgroundColor: course.color + "20" }]}>
											<Text style={[styles.curriculumTitle, { color: course.color }]}>
												{course.code} - {course.title}
											</Text>
											<TouchableOpacity style={[styles.viewSyllabusButton, { backgroundColor: course.color }]}>
												<Text style={styles.viewSyllabusText}>View Syllabus</Text>
											</TouchableOpacity>
										</View>

										<View style={styles.unitsContainer}>
											{courseCurriculum.length > 0 ? (
												courseCurriculum[0].units.map((unit, unitIndex) => (
													<View key={unit._id || unitIndex} style={styles.unitItem}>
														<View style={styles.unitHeader}>
															<Text style={styles.unitTitle}>{unit.title}</Text>
															<Text style={styles.unitProgress}>{calculateUnitProgress(course._id, unitIndex)}%</Text>
														</View>
														<View style={styles.progressBarContainer}>
															<View
																style={[
																	styles.progressBar,
																	{
																		width: `${calculateUnitProgress(course._id, unitIndex)}%`,
																		backgroundColor: course.color,
																	},
																]}
															/>
														</View>
													</View>
												))
											) : (
												<Text style={{ padding: 10, color: "#666" }}>
													No curriculum data available for this course.
												</Text>
											)}
										</View>
									</View>
								)
							})}
						</View>
					</View>
				)
			default:
				return null
		}
	}

	const getGradeFromScore = (score: number, maxScore: number): string => {
		const percentage = (score / maxScore) * 100

		if (percentage >= 90) return "A"
		if (percentage >= 87) return "A-"
		if (percentage >= 83) return "B+"
		if (percentage >= 80) return "B"
		if (percentage >= 77) return "B-"
		if (percentage >= 73) return "C+"
		if (percentage >= 70) return "C"
		if (percentage >= 67) return "C-"
		if (percentage >= 63) return "D+"
		if (percentage >= 60) return "D"
		return "F"
	}

	const calculateUnitProgress = (courseId: string, unitIndex: number): number => {
		// For now, simulating progress based on the course progress and unit index
		const course = courses.find((c) => c._id === courseId)
		if (!course) return 0

		const courseProgress = course.progress
		const totalUnits = curriculum.filter((c) => c.courseId === courseId)[0]?.units.length || 1

		const unitProgress = Math.max(0, courseProgress - unitIndex * (100 / totalUnits))
		return Math.min(100, Math.round(unitProgress * (totalUnits / (totalUnits - 0.5))))
	}

	const tabs: TabItem[] = [
		{ id: "performance", label: "Performance", icon: "analytics" },
		{ id: "attendance", label: "Attendance", icon: "calendar" },
		{ id: "marks", label: "Marks & Remarks", icon: "school" },
		{ id: "curriculum", label: "Curriculum", icon: "book" },
	]

	return (
		<SafeAreaView style={[styles.container, isDesktop && styles.desktopContainer]}>
			{isOffline && (
				<View style={{ backgroundColor: "orange", padding: 10, marginBottom: 10 }}>
					<Text style={{ color: "white", textAlign: "center" }}>You are offline. Showing cached data.</Text>
				</View>
			)}

			<View style={[styles.tabContainer, isDesktop && styles.desktopTabContainer]}>
				<ScrollView horizontal showsHorizontalScrollIndicator={true}>
					{tabs.map((tab) => (
						<TouchableOpacity
							key={tab.id}
							style={[
								styles.tab,
								activeTab === tab.id && styles.activeTab,
								isDesktop && styles.desktopTab,
								isDesktop && activeTab === tab.id && styles.desktopActiveTab,
							]}
							onPress={() => setActiveTab(tab.id)}
						>
							<Ionicons name={tab.icon} size={isDesktop ? 24 : 20} color={activeTab === tab.id ? "#5c51f3" : "#777"} />

							<Text
								style={[
									styles.tabText,
									activeTab === tab.id && styles.activeTabText,
									isDesktop && styles.desktopTabText,
									isDesktop && activeTab === tab.id && styles.desktopActiveTabText,
								]}
							>
								{tab.label}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[{ flexGrow: 1 }, isDesktop && styles.desktopScrollContent]}
			>
				{renderTabContent()}
			</ScrollView>
		</SafeAreaView>
	)
}

export default AcademicAnalytics
