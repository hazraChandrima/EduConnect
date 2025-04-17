"use client"

import { useState } from "react"
import { View, Text, FlatList, TouchableOpacity } from "react-native"
import styles from "../../../styles/StudentDashboard.style"

interface AssignmentsTabProps {
    assignments: any[]
    handleAssignmentSelect: (assignment: any) => void
    isDesktop: boolean
}

export default function AssignmentsTab({ assignments, handleAssignmentSelect, isDesktop }: AssignmentsTabProps) {
    const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "graded">("all")

    const filteredAssignments = assignments.filter((assignment) => {
        if (filter === "all") return true
        return assignment.status === filter
    })

    return (
        <View style={[styles.tabContent, isDesktop && styles.desktopTabContent]}>
            <Text style={styles.tabTitle}>Your Assignments</Text>

            <View style={[styles.assignmentFilters, isDesktop && styles.desktopAssignmentFilters]}>
                <TouchableOpacity
                    style={[styles.assignmentFilter, filter === "all" && styles.assignmentFilterActive]}
                    onPress={() => setFilter("all")}
                >
                    <Text style={filter === "all" ? styles.assignmentFilterTextActive : styles.assignmentFilterText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.assignmentFilter, filter === "pending" && styles.assignmentFilterActive]}
                    onPress={() => setFilter("pending")}
                >
                    <Text style={filter === "pending" ? styles.assignmentFilterTextActive : styles.assignmentFilterText}>
                        Pending
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.assignmentFilter, filter === "submitted" && styles.assignmentFilterActive]}
                    onPress={() => setFilter("submitted")}
                >
                    <Text style={filter === "submitted" ? styles.assignmentFilterTextActive : styles.assignmentFilterText}>
                        Submitted
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.assignmentFilter, filter === "graded" && styles.assignmentFilterActive]}
                    onPress={() => setFilter("graded")}
                >
                    <Text style={filter === "graded" ? styles.assignmentFilterTextActive : styles.assignmentFilterText}>
                        Graded
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredAssignments}
                key={isDesktop ? "desktop-grid" : "mobile-list"}
                numColumns={isDesktop ? 2 : 1}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={[styles.assignmentCard, isDesktop && styles.desktopAssignmentCard]}>
                        <View style={styles.assignmentCardHeader}>
                            <View style={[styles.assignmentCardTag, { backgroundColor: item.color || "#5c51f3" }]}>
                                <Text style={styles.assignmentCardTagText}>{item.courseCode || "Course"}</Text>
                            </View>
                            <Text style={styles.assignmentCardDue}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
                        </View>

                        <Text style={styles.assignmentCardTitle}>{item.title}</Text>

                        <Text style={styles.assignmentCardDescription}>{item.description}</Text>

                        <View style={styles.assignmentCardFooter}>
                            <View
                                style={[
                                    styles.assignmentCardStatus,
                                    item.status === "submitted"
                                        ? styles.statusSubmitted
                                        : item.status === "graded"
                                            ? styles.statusGraded
                                            : item.status === "late"
                                                ? styles.statusLate
                                                : styles.statusPending,
                                ]}
                            >
                                <Text style={styles.assignmentCardStatusText}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </Text>
                            </View>

                            {item.status !== "graded" && (
                                <TouchableOpacity style={styles.assignmentCardAction} onPress={() => handleAssignmentSelect(item)}>
                                    <Text style={styles.assignmentCardActionText}>
                                        {item.status === "submitted" ? "View/Resubmit" : "Submit"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
                contentContainerStyle={[styles.assignmentsList, isDesktop && styles.desktopAssignmentsList]}
            />
        </View>
    )
}
