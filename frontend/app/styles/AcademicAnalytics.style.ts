import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 15,
    },
    desktopContainer: {
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tabContainer: {
        backgroundColor: "#f5f5f5",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    desktopTabContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: "#fff",
    },
    desktopTab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 15,
    },
    activeTab: {
        backgroundColor: "rgba(92, 81, 243, 0.1)",
    },
    desktopActiveTab: {
        backgroundColor: "rgba(92, 81, 243, 0.15)",
    },
    tabText: {
        marginLeft: 5,
        fontSize: 14,
        color: "#777",
    },
    desktopTabText: {
        fontSize: 16,
        marginLeft: 8,
    },
    activeTabText: {
        color: "#5c51f3",
        fontWeight: "bold",
    },
    desktopActiveTabText: {
        fontWeight: "bold",
    },
    chartContainer: {
        padding: 15,
    },
    desktopChartContainer: {
        padding: 25,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    chartSubtitle: {
        fontSize: 14,
        color: "#777",
        marginBottom: 15,
    },
    chart: {
        marginVertical: 10,
        borderRadius: 16,
    },
    attendanceDetails: {
        marginTop: 20,
    },
    desktopAttendanceDetails: {
        marginTop: 30,
    },
    desktopAttendanceGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    desktopAttendanceItem: {
        width: "48%",
        marginBottom: 15,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    attendanceItem: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    attendanceItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    attendanceItemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    attendanceItemValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#5c51f3",
    },
    attendanceItemDetail: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    attendanceWarning: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    attendanceWarningText: {
        fontSize: 12,
        color: "#ffc107",
        marginLeft: 5,
    },
    marksDetails: {
        marginTop: 20,
    },
    desktopMarksDetails: {
        marginTop: 30,
    },
    desktopMarksGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    desktopMarksItem: {
        width: "48%",
        marginBottom: 15,
    },
    marksItem: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    marksItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    subjectTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
    },
    subjectTagText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    gradeContainer: {
        alignItems: "flex-end",
    },
    marksValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#5c51f3",
    },
    gradeValue: {
        fontSize: 14,
        color: "#666",
    },
    remarksContainer: {
        backgroundColor: "rgba(92, 81, 243, 0.05)",
        borderRadius: 6,
        padding: 10,
    },
    remarksTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    remarksText: {
        fontSize: 14,
        color: "#666",
    },
    desktopCurriculumGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    desktopCurriculumItem: {
        width: "48%",
        marginBottom: 20,
    },
    curriculumItem: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 15,
    },
    curriculumHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
    },
    curriculumTitle: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
    },
    viewSyllabusButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    viewSyllabusText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    unitsContainer: {
        padding: 12,
    },
    unitItem: {
        marginBottom: 10,
    },
    unitHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    unitTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    unitProgress: {
        fontSize: 14,
        color: "#5c51f3",
        fontWeight: "bold",
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: "#eee",
        borderRadius: 3,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
    },
    desktopScrollContent: {
        padding: 10,
    },
})

export default styles
