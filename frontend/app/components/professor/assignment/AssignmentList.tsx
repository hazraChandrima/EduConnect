import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "@/app/styles/ProfessorDashboard.style";

interface AssignmentListProps {
    pendingAssignments: any[];
    onGradeAssignment: (assignment: any, submission: any) => void;
    onCreateAssignment: () => void;
    submissions: any[];
}

const AssignmentList: React.FC<AssignmentListProps> = ({
    pendingAssignments,
    onGradeAssignment,
    onCreateAssignment,
    submissions
}) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pending Assignments</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            {pendingAssignments.map((assignment) => {
                const assignmentSubmissions = submissions.filter(sub => sub.assignmentId === assignment._id);
                const pendingSubmissions = assignmentSubmissions.filter(sub => sub.status === "submitted");

                return (
                    <View key={assignment._id} style={styles.assignmentItem}>
                        <View style={styles.assignmentHeader}>
                            <View style={[styles.courseTag, { backgroundColor: assignment.courseColor }]}>
                                <Text style={styles.courseTagText}>{assignment.courseCode}</Text>
                            </View>
                            <Text style={styles.submissionsText}>{pendingSubmissions.length} Submissions</Text>
                        </View>
                        <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                        <Text style={styles.assignmentDescription}>{assignment.description}</Text>
                        <View style={styles.assignmentFooter}>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Needs Grading</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => onGradeAssignment(assignment, pendingSubmissions[0])}
                            >
                                <Text style={styles.actionButtonText}>Grade Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}

            <TouchableOpacity style={styles.createButton} onPress={onCreateAssignment}>
                <AntDesign name="plus" size={20} color="white" />
                <Text style={styles.createButtonText}>Create New Assignment</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AssignmentList;