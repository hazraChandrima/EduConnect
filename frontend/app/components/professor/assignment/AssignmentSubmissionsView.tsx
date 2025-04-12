"use client"

import { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    ActivityIndicator,
    Alert,
    useWindowDimensions,
    ScrollView,
    Linking,
} from "react-native"
import { Ionicons, MaterialIcons, AntDesign, Feather } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import SubmissionsList from "./SubmissionsList"
import { APP_CONFIG } from "@/app-config"

interface AssignmentSubmission {
    _id: string
    assignmentId: string
    courseId: string
    downloadUrl: string
    uploader: {
        _id: string
        name: string
        email: string
    }
    grade: number | null
    feedback: string
    status: "submitted" | "graded"
    createdAt: string
}

interface Assignment {
    _id: string
    title: string
    description: string
    courseId: string
    dueDate: string
    status: string
    submissions?: number
    courseCode?: string
    courseColor?: string
}

interface Course {
    _id: string
    code: string
    title: string
    color: string
}

interface Mark {
    _id: string
    courseId: string
    studentId: string
    title: string
    score: number
    maxScore: number
    type: "assignment" | "quiz" | "exam" | "project"
    feedback?: string
}

interface AssignmentSubmissionsViewProps {
    selectedAssignment: Assignment | null
    onClose: () => void
    token: string | null
    onGradeSubmitted: (updatedSubmission: AssignmentSubmission) => void
    courses: Course[]
    marks: Mark[]
    setMarks: (marks: Mark[]) => void
}

