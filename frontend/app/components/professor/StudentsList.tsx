import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_CONFIG } from '@/app-config';

const API_BASE_URL = APP_CONFIG.API_BASE_URL;

// Define interfaces for the data structure
interface Student {
    _id: string;
    name: string;
    email: string;
    // Add other student properties you need
}

// Modify the Course interface in StudentsList.tsx
interface Course {
    _id: string;
    name?: string;
    students: Student[] | string[]; // Accept either Student objects or string IDs
    // Add other course properties you need
}


interface StudentsListProps {
    course: Course;
    onSelectStudent: (student: Student) => void;
    setActiveTab: (tab: string) => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ course, onSelectStudent, setActiveTab }) => {
    const [studentsData, setStudentsData] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    // Then update the useEffect to handle either case
    useEffect(() => {
        const fetchStudentDetails = async (): Promise<void> => {
            if (!course.students || !course.students.length) return;

            setLoading(true);
            setError(null);

            try {
                // Check if students are already full objects or just IDs
                if (typeof course.students[0] === 'string') {
                    // If they're IDs, fetch the details
                    const studentIds = course.students as string[];
                    const studentsDetails = await Promise.all(
                        studentIds.map((studentId: string) =>
                            fetch(`${API_BASE_URL}/api/user/${studentId}`)
                                .then(res => res.json())
                                .then(data => data as Student)
                        )
                    );
                    setStudentsData(studentsDetails);
                } else {
                    // If they're already Student objects, just use them
                    setStudentsData(course.students as Student[]);
                }
            } catch (error) {
                console.error("Error fetching student details:", error);
                setError("Failed to load student details");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [course.students]);



    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading students...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!studentsData.length) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No students enrolled in this course</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {studentsData.map((student: Student) => (
                <TouchableOpacity
                    key={student._id}
                    style={styles.studentItem}
                    onPress={() => {
                        onSelectStudent(student);
                        setActiveTab("students");
                    }}
                >
                    <View style={styles.studentAvatar}>
                        <Ionicons name="person" size={24} color="white" />
                    </View>
                    <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentEmail}>{student.email}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            ))}
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#ffffff',
    },
    studentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '500',
    },
    studentEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
});

export default StudentsList;