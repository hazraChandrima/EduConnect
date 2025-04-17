"use client"

import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native"
import { FontAwesome, AntDesign } from "@expo/vector-icons"
import styles from "../../../styles/StudentDashboard.style"
import CourseMarks from "../marks_remarks/CourseMarks"
import CourseRemarks from "../marks_remarks/CourseRemarks"
import CourseCurriculum from "./CourseCurriculum"
import CourseAttendance from "./CourseAttendance"

interface CourseModalProps {
    isVisible: boolean
    setIsVisible: (visible: boolean) => void
    course: any
    curriculum: any[]
    courseAttendance: { [courseId: string]: any[] }
    marks: any[]
    remarks: any[]
    isDesktop: boolean
    studentId: string // Added studentId prop
}

export default function CourseModal({
    isVisible,
    setIsVisible,
    course,
    curriculum,
    courseAttendance,
    marks,
    remarks,
    isDesktop,
    studentId, // Include studentId in destructuring
}: CourseModalProps) {
    const [activeCourseTab, setActiveCourseTab] = useState<"curriculum" | "attendance" | "marks" | "remarks">(
        "curriculum",
    )

    if (!course) return null

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={() => setIsVisible(false)}>
            <View style={[styles.modalOverlay, isDesktop && styles.desktopModalOverlay]}>
                <View style={[styles.modalContainer, isDesktop && styles.desktopModalContainer]}>
                    <View style={styles.modalHeader}>
                        <View style={[styles.courseModalIcon, { backgroundColor: course.color }]}>
                            <FontAwesome name={course.icon as any} size={24} color="white" />
                        </View>
                        <View style={styles.modalHeaderText}>
                            <Text style={styles.modalTitle}>{course.title}</Text>
                            <Text style={styles.modalSubtitle}>
                                {course.code} • {course.professor.name}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsVisible(false)}>
                            <AntDesign name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.courseTabs}>
                        <TouchableOpacity
                            style={[styles.courseTab, activeCourseTab === "curriculum" && styles.courseTabActive]}
                            onPress={() => setActiveCourseTab("curriculum")}
                        >
                            <Text style={[styles.courseTabText, activeCourseTab === "curriculum" && styles.courseTabTextActive]}>
                                Curriculum
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.courseTab, activeCourseTab === "attendance" && styles.courseTabActive]}
                            onPress={() => setActiveCourseTab("attendance")}
                        >
                            <Text style={[styles.courseTabText, activeCourseTab === "attendance" && styles.courseTabTextActive]}>
                                Attendance
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.courseTab, activeCourseTab === "marks" && styles.courseTabActive]}
                            onPress={() => setActiveCourseTab("marks")}
                        >
                            <Text style={[styles.courseTabText, activeCourseTab === "marks" && styles.courseTabTextActive]}>
                                Marks
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.courseTab, activeCourseTab === "remarks" && styles.courseTabActive]}
                            onPress={() => setActiveCourseTab("remarks")}
                        >
                            <Text style={[styles.courseTabText, activeCourseTab === "remarks" && styles.courseTabTextActive]}>
                                Remarks
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {activeCourseTab === "curriculum" && (
                            <CourseCurriculum
                                courseId={course._id}
                                curriculum={curriculum.filter((c) => c.courseId === course._id)}
                            />
                        )}

                        {activeCourseTab === "attendance" && (
                            <CourseAttendance courseId={course._id} attendance={courseAttendance[course._id] || []} />
                        )}

                        {activeCourseTab === "marks" && (
                            <CourseMarks
                                courseId={course._id}
                                studentId={studentId}
                                styles={styles}
                            />
                        )}

                        {activeCourseTab === "remarks" && (
                            <CourseRemarks
                                courseId={course._id}
                                studentId={studentId}
                                styles={styles}
                            />
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}