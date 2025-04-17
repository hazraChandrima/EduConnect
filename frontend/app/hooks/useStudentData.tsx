"use client"

import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { APP_CONFIG } from "@/app-config"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

export function useStudentData(userId: string, token: string | null) {
    const [userData, setUserData] = useState<any>(null)
    const [courses, setCourses] = useState<any[]>([])
    const [assignments, setAssignments] = useState<any[]>([])
    const [attendance, setAttendance] = useState<any[]>([])
    const [courseAttendance, setCourseAttendance] = useState<{ [courseId: string]: any[] }>({})
    const [marks, setMarks] = useState<any[]>([])
    const [remarks, setRemarks] = useState<any[]>([])
    const [curriculum, setCurriculum] = useState<any[]>([])
    const [gpa, setGpa] = useState<any[]>([])

    const fetchData = async () => {
        try {
            // Fetch user data
            const userResponse = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!userResponse.ok) {
                throw new Error(`API request failed with status ${userResponse.status}`)
            }

            const userData = await userResponse.json()
            setUserData(userData)
            setGpa(userData.gpa)

            await AsyncStorage.setItem("studentDashboardUserData", JSON.stringify(userData))

            // Fetch courses
            const coursesResponse = await fetch(`${API_BASE_URL}/api/courses/student/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            let coursesData = []
            if (coursesResponse.ok) {
                coursesData = await coursesResponse.json()
                setCourses(coursesData)
                await AsyncStorage.setItem("studentDashboardCourses", JSON.stringify(coursesData))
            }

            // Fetch assignments
            const assignmentsResponse = await fetch(`${API_BASE_URL}/api/assignment/student/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (assignmentsResponse.ok) {
                const assignmentsData = await assignmentsResponse.json()
                setAssignments(assignmentsData)
                await AsyncStorage.setItem("studentDashboardAssignments", JSON.stringify(assignmentsData))
            }

            // Fetch overall attendance
            const totalAttendanceResponse = await fetch(`${API_BASE_URL}/api/attendance/student/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (totalAttendanceResponse.ok) {
                const attendanceData = await totalAttendanceResponse.json()
                setAttendance(attendanceData)
                await AsyncStorage.setItem("studentDashboardAttendance", JSON.stringify(attendanceData))
            }

            // Fetch attendance for each course
            const courseAttendanceData: { [courseId: string]: any[] } = {}

            // Only proceed if we have courses
            if (coursesData && coursesData.length > 0) {
                const attendancePromises = coursesData.map((course: any) =>
                    fetch(`${API_BASE_URL}/api/attendance/course/${course._id}/student/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((res) => (res.ok ? res.json() : []))
                        .then((data) => {
                            courseAttendanceData[course._id] = data
                            return data
                        })
                        .catch((err) => {
                            console.error(`Error fetching attendance for course ${course._id}:`, err)
                            return []
                        }),
                )

                await Promise.all(attendancePromises)
                setCourseAttendance(courseAttendanceData)
                await AsyncStorage.setItem("studentDashboardCourseAttendance", JSON.stringify(courseAttendanceData))
            }

            // Fetch marks
            const marksResponse = await fetch(`${API_BASE_URL}/api/marks/student/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (marksResponse.ok) {
                const marksData = await marksResponse.json()
                setMarks(marksData)
                await AsyncStorage.setItem("studentDashboardMarks", JSON.stringify(marksData))
            }

            // Fetch remarks
            const remarksResponse = await fetch(`${API_BASE_URL}/api/remarks/student/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (remarksResponse.ok) {
                const remarksData = await remarksResponse.json()
                setRemarks(remarksData)
                await AsyncStorage.setItem("studentDashboardRemarks", JSON.stringify(remarksData))
            }

            // Fetch curriculum for all courses
            const curriculumPromises = coursesData.map((course: any) =>
                fetch(`${API_BASE_URL}/api/curriculum/course/${course._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }).then((res) => (res.ok ? res.json() : [])),
            )

            const curriculumResults = await Promise.all(curriculumPromises)
            const allCurriculum = curriculumResults.flat()
            setCurriculum(allCurriculum)
            await AsyncStorage.setItem("studentDashboardCurriculum", JSON.stringify(allCurriculum))
        } catch (error) {
            console.error("Error fetching student data:", error)

            // Load cached data if available
            const loadCachedData = async () => {
                const cachedUserData = await AsyncStorage.getItem("studentDashboardUserData")
                if (cachedUserData) setUserData(JSON.parse(cachedUserData))

                const cachedCourses = await AsyncStorage.getItem("studentDashboardCourses")
                if (cachedCourses) setCourses(JSON.parse(cachedCourses))

                const cachedAssignments = await AsyncStorage.getItem("studentDashboardAssignments")
                if (cachedAssignments) setAssignments(JSON.parse(cachedAssignments))

                const cachedAttendance = await AsyncStorage.getItem("studentDashboardAttendance")
                if (cachedAttendance) setAttendance(JSON.parse(cachedAttendance))

                const cachedCourseAttendance = await AsyncStorage.getItem("studentDashboardCourseAttendance")
                if (cachedCourseAttendance) setCourseAttendance(JSON.parse(cachedCourseAttendance))

                const cachedMarks = await AsyncStorage.getItem("studentDashboardMarks")
                if (cachedMarks) setMarks(JSON.parse(cachedMarks))

                const cachedRemarks = await AsyncStorage.getItem("studentDashboardRemarks")
                if (cachedRemarks) setRemarks(JSON.parse(cachedRemarks))

                const cachedCurriculum = await AsyncStorage.getItem("studentDashboardCurriculum")
                if (cachedCurriculum) setCurriculum(JSON.parse(cachedCurriculum))
            }

            await loadCachedData()
        }
    }

    return {
        userData,
        courses,
        assignments,
        attendance,
        courseAttendance,
        marks,
        remarks,
        curriculum,
        gpa,
        fetchData,
    }
}
