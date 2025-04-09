import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import styles from "../../styles/AdminDashboard.style";
import { UserData, Course } from "@/types/types";


interface CourseDetailProps {
    course: Course;
    onBack: () => void;
    onDelete: (course: Course) => void;
    onStudentSelect: (student: UserData) => void;
}

export default function CourseDetail({
    course,
    onBack,
    onDelete,
    onStudentSelect
}: CourseDetailProps) {
    return (
        <View style={styles.courseDetailContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color="#4169E1" />
                <Text style={styles.backButtonText}>Back to Courses</Text>
            </TouchableOpacity>

            <View style={styles.courseHeader}>
                <MaterialIcons name="library-books" size={40} color="#4169E1" />
                <View style={styles.courseHeaderInfo}>
                    <Text style={styles.courseHeaderTitle}>{course.title}</Text>
                    <Text style={styles.courseHeaderCode}>{course.code}</Text>
                </View>
            </View>

            <View style={styles.courseInfoSection}>
                <View style={styles.courseInfoItem}>
                    <Text style={styles.courseInfoLabel}>Department:</Text>
                    <Text style={styles.courseInfoValue}>{course.department}</Text>
                </View>
                <View style={styles.courseInfoItem}>
                    <Text style={styles.courseInfoLabel}>Professor:</Text>
                    <Text style={styles.courseInfoValue}>{course.professor.name}</Text>
                </View>
                <View style={styles.courseInfoItem}>
                    <Text style={styles.courseInfoLabel}>Students Enrolled:</Text>
                    <Text style={styles.courseInfoValue}>{course.students.length}</Text>
                </View>
                <View style={styles.courseInfoItem}>
                    <Text style={styles.courseInfoLabel}>Credits:</Text>
                    <Text style={styles.courseInfoValue}>{course.credits}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Enrolled Students</Text>
            <FlatList
                data={course.students}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.studentItem}
                        onPress={() => onStudentSelect(item)}
                    >
                        <View style={styles.studentAvatar}>
                            <Ionicons name="person" size={24} color="white" />
                        </View>
                        <View style={styles.studentInfo}>
                            <Text style={styles.studentName}>{item.name}</Text>
                            <Text style={styles.studentEmail}>{item.email}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>No students enrolled</Text>
                    </View>
                }
            />

            <View style={styles.courseActions}>
                <TouchableOpacity style={styles.editButton}>
                    <Feather name="edit" size={20} color="white" />
                    <Text style={styles.editButtonText}>Edit Course</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(course)}
                >
                    <Feather name="trash-2" size={20} color="white" />
                    <Text style={styles.deleteButtonText}>Delete Course</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}