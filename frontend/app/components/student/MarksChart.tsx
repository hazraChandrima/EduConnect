import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    useWindowDimensions,
} from "react-native"
import { BarChart } from "react-native-chart-kit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"
import styles from "../../styles/AcademicAnalytics.style"
import { APP_CONFIG } from "@/app-config"
import { useToken } from "@/app/hooks/useToken"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

// Update the interface to match the actual response format from your API
interface MarkItem {
    _id: string
    courseId: string | {
        _id: string
        code: string
        title: string
        color: string
    }
    studentId: string
    title: string
    score: number
    maxScore: number
    type: string
    feedback?: string
    createdAt: string
    courseName?: string
    courseCode?: string
    color?: string
}

interface Course {
    _id: string
    code: string
    title: string
    color: string
    icon?: string
    progress?: number
    professor?: {
        _id: string
        name: string
    }
}

interface MarksAnalyticsViewProps {
    userId: string
    isDesktop?: boolean
}

const MarksAnalyticsView: React.FC<MarksAnalyticsViewProps> = ({ userId, isDesktop = false }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isOffline, setIsOffline] = useState<boolean>(false)
    const [marks, setMarks] = useState<MarkItem[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const { width } = useWindowDimensions()
    const { token } = useToken()

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
            if (!userId) {
                console.log("No user ID available")
                setIsLoading(false)
                return
            }

            // Wait for token to be available before proceeding
            if (!token) {
                console.log("Waiting for token...")
                return  // Exit early and wait for token to be available
            }

            setIsLoading(true)

            try {
                // Fetch marks directly using the dedicated endpoint
                const marksResponse = await fetch(`${API_BASE_URL}/api/marks/student/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (marksResponse.ok) {
                    const marksData: MarkItem[] = await marksResponse.json()
                    console.log("Marks data received:", marksData)

                    // Extract course information from the nested courseId object
                    const extractedCourses: Course[] = []
                    const processedMarks = marksData.map(mark => {
                        // Check if courseId is an object or a string
                        if (typeof mark.courseId === 'object' && mark.courseId !== null) {
                            const course = mark.courseId

                            // Add course to courses array if not already present
                            if (!extractedCourses.find(c => c._id === course._id)) {
                                extractedCourses.push({
                                    _id: course._id,
                                    code: course.code,
                                    title: course.title,
                                    color: course.color
                                })
                            }

                            // Create a normalized mark with courseId as string
                            return {
                                ...mark,
                                courseId: course._id,
                                courseName: course.title,
                                courseCode: course.code,
                                color: course.color
                            }
                        }

                        // If courseId is already a string, just return the mark as is
                        return mark
                    })

                    if (isMounted) {
                        setMarks(processedMarks)
                        setCourses(extractedCourses)
                    }

                    await AsyncStorage.setItem("academicAnalyticsMarks", JSON.stringify(processedMarks))
                    await AsyncStorage.setItem("academicAnalyticsCourses", JSON.stringify(extractedCourses))

                    processMarksData(processedMarks, extractedCourses)
                } else {
                    console.error("Failed to fetch marks:", marksResponse.status)
                    // Try to load from cache
                    loadFromCache()
                }
            } catch (error) {
                console.error("Error fetching marks:", error)
                // Try to load from cache
                loadFromCache()
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        const loadFromCache = async () => {
            try {
                const cachedMarks = await AsyncStorage.getItem("academicAnalyticsMarks")
                const cachedCourses = await AsyncStorage.getItem("academicAnalyticsCourses")

                if (cachedMarks && cachedCourses) {
                    const parsedMarks = JSON.parse(cachedMarks)
                    const parsedCourses = JSON.parse(cachedCourses)

                    if (isMounted) {
                        setMarks(parsedMarks)
                        setCourses(parsedCourses)
                    }

                    processMarksData(parsedMarks, parsedCourses)
                }
            } catch (storageError) {
                console.error("Error reading from storage:", storageError)
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [userId, token]) // Make sure token is in the dependency array

    const processMarksData = (marksData: MarkItem[], coursesData: Course[]) => {
        console.log("Processing marks data:", marksData.length, "marks")

        // Process subject performance data
        const courseAverages: { [key: string]: { total: number; count: number } } = {}

        marksData.forEach((mark) => {
            if (mark.score != null && mark.maxScore && mark.maxScore > 0) {
                const courseId = typeof mark.courseId === 'string' ? mark.courseId : mark.courseId._id
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

        console.log("Subject performance data:", courseLabels, courseScores)

        setSubjectPerformanceData({
            labels: courseLabels,
            datasets: [{ data: ensureSafeData(courseScores) }],
        })
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

    // Ensure data is safe for charts
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

    // Responsive chart width calculation
    const getChartWidth = (): number => {
        if (isDesktop) return Math.min(800, width - 100)
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

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                <ActivityIndicator size="large" color="#5c51f3" />
                <Text style={{ marginTop: 10, color: "#666" }}>Loading marks data...</Text>
            </View>
        )
    }

    // Helper function to get course code and name
    const getCourseInfo = (mark: MarkItem) => {
        if (typeof mark.courseId === 'object' && mark.courseId !== null) {
            return {
                code: mark.courseId.code,
                name: mark.courseId.title,
                color: mark.courseId.color
            }
        }

        // If courseId is a string, try to find course in courses array
        if (mark.courseCode && mark.courseName && mark.color) {
            return {
                code: mark.courseCode,
                name: mark.courseName,
                color: mark.color
            }
        }

        // Fallback
        const course = courses.find(c => c._id === mark.courseId)
        return {
            code: course?.code || "N/A",
            name: course?.title || "Unknown Course",
            color: course?.color || "#5c51f3"
        }
    }

    return (
        <View style={[styles.chartContainer, isDesktop && styles.desktopChartContainer]}>
            {isOffline && (
                <View style={{ backgroundColor: "orange", padding: 10, marginBottom: 10 }}>
                    <Text style={{ color: "white", textAlign: "center" }}>You are offline. Showing cached data.</Text>
                </View>
            )}

            <Text style={styles.chartTitle}>Subject Performance</Text>
            <Text style={styles.chartSubtitle}>Your marks across different subjects</Text>

            {subjectPerformanceData.labels.length > 0 && subjectPerformanceData.datasets[0].data.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <BarChart
                        data={{
                            ...subjectPerformanceData,
                            datasets: subjectPerformanceData.datasets.map((dataset) => ({
                                ...dataset,
                                data: ensureMinimumDataLength(ensureSafeData(dataset.data), 1),
                            })),
                        }}
                        width={Math.max(getChartWidth(), 300)}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix="%"
                        chartConfig={{
                            ...chartConfig,
                            barPercentage: 1.0,
                        }}
                        style={styles.chart}
                    />
                </ScrollView>
            ) : (
                <View style={{ padding: 20, alignItems: "center" }}>
                    <Text style={{ color: "#666" }}>No performance data available to display.</Text>
                </View>
            )}

            <View style={[styles.marksDetails, isDesktop && styles.desktopMarksDetails]}>
                <Text style={styles.detailsTitle}>Detailed Marks</Text>

                {marks.length === 0 ? (
                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text style={{ marginTop: 10, color: "#666" }}>No marks data available.</Text>
                    </View>
                ) : (
                    <View style={isDesktop ? styles.desktopMarksGrid : undefined}>
                        {marks.map((mark, index) => {
                            const courseInfo = getCourseInfo(mark)

                            return (
                                <View key={mark._id || index} style={[styles.marksItem, isDesktop && styles.desktopMarksItem]}>
                                    <View style={styles.marksItemHeader}>
                                        <View style={[styles.subjectTag, { backgroundColor: courseInfo.color }]}>
                                            <Text style={styles.subjectTagText}>{courseInfo.code}</Text>
                                        </View>
                                        <View style={styles.gradeContainer}>
                                            <Text style={styles.marksValue}>{Math.round((mark.score / mark.maxScore) * 100)}%</Text>
                                            <Text style={styles.gradeValue}>Grade: {getGradeFromScore(mark.score, mark.maxScore)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.remarksContainer}>
                                        <Text style={styles.remarksTitle}>{mark.title}</Text>
                                        {mark.feedback ? (
                                            <>
                                                <Text style={styles.remarksTitle}>Professor Remarks:</Text>
                                                <Text style={styles.remarksText}>{mark.feedback}</Text>
                                            </>
                                        ) : (
                                            <Text style={styles.remarksText}>
                                                Score: {mark.score} out of {mark.maxScore}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                )}
            </View>
        </View>
    )
}

export default MarksAnalyticsView