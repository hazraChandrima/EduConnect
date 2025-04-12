import React from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "../../../styles/ProfessorDashboard.style";

interface AssignmentModalProps {
    visible: boolean;
    onClose: () => void;
    newAssignment: {
        title: string;
        description: string;
        dueDate: string;
        courseId: string;
    };
    setNewAssignment: (assignment: any) => void;
    courses: any[];
    handleCreateAssignment: () => void;
    isLoading: boolean;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
    visible,
    onClose,
    newAssignment,
    setNewAssignment,
    courses,
    handleCreateAssignment,
    isLoading
}) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Create New Assignment</Text>
                        <TouchableOpacity onPress={onClose}>
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
                            {courses.map((course) => (
                                <TouchableOpacity
                                    key={course._id}
                                    style={[styles.courseOption, newAssignment.courseId === course._id && styles.selectedCourseOption]}
                                    onPress={() => setNewAssignment({ ...newAssignment, courseId: course._id })}
                                >
                                    <Text
                                        style={[
                                            styles.courseOptionText,
                                            newAssignment.courseId === course._id && styles.selectedCourseOptionText,
                                        ]}
                                    >
                                        {course.title}
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
    );
};

export default AssignmentModal;