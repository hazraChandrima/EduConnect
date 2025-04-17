import { View, Text, TouchableOpacity } from "react-native"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import styles from "../../../styles/StudentDashboard.style"
import AcademicAnalytics from "../AcademicAnalytics"
import { Dimensions } from "react-native"

const screenWidth = Dimensions.get("window").width


interface Assignment {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    status: "submitted" | "graded" | "late" | "pending";
    color?: string;
    courseCode?: string;
}

interface Course {
    _id: string;
    title: string;
    color: string;
    icon: string;
    progress: number;
    professor: {
        name: string;
    };
}

interface HomeTabProps {
    firstName: string;
    courses: Course[];
    assignments: Assignment[];
    attendance: Array<{ status: string }>;
    gpa: Array<{ value: number }>;
    userId: string;
    handleCourseSelect: (course: Course) => void;
    handleAssignmentSelect: (assignment: Assignment) => void;
    isDesktop: boolean;
    isSmallDevice: { width: number; isSmallDevice: boolean; };
}

// Define the interface for the AssignmentCard component
interface AssignmentCardProps {
    assignment: Assignment;
    handleAssignmentSelect: (assignment: Assignment) => void;
    isDesktop: boolean;
    onStatusChange?: (assignmentId: string, newStatus: "submitted" | "graded" | "late" | "pending") => void;
}


