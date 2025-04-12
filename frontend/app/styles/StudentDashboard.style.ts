import { Dimensions, StyleSheet } from "react-native"
const { height } = Dimensions.get("window")


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  desktopContainer: {
    height: height,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4252e5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 4,
    zIndex: 2000, // Increase z-index for the entire header
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    marginRight: 10,
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
    zIndex: 2000, // Increased z-index to ensure it's above other elements
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
    zIndex: 1, // Lower z-index for the scrollView
  },
  welcomeBanner: {
    backgroundColor: "#52c4eb",
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 1, // Ensure this is lower than the profile dropdown
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
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    flex: 0.48,
    alignItems: "center",
    margin: 5,
    minWidth: 140,
  },
  statValue: {
    fontSize: 32,
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
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  professorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  professorName: {
    marginLeft: 5,
    color: "#777",
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#52c4eb",
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
  assignmentDueDate: {
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
    fontSize: 12,
    marginTop: 3,
    color: "#777",
  },
  navActive: {
    color: "#5c51f3",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileDropdown: {
    position: "absolute",
    top: 45, // Slightly increased to ensure it's below the profile pic
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 3000, // Increased z-index to be higher than any other element
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
  // Course Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  courseModalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#777",
  },
  modalContent: {
    padding: 15,
  },
  courseTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  courseTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  courseTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#5c51f3",
  },
  courseTabText: {
    color: "#777",
    fontSize: 14,
  },
  courseTabTextActive: {
    color: "#5c51f3",
    fontWeight: "bold",
  },

  // Curriculum Styles
  curriculumContainer: {
    paddingVertical: 10,
  },
  curriculumSection: {
    marginBottom: 20,
  },
  curriculumTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  curriculumDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  curriculumUnit: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  topicsHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingLeft: 5,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5c51f3",
    marginRight: 8,
  },
  topicText: {
    fontSize: 14,
    color: "#555",
  },
  resourcesHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
    marginBottom: 5,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingLeft: 5,
  },
  resourceText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },

  // Attendance Styles
  attendanceContainer: {
    paddingVertical: 10,
  },
  attendanceSummary: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  attendanceChart: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  attendancePercentage: {
    justifyContent: "center",
    alignItems: "center",
  },
  attendancePercentageText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  attendanceStats: {
    flex: 1,
  },
  attendanceStat: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  attendanceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  attendanceStatText: {
    fontSize: 14,
    color: "#555",
  },
  attendanceHistoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  attendanceRecord: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  attendanceDate: {
    flex: 1,
  },
  attendanceDateText: {
    fontSize: 14,
    color: "#555",
  },
  attendanceStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPresent: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  statusExcused: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
  },
  statusAbsent: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
  },
  attendanceStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  // Marks Styles
  marksContainer: {
    paddingVertical: 10,
  },
  marksSummary: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  marksChart: {
    alignItems: "center",
  },
  marksAverage: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5c51f3",
  },
  marksAverageLabel: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  marksHistoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  markRecord: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  markHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  markTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  markType: {
    backgroundColor: "#5c51f3",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  markTypeText: {
    fontSize: 12,
    color: "white",
  },
  markScoreContainer: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  markScore: {
    flexDirection: "row",
    alignItems: "center",
  },
  markPercentage: {
    fontSize: 14,
    color: "#5c51f3",
  },
  markFeedback: {
    backgroundColor: "rgba(92, 81, 243, 0.1)",
    borderRadius: 6,
    padding: 8,
  },
  markFeedbackLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#5c51f3",
    marginBottom: 2,
  },
  markFeedbackText: {
    fontSize: 14,
    color: "#555",
  },

  // Remarks Styles
  remarksContainer: {
    paddingVertical: 10,
  },
  remarkItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  remarkPositive: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  remarkNegative: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  remarkNeutral: {
    backgroundColor: "rgba(92, 81, 243, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#5c51f3",
  },
  remarkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  remarkDate: {
    fontSize: 14,
    color: "#555",
  },
  remarkTypeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  remarkTypeText: {
    fontSize: 12,
    color: "#555",
  },
  remarkText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },

  // Assignment Submission Styles
  submissionSection: {
    marginBottom: 20,
  },
  submissionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  submissionDescription: {
    fontSize: 14,
    color: "#555",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  submissionDueDate: {
    fontSize: 14,
    color: "#F44336",
    fontWeight: "bold",
  },
  submissionTextInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },
  attachButton: {
    backgroundColor: "#5c51f3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  attachButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  attachedFilesContainer: {
    marginTop: 15,
  },
  attachedFile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  fileName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#5c51f3",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Courses Tab Styles
  tabContent: {
    padding: 15,
  },
  desktopTabContent: {
    padding: 0,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  coursesList: {
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  courseCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-between",
  },
  courseCardCode: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  courseCardBody: {
    padding: 15,
  },
  courseCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  courseCardProfessor: {
    fontSize: 14,
    color: "#777",
    marginBottom: 15,
  },
  courseCardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  courseCardStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseCardStatText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  courseCardProgress: {
    marginTop: 5,
  },
  courseCardProgressBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    marginBottom: 5,
  },
  courseCardProgressFill: {
    height: 6,
    borderRadius: 3,
  },
  courseCardProgressText: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },

  // Assignments Tab Styles
  assignmentFilters: {
    flexDirection: "row",
    marginBottom: 15,
  },
  assignmentFilter: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  assignmentFilterActive: {
    backgroundColor: "#5c51f3",
  },
  assignmentFilterText: {
    color: "#555",
    fontSize: 14,
  },
  assignmentFilterTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  assignmentsList: {
    paddingBottom: 20,
  },
  assignmentCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  assignmentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  assignmentCardTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  assignmentCardTagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  assignmentCardDue: {
    fontSize: 14,
    color: "#F44336",
  },
  assignmentCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  assignmentCardDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  assignmentCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignmentCardStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
  },
  assignmentCardStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  assignmentCardAction: {
    backgroundColor: "#5c51f3",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  assignmentCardActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  statusSubmitted: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  statusGraded: {
    backgroundColor: "rgba(33, 150, 243, 0.2)",
  },
  statusLate: {
    backgroundColor: "rgba(255, 152, 0, 0.2)",
  },
  statusPending: {
    backgroundColor: "rgba(158, 158, 158, 0.2)",
  },

  // Attendance Tab Styles
  attendanceOverview: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  attendanceOverviewChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  attendanceOverviewPercentage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  attendanceOverviewLabel: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },

  attendanceOverviewLegend: {
    flex: 1,
    justifyContent: "center",
  },
  attendanceLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  attendanceLegendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  attendanceLegendText: {
    fontSize: 14,
    color: "#555",
  },
  attendanceCoursesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  attendanceCourseItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  attendanceCourseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  attendanceCourseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  attendanceCourseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  attendanceCourseStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendanceCourseProgress: {
    flex: 1,
    marginRight: 10,
  },
  attendanceCourseProgressBar: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  attendanceCourseProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  attendanceCoursePercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  // Desktop specific styles
  desktopLayout: {
    flex: 1,
    height: "100%",
  },
  desktopHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4252e5",
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
  },
  mainContentWithSidebar: {
    marginLeft: 280, // Space for sidebar
    // transition: "margin-left 0.3s ease",
  },
  mainContentWithCollapsedSidebar: {
    marginLeft: 80, // Space for collapsed sidebar
  },
  desktopWelcomeBanner: {
    borderRadius: 15,
    marginBottom: 20,
  },
  desktopSectionContainer: {
    marginVertical: 20,
    paddingHorizontal: 0,
  },
  desktopStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    gap: 15,
  },
  tabletStatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  desktopStatCard: {
    flex: 1,
    margin: 0,
  },
  desktopScrollView: {
    padding: 20,
  },
  desktopCourseItem: {
    width: "98%",
    marginBottom: 15,
  },
  desktopAssignmentItem: {
    width: "98%",
    marginBottom: 15,
  },
  desktopCourseCard: {
    // width: "48%",
    marginHorizontal: "1%",
  },
  desktopCoursesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  desktopAssignmentFilters: {
    marginBottom: 20,
  },
  desktopAssignmentCard: {
    // width: "48%",
    marginHorizontal: "1%",
  },
  desktopAssignmentsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  desktopAttendanceOverview: {
    padding: 20,
  },
  desktopAttendanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  desktopAttendanceCourseItem: {
    width: "48%",
    marginBottom: 15,
  },
  desktopModalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  desktopModalContainer: {
    width: "60%",
    maxWidth: 800,
    maxHeight: "90%",
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
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  desktopAssignmentsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-between",
  },

  // Sidebar styles
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "#2c3e50",
    zIndex: 1000,
    // transition: "width 0.3s ease",
  },
  mobileSidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: 280,
    backgroundColor: "#2c3e50",
    zIndex: 3000,
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
  sidebarFooter: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  sidebarLogout: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sidebarLogoutText: {
    color: "white",
    marginLeft: 15,
    fontSize: 16,
  },
})

export default styles
