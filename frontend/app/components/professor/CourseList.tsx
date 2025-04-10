import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import styles from "../../styles/ProfessorDashboard.style";

interface CourseListProps {
    courses: any[];
    onCourseSelect: (course: any) => void;
}


const CourseList: React.FC<CourseListProps> = ({ courses, onCourseSelect }) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Courses</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            {courses.map((course) => (
                <TouchableOpacity
                    key={course._id}
                    style={styles.courseItem}
                    onPress={() => onCourseSelect(course)}
                >
                    <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                        <FontAwesome name={course.icon as any} size={24} color="white" />
                    </View>
                    <View style={styles.courseDetails}>
                        <Text style={styles.courseTitle}>{course.title}</Text>
                        <View style={styles.studentsContainer}>
                            <Ionicons name="people" size={16} color="#777" />
                            <Text style={styles.studentsText}>{course.students.length} Students</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            ))}
        </View>
    );
};


export default CourseList;