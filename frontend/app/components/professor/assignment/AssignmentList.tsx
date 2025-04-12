"use client"
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, FlatList } from "react-native"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import SubmissionStatsBadge from "./SubmissionStatsBadge"

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

interface AssignmentListProps {
    pendingAssignments: Assignment[]
    submissions: AssignmentSubmission[]
    onGradeAssignment: (assignment: Assignment, submission: AssignmentSubmission) => void
    onCreateAssignment: () => void
    title?: string
    showAll?: boolean
    userId?: string
    role?: string
}

export default function AssignmentList({
    pendingAssignments,
    submissions,
    onGradeAssignment,
    onCreateAssignment,
    title = "Pending Assignments",
    showAll = false,
    userId,
    role,
}: AssignmentListProps) {
    const { width } = useWindowDimensions()
    const isDesktop = width >= 1024
    const router = useRouter()

    // Group submissions by assignment
    const getSubmissionsForAssignment = (assignmentId: string) => {
        return submissions.filter((sub) => sub.assignmentId === assignmentId)
    }

    // Calculate submission stats
    const getSubmissionStats = (assignmentId: string) => {
        const assignmentSubmissions = getSubmissionsForAssignment(assignmentId)
        const total = assignmentSubmissions.length
        const pending = assignmentSubmissions.filter((sub) => sub.status === "submitted").length
        const graded = assignmentSubmissions.filter((sub) => sub.status === "graded").length

        return { total, pending, graded }
    }

    // Format date
    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    }

    // Check if assignment is past due
    const isPastDue = (dateString: string) => {
        const dueDate = new Date(dateString)
        const now = new Date()
        return dueDate < now
    }

    // Navigate to submissions page
    const viewSubmissions = (assignment: Assignment) => {
        // Use the new routing structure
        router.push(`/${role}/${userId}/assignments/${assignment._id}`)
    }

    const renderAssignmentItem = ({ item }: { item: Assignment }) => {
        const stats = getSubmissionStats(item._id)
        const assignmentSubmissions = getSubmissionsForAssignment(item._id)
        const isPast = isPastDue(item.dueDate)

        return (
            <View style={[styles.assignmentItem, isDesktop && styles.desktopAssignmentItem]}>
                <View style={styles.assignmentHeader}>
                    <MaterialIcons name="assignment" size={24} color="#4252e5" />
                    <View style={styles.assignmentInfo}>
                        <Text style={styles.assignmentTitle}>{item.title}</Text>
                        <View style={[styles.courseTag, { backgroundColor: item.courseColor }]}>
                            <Text style={styles.courseTagText}>{item.courseCode}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.assignmentDetailsRow}>
                    <View style={styles.dueDateContainer}>
                        <MaterialIcons name="event" size={16} color={isPast ? "#d32f2f" : "#666"} />
                        <Text style={[styles.dueDate, isPast && styles.pastDueDate]}>
                            Due: {formatDueDate(item.dueDate)}
                            {isPast ? " (Past due)" : ""}
                        </Text>
                    </View>

                    <SubmissionStatsBadge
                        totalSubmissions={stats.total}
                        pendingCount={stats.pending}
                        gradedCount={stats.graded}
                    />
                </View>

                <View style={styles.assignmentActions}>
                    {stats.pending > 0 && (
                        <TouchableOpacity
                            style={styles.gradeButton}
                            onPress={() => {
                                const pendingSubmission = assignmentSubmissions.find((s) => s.status === "submitted")
                                if (pendingSubmission) {
                                    onGradeAssignment(item, pendingSubmission)
                                }
                            }}
                        >
                            <MaterialIcons name="grading" size={16} color="white" />
                            <Text style={styles.gradeButtonText}>Grade</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.viewButton} onPress={() => viewSubmissions(item)}>
                        <Ionicons name="eye" size={16} color="white" />
                        <Text style={styles.viewButtonText}>{stats.total > 0 ? "View Submissions" : "No Submissions"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity style={styles.createButton} onPress={onCreateAssignment}>
                    <MaterialIcons name="add" size={20} color="white" />
                    <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
            </View>

            {pendingAssignments.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialIcons name="assignment" size={48} color="#ccc" />
                    <Text style={styles.emptyStateTitle}>No Pending Assignments</Text>
                    <Text style={styles.emptyStateMessage}>There are no assignments that need grading right now.</Text>
                </View>
            ) : (
                <FlatList
                    data={pendingAssignments}
                    renderItem={renderAssignmentItem}
                    keyExtractor={(item) => item._id}
                    horizontal={!isDesktop}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={isDesktop ? styles.desktopAssignmentsList : styles.assignmentsList}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    createButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4252e5",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    createButtonText: {
        color: "white",
        marginLeft: 4,
        fontWeight: "500",
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
    },
    emptyStateTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#666",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateMessage: {
        textAlign: "center",
        color: "#888",
        maxWidth: 300,
    },
    assignmentsList: {
        paddingBottom: 8,
    },
    desktopAssignmentsList: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
    },
    assignmentItem: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 16,
        marginRight: 16,
        marginBottom: 8,
        width: 300,
        borderWidth: 1,
        borderColor: "#eee",
    },
    desktopAssignmentItem: {
        marginRight: 0,
        flex: 1,
        minWidth: 300,
        maxWidth: 400,
    },
    assignmentHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    assignmentInfo: {
        marginLeft: 12,
        flex: 1,
    },
    assignmentTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },
    courseTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: "flex-start",
    },
    courseTagText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    assignmentDetailsRow: {
        marginBottom: 16,
    },
    dueDateContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    dueDate: {
        fontSize: 13,
        color: "#666",
        marginLeft: 6,
    },
    pastDueDate: {
        color: "#d32f2f",
    },
    assignmentActions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    gradeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#5c51f3",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        flex: 1,
        justifyContent: "center",
        marginRight: 8,
    },
    gradeButtonText: {
        color: "white",
        marginLeft: 6,
        fontWeight: "600",
        fontSize: 13,
    },
    viewButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6c757d",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        flex: 2,
        justifyContent: "center",
    },
    viewButtonText: {
        color: "white",
        marginLeft: 6,
        fontWeight: "600",
        fontSize: 13,
    },
})
