import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput
} from "react-native";
import { MaterialIcons, Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import styles from "../../styles/AdminDashboard.style";
import { Course } from "@/types/types";


interface CoursesListProps {
    courses: Course[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onCourseSelect: (course: Course) => void;
    onAddCourse: () => void;
    onDeleteCourse: (course: Course) => void;
}


export default function CoursesList({
    courses,
    searchQuery,
    setSearchQuery,
    onCourseSelect,
    onAddCourse,
    onDeleteCourse
}: CoursesListProps) {
    return (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Course Management</Text>
                <TouchableOpacity style={styles.addButton} onPress={onAddCourse}>
                    <AntDesign name="plus" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close" size={20} color="#777" />
                    </TouchableOpacity>
                ) : null}
            </View>

            <FlatList
                data={courses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.courseItem} onPress={() => onCourseSelect(item)}>
                        <View style={styles.courseItemIcon}>
                            <MaterialIcons name="library-books" size={24} color="white" />
                        </View>
                        <View style={styles.courseItemInfo}>
                            <Text style={styles.courseItemTitle}>{item.title}</Text>
                            <Text style={styles.courseItemCode}>{item.code}</Text>
                            <Text style={styles.courseItemDepartment}>{item.department}</Text>
                        </View>
                        <View style={styles.courseItemActions}>
                            <TouchableOpacity
                                style={styles.courseItemActionButton}
                                onPress={() => onDeleteCourse(item)}
                            >
                                <Feather name="trash-2" size={20} color="#FF4081" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.courseItemActionButton}>
                                <Feather name="edit" size={20} color="#4169E1" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>No courses found</Text>
                    </View>
                }
            />
        </>
    );
}