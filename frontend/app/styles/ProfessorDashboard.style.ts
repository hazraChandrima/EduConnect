import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#4252e5",
        paddingHorizontal: 15,
        paddingVertical: 10,
        elevation: 4,
        zIndex: 2000,
    },
    logo: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: 'relative',
        zIndex: 2000, // Ensure it's above other components
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    profileName: {
        color: "white",
        fontWeight: "500",
    },
    scrollView: {
        flex: 1,
    },
    welcomeBanner: {
        backgroundColor: "#52c4eb",
        padding: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        zIndex: 1,
    },
    welcomeTitle: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    welcomeSubtitle: {
        color: "white",
        fontSize: 16,
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    statCard: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        width: "48%",
        alignItems: "center",
        marginBottom: 10,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4252e5",
        marginBottom: 5,
    },
    statLabel: {
        color: "#777",
        fontSize: 14,
    },
    sectionContainer: {
        marginVertical: 15,
        paddingHorizontal: 15,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        marginLeft: 15,
    },
    viewAllText: {
        color: "#4252e5",
        fontWeight: "500",
    },
    courseItem: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        alignItems: "center",
    },
    courseIcon: {
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    courseDetails: {
        flex: 1,
        justifyContent: "center",
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    studentsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    studentsText: {
        marginLeft: 5,
        color: "#777",
        fontSize: 14,
    },
    assignmentItem: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    assignmentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    courseTag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    courseTagText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
    submissionsText: {
        color: "#777",
        fontSize: 14,
    },
    assignmentTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    assignmentDescription: {
        color: "#666",
        marginBottom: 10,
    },
    assignmentFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statusBadge: {
        backgroundColor: "#ffe5ed",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        color: "#ff5694",
        fontSize: 12,
        fontWeight: "500",
    },
    actionButton: {
        // No background to keep it clean
    },
    actionButtonText: {
        color: "#4252e5",
        fontWeight: "500",
    },
    navigationBar: {
        flexDirection: "row",
        backgroundColor: "white",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        elevation: 8,
    },
    navItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    navText: {
        fontSize: 10,
        marginTop: 3,
        color: "#777",
    },
    navActive: {
        color: "#5c51f3",
    },
    // Chart styles
    chartCard: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    chart: {
        borderRadius: 10,
        marginVertical: 8,
    },
    // Create button
    createButton: {
        backgroundColor: "#4252e5",
        borderRadius: 10,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        margin:15,
    },
    createButtonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 10,
    },
    // Tab styles
    tabHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tabTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    addButton: {
        backgroundColor: "#4252e5",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    // Course filters
    courseFilters: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
    },
    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: "#f0f0f0",
    },
    filterText: {
        color: "#777",
    },
    activeFilter: {
        backgroundColor: "#4252e5",
    },
    activeFilterText: {
        color: "white",
        fontWeight: "500",
    },
    // Course cards
    courseCard: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
        overflow: "hidden",
    },
    courseCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    courseCardCode: {
        color: "white",
        fontWeight: "bold",
    },
    courseCardBody: {
        padding: 15,
    },
    courseCardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    courseCardStats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    courseCardStat: {
        flexDirection: "row",
        alignItems: "center",
    },
    courseCardStatText: {
        marginLeft: 5,
        color: "#777",
    },
    // Course detail
    courseDetailContainer: {
        padding: 15,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    backButtonText: {
        color: "#4252e5",
        marginLeft: 5,
        fontWeight: "500",
    },
    courseHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4252e5",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    courseHeaderInfo: {
        marginLeft: 15,
    },
    courseHeaderTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    courseHeaderCode: {
        color: "rgba(255, 255, 255, 0.8)",
    },
    courseStats: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    courseStat: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        width: "48%",
        alignItems: "center",
        marginBottom: 10,
        elevation: 2,
    },
    courseStatValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4252e5",
        marginBottom: 5,
    },
    courseStatLabel: {
        color: "#777",
    },
    courseActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    courseAction: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        width: "31%",
        alignItems: "center",
        marginBottom: 10,
        elevation: 2,
    },
    courseActionText: {
        color: "#4252e5",
        marginTop: 5,
        textAlign: "center",
        fontSize: 12,
    },
    // Student items
    studentItem: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        alignItems: "center",
    },
    studentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#4252e5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    studentEmail: {
        color: "#777",
    },
    // Attendance tab
    attendanceFilters: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
    },
    attendanceActions: {
        flexDirection: "row",
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    attendanceAction: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginRight: 10,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
    },
    attendanceActionText: {
        color: "#4252e5",
        marginLeft: 10,
        fontWeight: "500",
    },
    attendanceRecord: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
    },
    attendanceRecordHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    attendanceRecordDate: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    attendanceStats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    attendanceStat: {
        alignItems: "center",
    },
    attendanceStatValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4252e5",
        marginBottom: 5,
    },
    attendanceStatLabel: {
        color: "#777",
        fontSize: 12,
    },
    // Grading tab
    gradingFilters: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
    },
    gradingItem: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
    },
    gradingItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    gradingItemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    gradingItemDescription: {
        color: "#666",
        marginBottom: 10,
    },
    gradingItemFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    gradingButton: {
        backgroundColor: "#4252e5",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    gradingButtonText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "500",
    },
    // Student filters
    studentFilters: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
    },
    // Student detail
    studentDetailContainer: {
        padding: 15,
    },
    studentProfile: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        elevation: 2,
    },
    studentProfileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#4252e5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    studentProfileName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    studentProfileId: {
        color: "#777",
        marginBottom: 5,
    },
    studentProfileEmail: {
        color: "#777",
    },
    studentCoursePerformance: {
        marginBottom: 15,
    },
    studentCourseItem: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    studentCourseHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    studentCourseTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    studentCourseGrade: {
        backgroundColor: "#e6f7ff",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    studentCourseGradeText: {
        color: "#4252e5",
        fontWeight: "bold",
    },
    studentCourseStat: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    studentCourseStatLabel: {
        width: 100,
        color: "#777",
    },
    progressBar: {
        flex: 1,
        height: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        marginHorizontal: 10,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#4252e5",
    },
    studentCourseStatValue: {
        width: 50,
        textAlign: "right",
        color: "#333",
        fontWeight: "bold",
    },
    assignmentsHeader: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    studentAssignmentItem: {
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    studentAssignmentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    studentAssignmentTitle: {
        fontWeight: "500",
        color: "#333",
    },
    studentAssignmentStatus: {
        color: "#777",
    },
    studentAssignmentGrading: {
        flexDirection: "row",
        alignItems: "center",
    },
    studentAssignmentLabel: {
        color: "#777",
        marginRight: 10,
    },
    studentAssignmentGrade: {
        fontWeight: "bold",
        color: "#4252e5",
    },
    studentAssignmentDueDate: {
        color: "#ff5694",
    },
    gradeButton: {
        backgroundColor: "#4252e5",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    gradeButtonText: {
        color: "white",
        fontWeight: "500",
        fontSize: 12,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        width: "90%",
        maxHeight: "80%",
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    modalContent: {
        padding: 15,
    },
    inputLabel: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
        marginTop: 10,
    },
    textInput: {
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#eee",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    pickerContainer: {
        marginBottom: 15,
    },
    courseOption: {
        backgroundColor: "#f9f9f9",
        padding: 12,
        borderRadius: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: "#eee",
    },
    courseOptionText: {
        color: "#333",
    },
    selectedCourseOption: {
        backgroundColor: "#4252e5",
        borderColor: "#4252e5",
    },
    selectedCourseOptionText: {
        color: "white",
    },
    submitButton: {
        backgroundColor: "#4252e5",
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    // Grading modal
    gradingAssignmentInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    gradingAssignmentTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    gradingStudentName: {
        fontSize: 16,
        color: "#333",
        marginBottom: 15,
    },
    // Attendance modal
    attendanceList: {
        marginBottom: 15,
    },
    attendanceListItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 12,
        borderRadius: 5,
        marginBottom: 5,
    },
    attendanceStudentInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    attendanceStudentName: {
        marginLeft: 10,
        color: "#333",
    },
    attendanceOptions: {
        flexDirection: "row",
    },
    attendanceOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
        borderWidth: 1,
        borderColor: "#eee",
    },
    presentOption: {
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
    },
    absentOption: {
        backgroundColor: "#F44336",
        borderColor: "#F44336",
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileDropdown: {
        position: 'absolute',
        top: 45,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 3000,
    },
    profileMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    profileMenuItemText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    refreshButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f7',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
});

export default styles;