export default function HomeTab({
    firstName,
    courses,
    assignments,
    attendance,
    gpa,
    userId,
    handleCourseSelect,
    handleAssignmentSelect,
    isDesktop,
    isSmallDevice,
}: HomeTabProps) {

    const calculateOverallAttendancePercentage = (): number => {
        if (attendance.length === 0) return 0
        const presentCount = attendance.filter((a) => a.status === "present" || a.status === "excused").length
        return Math.round((presentCount / attendance.length) * 100)
    }



    return (
        <>
            {/* Welcome Banner */}
            <View style={[styles.welcomeBanner, isDesktop && styles.desktopWelcomeBanner]}>
                <Text style={styles.welcomeTitle}>Hello, {firstName}!</Text>
                <Text style={styles.welcomeSubtitle}>Welcome back to your student dashboard</Text>

                <View
                    style={[
                        styles.statsContainer,
                        isSmallDevice
                            ? { flexDirection: "row", alignItems: "center" }
                            : isDesktop
                                ? styles.desktopStatsContainer
                                : styles.tabletStatsContainer,
                    ]}
                >
                    <View
                        style={[
                            styles.statCard,
                            isDesktop && styles.desktopStatCard,
                            !isDesktop && { width: screenWidth * 0.4 }, 
                        ]}
                    >
                        <Text style={styles.statValue}>{calculateOverallAttendancePercentage()}%</Text>
                        <Text style={styles.statLabel}>Attendance</Text>
                    </View>
                    <View
                        style={[
                            styles.statCard,
                            isDesktop && styles.desktopStatCard,
                            !isDesktop && { width: screenWidth * 0.4 }, 
                        ]}
                    >
                        <Text style={styles.statValue}>{gpa.length > 0 ? gpa[gpa.length - 1].value : 0}</Text>
                        <Text style={styles.statLabel}>GPA</Text>
                    </View>
                    <View
                        style={[
                            styles.statCard,
                            isDesktop && styles.desktopStatCard,
                            !isDesktop && { width: screenWidth * 0.4 }, 
                        ]}
                    >
                        <Text style={styles.statValue}>
                            {Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / (courses.length || 1))}%
                        </Text>
                        <Text style={styles.statLabel}>Semester Completed</Text>
                    </View>
                    <View
                        style={[
                            styles.statCard,
                            isDesktop && styles.desktopStatCard,
                            !isDesktop && { width: screenWidth * 0.4 }, 
                        ]}
                    >
                        <Text style={styles.statValue}>{courses.length}</Text>
                        <Text style={styles.statLabel}>Courses</Text>
                    </View>
                </View>
            </View>

            {/* Academic Analytics Section */}
            <View style={[styles.sectionContainer, isDesktop && styles.desktopSectionContainer]}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Academic Analytics</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <AcademicAnalytics userId={userId} />
            </View>

            {/* Content Grid for Desktop */}
            {isDesktop ? (
                <View style={styles.desktopContentGrid}>
                    <View style={styles.desktopContentColumn}>
                        {/* Courses Section */}
                        <View style={[styles.sectionContainer, styles.desktopSectionContainer]}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Your Courses</Text>
                                <TouchableOpacity>
                                    <Text style={styles.viewAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Course Items */}
                            <View style={styles.desktopCoursesGrid}>
                                {courses.map((course) => (
                                    <TouchableOpacity
                                        key={course._id}
                                        style={[styles.courseItem, styles.desktopCourseItem]}
                                        onPress={() => handleCourseSelect(course)}
                                    >
                                        <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                                            <FontAwesome name={course.icon as any} size={24} color="white" />
                                        </View>
                                        <View style={styles.courseDetails}>
                                            <Text style={styles.courseTitle}>{course.title}</Text>
                                            <View style={styles.professorContainer}>
                                                <Ionicons name="person" size={16} color="#777" />
                                                <Text style={styles.professorName}>{course.professor.name}</Text>
                                            </View>
                                            <View style={styles.progressBarContainer}>
                                                <View style={[styles.progressBar, { width: `${course.progress}%` }]} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.desktopContentColumn}>
                        {/* Assignments Section */}
                        <View style={[styles.sectionContainer, styles.desktopSectionContainer]}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
                                <TouchableOpacity>
                                    <Text style={styles.viewAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Assignment Items */}
                            <View style={styles.desktopAssignmentsGrid}>
                                {assignments.slice(0, 6).map((assignment) => (
                                    <AssignmentCard
                                        key={assignment._id}
                                        assignment={assignment}
                                        handleAssignmentSelect={handleAssignmentSelect}
                                        isDesktop={isDesktop}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                <>
                    {/* Courses Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Your Courses</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Course Items */}
                        <View>
                            {courses.map((course) => (
                                <TouchableOpacity
                                    key={course._id}
                                    style={styles.courseItem}
                                    onPress={() => handleCourseSelect(course)}
                                >
                                    <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                                        <FontAwesome name={course.icon as any} size={24} color="white" />
                                    </View>
                                    <View style={styles.courseDetails}>
                                        <Text style={styles.courseTitle}>{course.title}</Text>
                                        <View style={styles.professorContainer}>
                                            <Ionicons name="person" size={16} color="#777" />
                                            <Text style={styles.professorName}>{course.professor.name}</Text>
                                        </View>
                                        <View style={styles.progressBarContainer}>
                                            <View style={[styles.progressBar, { width: `${course.progress}%` }]} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Assignments Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Assignment Items */}
                        <View>
                            {assignments.slice(0, 3).map((assignment) => (
                                <AssignmentCard
                                    key={assignment._id}
                                    assignment={assignment}
                                    handleAssignmentSelect={handleAssignmentSelect}
                                    isDesktop={isDesktop}
                                />
                            ))}
                        </View>
                    </View>
                </>
            )}
        </>
    )
}



function AssignmentCard({ assignment, handleAssignmentSelect, isDesktop }: AssignmentCardProps) {
    return (
        <View key={assignment._id} style={[styles.assignmentItem, isDesktop && styles.desktopAssignmentItem]}>
            <View style={styles.assignmentHeader}>
                <View style={[styles.courseTag, { backgroundColor: assignment.color || "#5c51f3" }]}>
                    <Text style={styles.courseTagText}>{assignment.courseCode || "Course"}</Text>
                </View>
                <Text style={styles.assignmentDueDate}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.assignmentTitle}>{assignment.title}</Text>
            <Text style={styles.assignmentDescription}>{assignment.description}</Text>
            <View style={styles.assignmentFooter}>
                <View
                    style={[
                        styles.statusBadge,
                        assignment.status === "submitted"
                            ? styles.statusSubmitted
                            : assignment.status === "graded"
                                ? styles.statusGraded
                                : assignment.status === "late"
                                    ? styles.statusLate
                                    : styles.statusPending,
                    ]}
                >
                    <Text style={styles.statusText}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </Text>
                </View>
                {assignment.status !== "graded" && (
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleAssignmentSelect(assignment)}>
                        <Text style={styles.actionButtonText}>
                            {assignment.status === "submitted" ? "View/Resubmit" : "Submit Now"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}