export default function AssignmentSubmissionsView({
    selectedAssignment,
    onClose,
    token,
    onGradeSubmitted,
    courses,
    marks,
    setMarks,
}: AssignmentSubmissionsViewProps) {
    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null)
    const [isGradingModalVisible, setIsGradingModalVisible] = useState(false)
    const [isViewSubmissionModalVisible, setIsViewSubmissionModalVisible] = useState(false)
    const [gradeInput, setGradeInput] = useState("")
    const [feedbackInput, setFeedbackInput] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { width } = useWindowDimensions()
    const isDesktop = width >= 1024

    const API_BASE_URL = APP_CONFIG.API_BASE_URL

    useEffect(() => {
        if (selectedAssignment) {
            fetchSubmissions()
        }
    }, [selectedAssignment])

    const fetchSubmissions = async () => {
        if (!selectedAssignment) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/api/assignment/${selectedAssignment._id}/submissions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch submissions: ${response.status}`)
            }

            const data = await response.json()
            setSubmissions(data)
        } catch (err) {
            console.error("Error fetching submissions:", err)
            setError("Failed to load submissions. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenGradingModal = (submission: AssignmentSubmission) => {
        setSelectedSubmission(submission)
        setGradeInput(submission.grade ? String(submission.grade) : "")
        setFeedbackInput(submission.feedback || "")
        setIsGradingModalVisible(true)
    }

    const handleOpenViewSubmission = (submission: AssignmentSubmission) => {
        setSelectedSubmission(submission)
        setIsViewSubmissionModalVisible(true)
    }

    const handleGradeSubmission = async () => {
        if (!gradeInput || !selectedSubmission) {
            Alert.alert("Error", "Please enter a grade")
            return
        }

        const gradeValue = Number.parseInt(gradeInput)
        if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
            Alert.alert("Error", "Please enter a valid grade between 0 and 100")
            return
        }

        setIsSubmitting(true)

        try {
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`${API_BASE_URL}/api/assignment/submissions/${selectedSubmission._id}/grade`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    grade: gradeValue,
                    feedback: feedbackInput,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                // Update submissions state
                const updatedSubmissions = submissions.map((submission) =>
                    submission._id === selectedSubmission._id
                        ? {
                            ...submission,
                            grade: gradeValue,
                            feedback: feedbackInput,
                            status: "graded" as const,
                        }
                        : submission,
                )

                setSubmissions(updatedSubmissions)
                await AsyncStorage.setItem("professorDashboardSubmissions", JSON.stringify(updatedSubmissions))

                // Also add a mark for this student
                if (selectedSubmission && selectedAssignment) {
                    const markData = {
                        courseId: selectedSubmission.courseId,
                        studentId: selectedSubmission.uploader._id,
                        title: selectedAssignment.title,
                        score: gradeValue,
                        maxScore: 100, // Assuming max score is 100
                        type: "assignment",
                        feedback: feedbackInput,
                    }

                    const markResponse = await fetch(`${API_BASE_URL}/api/marks`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(markData),
                    })

                    if (markResponse.ok) {
                        const markResult = await markResponse.json()
                        const updatedMarks = [...marks, markResult.mark]
                        setMarks(updatedMarks)
                        await AsyncStorage.setItem("professorDashboardMarks", JSON.stringify(updatedMarks))
                    }
                }

                // Notify parent component about the graded submission
                onGradeSubmitted(updatedSubmissions.find((s) => s._id === selectedSubmission._id) as AssignmentSubmission)

                Alert.alert("Success", "Submission graded successfully")
                setIsGradingModalVisible(false)
            } else {
                Alert.alert("Error", data.error || "Failed to grade submission")
            }
        } catch (error) {
            console.error("Error grading submission:", error)
            Alert.alert("Error", "Failed to grade submission")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDownloadSubmission = async () => {
        if (!selectedSubmission) return

        try {
            // For web, open in a new tab
            if (typeof window !== "undefined") {
                window.open(selectedSubmission.downloadUrl, "_blank")
            } else {
                // For mobile, use Linking
                await Linking.openURL(selectedSubmission.downloadUrl)
            }
        } catch (error) {
            console.error("Error opening submission URL:", error)
            Alert.alert("Error", "Could not open the submission. Please try again.")
        } finally {
            setIsViewSubmissionModalVisible(false)
        }
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onClose}>
                    <Ionicons name="arrow-back" size={24} color="#4252e5" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.headerTitle}>
                    <Text style={styles.headerTitleText}>Assignment Submissions</Text>
                </View>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchSubmissions}>
                    <MaterialIcons name="refresh" size={22} color="#4252e5" />
                </TouchableOpacity>
            </View>

            {/* Error display */}
            {error && (
                <View style={styles.errorContainer}>
                    <AntDesign name="exclamationcircle" size={20} color="#d32f2f" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchSubmissions}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Submissions list */}
            <SubmissionsList
                submissions={submissions}
                assignment={selectedAssignment}
                isLoading={isLoading}
                onOpenGradingModal={handleOpenGradingModal}
                onOpenViewSubmission={handleOpenViewSubmission}
            />

            {/* Grading Modal */}
            <Modal
                visible={isGradingModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsGradingModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, isDesktop && styles.desktopModalContainer]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Grade Submission</Text>
                            <TouchableOpacity onPress={() => setIsGradingModalVisible(false)}>
                                <AntDesign name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            {selectedSubmission && selectedAssignment && (
                                <>
                                    <View style={styles.gradingAssignmentInfo}>
                                        <Text style={styles.gradingAssignmentTitle}>{selectedAssignment.title}</Text>
                                        <View style={[styles.courseTag, { backgroundColor: selectedAssignment.courseColor }]}>
                                            <Text style={styles.courseTagText}>{selectedAssignment.courseCode}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.gradingStudentName}>Student: {selectedSubmission.uploader.name}</Text>

                                    <TouchableOpacity
                                        style={styles.viewSubmissionButton}
                                        onPress={() => {
                                            setIsGradingModalVisible(false)
                                            handleOpenViewSubmission(selectedSubmission)
                                        }}
                                    >
                                        <Feather name="download" size={20} color="white" />
                                        <Text style={styles.viewSubmissionButtonText}>View Submission</Text>
                                    </TouchableOpacity>

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

                                    <TouchableOpacity style={styles.submitButton} onPress={handleGradeSubmission} disabled={isSubmitting}>
                                        {isSubmitting ? (
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

            {/* View Submission Modal */}
            <Modal
                visible={isViewSubmissionModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsViewSubmissionModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, isDesktop && styles.desktopModalContainer]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>View Submission</Text>
                            <TouchableOpacity onPress={() => setIsViewSubmissionModalVisible(false)}>
                                <AntDesign name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalContent}>
                            {selectedSubmission && (
                                <>
                                    <View style={styles.submissionDetails}>
                                        <Text style={styles.submissionStudent}>Submitted by: {selectedSubmission.uploader.name}</Text>
                                        <Text style={styles.submissionEmail}>Student email: {selectedSubmission.uploader.email}</Text>
                                        <View style={styles.divider} />

                                        <Text style={styles.downloadPrompt}>
                                            Click the button below to download/view the submitted file:
                                        </Text>

                                        <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadSubmission}>
                                            <Feather name="download" size={24} color="white" />
                                            <Text style={styles.downloadButtonText}>Download Submission</Text>
                                        </TouchableOpacity>

                                        {selectedSubmission.status === "graded" && (
                                            <View style={styles.gradingInfo}>
                                                <Text style={styles.gradingInfoTitle}>Grading Information</Text>
                                                <View style={styles.gradingDetail}>
                                                    <Text style={styles.gradingLabel}>Grade:</Text>
                                                    <Text style={styles.gradingValue}>{selectedSubmission.grade}/100</Text>
                                                </View>

                                                {selectedSubmission.feedback && (
                                                    <View style={styles.gradingDetail}>
                                                        <Text style={styles.gradingLabel}>Feedback:</Text>
                                                        <Text style={styles.gradingValue}>{selectedSubmission.feedback}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButtonText: {
        fontSize: 16,
        marginLeft: 8,
        color: "#4252e5",
    },
    headerTitle: {
        flex: 1,
        alignItems: "center",
    },
    headerTitleText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    refreshButton: {
        padding: 8,
    },
    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#ffebee",
        margin: 16,
        borderRadius: 8,
    },
    errorText: {
        flex: 1,
        marginLeft: 8,
        color: "#d32f2f",
    },
    retryButton: {
        backgroundColor: "#d32f2f",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        maxHeight: "80%",
        backgroundColor: "white",
        borderRadius: 12,
        overflow: "hidden",
    },
    desktopModalContainer: {
        width: "50%",
        maxWidth: 600,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    modalContent: {
        padding: 16,
    },
    gradingAssignmentInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    gradingAssignmentTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        flex: 1,
    },
    courseTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 8,
    },
    courseTagText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    gradingStudentName: {
        fontSize: 16,
        color: "#555",
        marginBottom: 16,
    },
    viewSubmissionButton: {
        flexDirection: "row",
        backgroundColor: "#6c757d",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    viewSubmissionButtonText: {
        color: "white",
        marginLeft: 8,
        fontWeight: "600",
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#555",
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        padding: 12,
        fontSize: 14,
        color: "#333",
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#5c51f3",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    submitButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    submissionDetails: {
        padding: 16,
    },
    submissionStudent: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    submissionEmail: {
        fontSize: 14,
        color: "#555",
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 16,
    },
    downloadPrompt: {
        fontSize: 14,
        color: "#555",
        marginBottom: 16,
        textAlign: "center",
    },
    downloadButton: {
        flexDirection: "row",
        backgroundColor: "#5c51f3",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
    },
    downloadButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
    },
    gradingInfo: {
        marginTop: 24,
        backgroundColor: "#f5f5f5",
        padding: 16,
        borderRadius: 8,
    },
    gradingInfoTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
    },
    gradingDetail: {
        marginBottom: 12,
    },
    gradingLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#555",
        marginBottom: 4,
    },
    gradingValue: {
        fontSize: 14,
        color: "#333",
    },
})
