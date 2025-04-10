import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "../../styles/AdminDashboard.style";
import { APP_CONFIG } from "@/app-config";

const API_BASE_URL = APP_CONFIG.API_BASE_URL;

interface CourseFormProps {
    professors: any[];
    onClose: () => void;
    onSuccess: (newCourse: any) => void;
}

export default function CourseForm({ professors, onClose, onSuccess }: CourseFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: "",
        code: "",
        department: "",
        professorId: "",
        credits: "",
        description: "",
        color: "#5c51f3",
        icon: "book",
    });

    const handleAddCourse = async () => {
        if (!newCourse.title || !newCourse.code || !newCourse.department || !newCourse.professorId) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${API_BASE_URL}/api/courses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newCourse.title,
                    code: newCourse.code,
                    department: newCourse.department,
                    professorId: newCourse.professorId,
                    description: newCourse.description,
                    credits: parseInt(newCourse.credits) || 3,
                    color: newCourse.color,
                    icon: newCourse.icon,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Course created successfully");
                onSuccess(data.course);
            } else {
                Alert.alert("Error", data.error || "Failed to create course");
            }
        } catch (error) {
            console.error("Error creating course:", error);
            Alert.alert("Error", "Failed to create course");
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Course</Text>
                <TouchableOpacity onPress={onClose}>
                    <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
                <Text style={styles.inputLabel}>Course Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter course name"
                    value={newCourse.title}
                    onChangeText={(text) => setNewCourse({ ...newCourse, title: text })}
                />

                <Text style={styles.inputLabel}>Course Code</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter course code"
                    value={newCourse.code}
                    onChangeText={(text) => setNewCourse({ ...newCourse, code: text })}
                />

                <Text style={styles.inputLabel}>Department</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter department"
                    value={newCourse.department}
                    onChangeText={(text) => setNewCourse({ ...newCourse, department: text })}
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Enter course description"
                    multiline={true}
                    numberOfLines={4}
                    value={newCourse.description}
                    onChangeText={(text) => setNewCourse({ ...newCourse, description: text })}
                />

                <Text style={styles.inputLabel}>Professor</Text>
                <View style={styles.pickerContainer}>
                    {professors.map((professor) => (
                        <TouchableOpacity
                            key={professor._id}
                            style={[
                                styles.professorOption,
                                newCourse.professorId === professor._id && styles.selectedProfessorOption,
                            ]}
                            onPress={() => setNewCourse({ ...newCourse, professorId: professor._id })}
                        >
                            <Text
                                style={[
                                    styles.professorOptionText,
                                    newCourse.professorId === professor._id && styles.selectedProfessorOptionText,
                                ]}
                            >
                                {professor.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.inputLabel}>Credits</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter credits"
                    keyboardType="numeric"
                    value={newCourse.credits}
                    onChangeText={(text) => setNewCourse({ ...newCourse, credits: text })}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleAddCourse} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Add Course</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}