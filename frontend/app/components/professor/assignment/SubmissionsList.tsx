import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    useWindowDimensions,
} from "react-native"
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons"
import { format } from "date-fns"

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

interface SubmissionsListProps {
    submissions: AssignmentSubmission[]
    assignment: Assignment | null
    isLoading: boolean
    onOpenGradingModal: (submission: AssignmentSubmission) => void
    onOpenViewSubmission: (submission: AssignmentSubmission) => void
}

export default function SubmissionsList({
    submissions,
    assignment,
    isLoading,
    onOpenGradingModal,
    onOpenViewSubmission,
}: SubmissionsListProps) {
    const { width } = useWindowDimensions()
    const isDesktop = width >= 1024
    const isTablet = width >= 768 && width < 1024

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy h:mm a")
        } catch (error) {
            return dateString
        }
    }

    const renderSubmissionItem = ({ item }: { item: AssignmentSubmission }) => (
        <View style={[styles.submissionItem, isDesktop && styles.desktopSubmissionItem]}>
            <View style={styles.submissionHeader}>
                <View style={styles.studentInfo}>
                    <View style={styles.studentAvatar}>
                        <Ionicons name="person" size={16} color="white" />
                    </View>
                    <View>
                        <Text style={styles.studentName}>{item.uploader.name}</Text>
                        <Text style={styles.studentEmail}>{item.uploader.email}</Text>
                    </View>
                </View>
                <View style={styles.submissionStatus}>
                    <View style={[styles.statusBadge, item.status === "graded" ? styles.gradedBadge : styles.submittedBadge]}>
                        <Text style={styles.statusText}>{item.status === "graded" ? "Graded" : "Submitted"}</Text>
                    </View>
                    {item.status === "graded" && <Text style={styles.gradeText}>Grade: {item.grade}/100</Text>}
                </View>
            </View>

            <View style={styles.submissionDetails}>
                <Text style={styles.submissionDate}>Submitted on {formatDate(item.createdAt)}</Text>

                {item.status === "graded" && item.feedback && (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.feedbackLabel}>Feedback:</Text>
                        <Text style={styles.feedbackText}>{item.feedback}</Text>
                    </View>
                )}
            </View>

            <View style={styles.submissionActions}>
                <TouchableOpacity style={[styles.actionButton, styles.viewButton]} onPress={() => onOpenViewSubmission(item)}>
                    <Feather name="download" size={16} color="white" />
                    <Text style={styles.actionButtonText}>View Submission</Text>
                </TouchableOpacity>

                {item.status === "submitted" ? (
                    <TouchableOpacity style={[styles.actionButton, styles.gradeButton]} onPress={() => onOpenGradingModal(item)}>
                        <MaterialIcons name="grading" size={16} color="white" />
                        <Text style={styles.actionButtonText}>Grade</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editGradeButton]}
                        onPress={() => onOpenGradingModal(item)}
                    >
                        <MaterialIcons name="edit" size={16} color="white" />
                        <Text style={styles.actionButtonText}>Edit Grade</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5c51f3" />
                <Text style={styles.loadingText}>Loading submissions...</Text>
            </View>
        )
    }

    if (!assignment) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons name="assignment" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No assignment selected</Text>
                <Text style={styles.emptySubtext}>Please select an assignment to view submissions</Text>
            </View>
        )
    }

    if (submissions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons name="assignment" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No submissions yet</Text>
                <Text style={styles.emptySubtext}>No students have submitted this assignment yet</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Submissions for {assignment.title}</Text>
                <Text style={styles.subtitle}>
                    {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
                </Text>
            </View>

            <FlatList
                data={submissions}
                renderItem={renderSubmissionItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        overflow: "hidden",
        marginBottom: 16,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    listContainer: {
        padding: 16,
    },
    loadingContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        marginTop: 12,
        color: "#666",
        fontSize: 14,
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: "600",
        color: "#555",
    },
    emptySubtext: {
        marginTop: 8,
        fontSize: 14,
        color: "#777",
        textAlign: "center",
    },
    submissionItem: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#eee",
    },
    desktopSubmissionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    submissionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    studentInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    studentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#5c51f3",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    studentName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    studentEmail: {
        fontSize: 12,
        color: "#777",
    },
    submissionStatus: {
        alignItems: "flex-end",
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 4,
    },
    submittedBadge: {
        backgroundColor: "#e0eaff",
    },
    gradedBadge: {
        backgroundColor: "#d8f5e5",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },
    gradeText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#22a67c",
    },
    submissionDetails: {
        marginBottom: 16,
    },
    submissionDate: {
        fontSize: 13,
        color: "#777",
        marginBottom: 8,
    },
    feedbackContainer: {
        backgroundColor: "#f0f0f0",
        padding: 12,
        borderRadius: 6,
        marginTop: 8,
    },
    feedbackLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#555",
        marginBottom: 4,
    },
    feedbackText: {
        fontSize: 14,
        color: "#555",
    },
    submissionActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        marginLeft: 8,
    },
    viewButton: {
        backgroundColor: "#6c757d",
    },
    gradeButton: {
        backgroundColor: "#5c51f3",
    },
    editGradeButton: {
        backgroundColor: "#38a169",
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
        marginLeft: 6,
    },
})
