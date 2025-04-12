import { Dimensions, StyleSheet } from "react-native"
const { width } = Dimensions.get("window")

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
    desktopHeader: {
        paddingLeft: 280, // Space for sidebar
        // transition: "padding-left 0.3s ease",
    },
    desktopHeaderWithCollapsedSidebar: {
        paddingLeft: 80, // Space for collapsed sidebar
    },
    headerTitle: {
        flex: 1,
    },
    headerTitleText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    logo: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
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
    contentContainer: {
        flex: 1,
        flexDirection: "row",
    },
    desktopContentContainer: {
        paddingLeft: 280, // Space for sidebar
        // transition: "padding-left 0.3s ease",
    },
    desktopContentContainerWithCollapsedSidebar: {
        paddingLeft: 80, // Space for collapsed sidebar
    },
    mainContent: {
        flex: 1,
    },
    desktopMainContent: {
        padding: 20,
    },
    scrollView: {
        flex: 1,
    },
    desktopScrollViewContent: {
        paddingBottom: 40,
    },
    welcomeBanner: {
        backgroundColor: "#52c4eb",
        padding: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        zIndex: 1,
    },
    desktopWelcomeBanner: {
        borderRadius: 15,
        marginBottom: 20,
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
    desktopStatsContainer: {
        flexWrap: "nowrap",
        gap: 15,
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
    desktopStatCard: {
        width: "auto",
        flex: 1,
        marginBottom: 0,
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
    desktopSectionContainer: {
        marginVertical: 20,
        paddingHorizontal: 0,
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
        marginHorizontal: 10,
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
        margin: 15,
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
    tabContent: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    desktopTabContent: {
        padding: 0,
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
    desktopCourseCard: {
        marginHorizontal: 10,
        flex: 1,
        minWidth: 300,
        maxWidth: 400,
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
    desktopCourseDetailContainer: {
        padding: 0,
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
    desktopCourseStats: {
        flexWrap: "nowrap",
        gap: 15,
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
    desktopCourseActions: {
        flexWrap: "nowrap",
        gap: 15,
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
    desktopModalContainer: {
        width: "60%",
        maxWidth: 800,
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
        marginBottom: 8,
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
        flexDirection: "row",
        alignItems: "center",
    },
    profileDropdown: {
        position: "absolute",
        top: 45,
        right: 0,
        backgroundColor: "white",
        borderRadius: 8,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 3000,
    },
    profileMenuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    profileMenuItemText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#333",
    },
    refreshButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#f0f0f7",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    attendanceRecordDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    attendanceRecordStudent: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    attendanceRecordStatus: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#4252e5",
    },
    viewSubmissionButton: {
        backgroundColor: "#4252e5",
        borderRadius: 5,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 15,
    },
    viewSubmissionButtonText: {
        color: "white",
        fontWeight: "500",
        marginLeft: 10,
    },
    excusedOption: {
        backgroundColor: "#FFC107",
        borderColor: "#FFC107",
    },
    // Attendance Course Section
    attendanceCourseSection: {
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    desktopAttendanceCourseSection: {
        flex: 1,
        minWidth: 300,
        maxWidth: 500,
        margin: 8,
    },
    // Attendance Date Card
    attendanceDateCard: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    attendanceDateHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    attendanceDateText: {
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 8,
        color: "#333333",
    },
    attendanceCountText: {
        fontSize: 14,
        color: "#666666",
        marginLeft: "auto",
    },

    // Attendance Students List
    attendanceStudentsList: {
        marginTop: 8,
    },
    attendanceStudentItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    attendanceStatusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginLeft: "auto",
    },
    presentBadge: {
        backgroundColor: "#e6f7ee",
    },
    absentBadge: {
        backgroundColor: "#ffebee",
    },
    excusedBadge: {
        backgroundColor: "#fff8e1",
    },
    unknownBadge: {
        backgroundColor: "#f0f0f0",
    },
    attendanceStatusText: {
        fontSize: 12,
        fontWeight: "500",
    },

    // View More Button
    viewMoreButton: {
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 8,
    },
    viewMoreText: {
        color: "#4252e5",
        fontSize: 14,
    },

    // Take Attendance Button
    takeAttendanceButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4252e5",
        paddingVertical: 12,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    takeAttendanceButtonText: {
        color: "white",
        fontWeight: "600",
        marginLeft: 8,
    },

    // Empty State
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "white",
        borderRadius: 8,
        marginVertical: 16,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333333",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateMessage: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
        marginBottom: 16,
    },
    emptyStateButton: {
        backgroundColor: "#4252e5",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    emptyStateButtonText: {
        color: "white",
        fontWeight: "600",
    },

    // Grading Assignment Card
    gradingAssignmentCard: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    desktopGradingAssignmentCard: {
        flex: 1,
        minWidth: 300,
        maxWidth: 500,
        margin: 8,
    },
    gradingAssignmentHeader: {
        flexDirection: "row",
        marginBottom: 12,
    },
    submissionsCountText: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 12,
    },

    // Submissions List
    submissionsList: {
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        paddingTop: 12,
    },
    submissionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    submissionStudent: {
        flexDirection: "row",
        alignItems: "center",
    },
    submissionStudentName: {
        marginLeft: 10,
        fontSize: 14,
        color: "#333333",
    },
    submissionInfo: {
        alignItems: "flex-end",
    },
    submissionDate: {
        fontSize: 12,
        color: "#666666",
        marginBottom: 4,
    },

    // Grade Reports
    gradeReportsContainer: {
        marginBottom: 16,
    },
    gradeReportCard: {
        width: width / 2.5,
        backgroundColor: "white",
        borderRadius: 8,
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        overflow: "hidden",
    },
    desktopGradeReportCard: {
        width: "auto",
        flex: 1,
        minWidth: 200,
        maxWidth: 300,
        margin: 8,
    },
    gradeReportHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
    },
    gradeReportTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
    gradeReportBody: {
        alignItems: "center",
        padding: 16,
    },
    gradeReportAvg: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333333",
    },
    gradeReportLabel: {
        fontSize: 12,
        color: "#666666",
        marginTop: 4,
    },
    gradeReportStudents: {
        fontSize: 12,
        color: "#999999",
        marginTop: 8,
    },

    // Student Management
    searchInput: {
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    studentCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    desktopStudentCard: {
        flex: 1,
        minWidth: 300,
        maxWidth: 500,
        margin: 8,
    },
    studentCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    studentCardInfo: {
        marginLeft: 12,
    },
    studentCardName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
    },
    studentCardEmail: {
        fontSize: 14,
        color: "#666666",
    },
    studentCardCourses: {
        flexDirection: "row",
        marginRight: 12,
    },
    studentCourseBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 4,
    },
    studentCourseBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "500",
    },
    moreCoursesBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "#f0f0f0",
    },
    moreCoursesBadgeText: {
        color: "#666666",
        fontSize: 12,
    },

    // Student Profile
    studentProfileContainer: {
        flex: 1,
    },
    studentProfileHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    desktopStudentProfileHeader: {
        padding: 24,
    },
    studentProfileInfo: {
        marginLeft: 16,
        flex: 1,
    },
    studentProfileProgram: {
        fontSize: 14,
        color: "#999999",
        marginTop: 4,
    },

    // Student Stats
    studentStatsContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    desktopStudentStatsContainer: {
        padding: 8,
    },
    studentStat: {
        flex: 1,
        alignItems: "center",
        padding: 16,
        borderRightWidth: 1,
        borderRightColor: "#f0f0f0",
    },
    studentStatValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333333",
    },
    studentStatLabel: {
        fontSize: 12,
        color: "#666666",
        marginTop: 4,
    },

    // Student Profile Tabs
    studentTabsContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    studentTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    studentTabText: {
        fontSize: 14,
        color: "#999999",
    },

    // Grade Items
    gradeItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "white",
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    desktopGradeItem: {
        flex: 1,
        minWidth: 300,
        maxWidth: 500,
        margin: 8,
    },
    gradeItemInfo: {
        flex: 1,
    },
    gradeItemTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 4,
    },
    gradeItemType: {
        fontSize: 14,
        color: "#999999",
        marginTop: 4,
    },
    gradeScore: {
        alignItems: "flex-end",
    },
    gradeScoreText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    gradeScoreA: {
        color: "#4caf50",
    },
    gradeScoreB: {
        color: "#8bc34a",
    },
    gradeScoreC: {
        color: "#ffc107",
    },
    gradeScoreD: {
        color: "#ff9800",
    },
    gradeScoreF: {
        color: "#f44336",
    },
    gradePercentage: {
        fontSize: 14,
        color: "#666666",
    },
    emptyGrades: {
        padding: 16,
        backgroundColor: "white",
        borderRadius: 8,
        alignItems: "center",
    },
    emptyGradesText: {
        color: "#999999",
        fontSize: 14,
    },

    // Desktop specific styles
    desktopChartsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    desktopChartItem: {
        width: "100%",
        marginBottom: 20,
    },
    desktopContentGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    desktopContentColumn: {
        width: "49%",
    },
    desktopCoursesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        margin: -8, // Negative margin to offset the padding of child elements
    },
    desktopAttendanceGrid: {
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        margin: -8,
    },
    desktopGradingGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        margin: -8,
    },
    desktopGradeReportsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        margin: -8,
    },
    desktopStudentsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        margin: -8,
    },
    desktopGradesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        margin: -8,
    },

    // Sidebar styles
    sidebar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 280,
        backgroundColor: "#0b1d40",
        zIndex: 1000,
        // transition: "width 0.3s ease",
    },
    collapsedSidebar: {
        width: 80,
    },
    sidebarHeader: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
    },
    sidebarLogo: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    sidebarToggle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    sidebarContent: {
        flex: 1,
        paddingTop: 20,
    },
    sidebarItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    sidebarItemActive: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderLeftWidth: 4,
        borderLeftColor: "#5c51f3",
    },
    sidebarItemText: {
        color: "white",
        marginLeft: 15,
        fontSize: 16,
    },
    sidebarItemTextActive: {
        fontWeight: "bold",
    },
    sidebarLogout: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
    },
    sidebarLogoutText: {
        color: "white",
        marginLeft: 15,
        fontSize: 16,
    },
    attendanceOptionLabel: {
        fontSize: 12,
        marginTop: 4,
        color: "#333",
    },
    studentSubmissionsContainer: {
        marginTop: 8,
    },
    studentSubmissionItem: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    studentSubmissionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    studentSubmissionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    submissionStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    gradedBadge: {
        backgroundColor: "#d8f5e5",
    },
    pendingBadge: {
        backgroundColor: "#e0eaff",
    },
    submissionStatusText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },
    studentSubmissionDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    studentSubmissionDate: {
        fontSize: 13,
        color: "#777",
    },
    studentSubmissionGrade: {
        flexDirection: "row",
        alignItems: "center",
    },
    studentSubmissionGradeLabel: {
        fontSize: 13,
        color: "#555",
        marginRight: 4,
    },
    studentSubmissionGradeValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#22a67c",
    },
    gradeSubmissionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#5c51f3",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    gradeSubmissionButtonText: {
        color: "white",
        marginLeft: 6,
        fontWeight: "600",
        fontSize: 13,
    },
    emptySubmissions: {
        padding: 16,
        alignItems: "center",
    },
    emptySubmissionsText: {
        color: "#666",
        fontSize: 14,
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
    },
    viewAllButtonText: {
        color: "#4252e5",
        fontSize: 14,
        fontWeight: "500",
        marginRight: 4,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
    },
    grantButton: {
        backgroundColor: '#4CAF50', // Green color for "grant" action
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        justifyContent: 'center',
        alignItems: 'center',
        height: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        marginHorizontal: 8,
    },

    grantButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    accessTimerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff0f5",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ffcce0",
    },
    accessTimerText: {
        fontSize: 12,
        color: "#ff5694",
        marginLeft: 4,
        fontWeight: "500",
    },

    // Filters section
    filtersScrollView: {
        marginBottom: 10,
    },
    attendanceStatsContainer: {
        marginBottom: 20,
    },
    attendanceStatsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    attendanceStatCard: {
        width: "48%",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    statusBadgeText: {
        fontWeight: "500",
        fontSize: 14,
    },
    // Loading
    loadingContainer: {
        padding: 20,
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    },
    desktopAttendanceRecord: {
        width: "48%",
    },
    attendanceRecordStudentName: {
        fontSize: 14,
        color: "#333",
        marginLeft: 6,
    },
    modalDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
    },
    searchAndFilters: {
        marginBottom: 16,
    },
    attendanceRecordsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    recordsCount: {
        fontSize: 14,
        color: "#666",
    },
    deleteButton: {
        marginLeft: 8,
        padding: 4,
    },
    attendanceRecordActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    bulkActionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 12,
    },
    bulkActionButton: {
        flex: 1,
        backgroundColor: "#f0f4ff",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: "center",
    },
    bulkActionText: {
        color: "#4252e5",
        fontSize: 14,
        fontWeight: "500",
    },
    disabledButton: {
        opacity: 0.5,
    },
    accessButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    revokeButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#e53e3e",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    revokeButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8,
    },
})

export default styles
