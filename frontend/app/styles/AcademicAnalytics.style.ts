import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    tabContainer: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        zIndex: 10,
    },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: "#f5f5f5",
    },
    activeTab: {
        backgroundColor: "#ede9ff",
    },
    tabText: {
        marginLeft: 6,
        fontSize: 14,
        color: "#777",
    },
    activeTabText: {
        color: "#5c51f3",
        fontWeight: "600",
    },
    chartContainer: {
        padding: 16,
        width: "100%",
    },
    chartTitle: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    chartSubtitle: {
        fontSize: 14,
        color: "#777",
        marginBottom: 16,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
        padding: 10,
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        alignSelf: "center",
    },
    attendanceDetails: {
        marginTop: 20,
        width: "100%",
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    attendanceItem: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        width: "100%",
    },
    attendanceItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        flexWrap: "wrap",
    },
    attendanceItemTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    attendanceItemValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#5c51f3",
    },
    attendanceItemDetail: {
        fontSize: 14,
        color: "#777",
        marginBottom: 8,
    },
    attendanceWarning: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    attendanceWarningText: {
        marginLeft: 6,
        fontSize: 13,
        color: "#ffc107",
    },
    marksDetails: {
        marginTop: 20,
        width: "100%",
    },
    marksItem: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        width: "100%",
    },
    marksItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        flexWrap: "wrap",
    },
    subjectTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    subjectTagText: {
        color: "#fff",
        fontWeight: "600",
    },
    gradeContainer: {
        alignItems: "flex-end",
    },
    marksValue: {
        fontSize: 18,
        fontWeight: "bold",
    },
    gradeValue: {
        fontSize: 14,
        color: "#777",
        marginTop: 2,
    },
    remarksContainer: {
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 12,
        marginTop: 4,
    },
    remarksTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },
    remarksText: {
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
    },
    curriculumItem: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        width: "100%",
    },
    curriculumHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        flexWrap: "wrap",
    },
    curriculumTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 8,
        marginBottom: 4,
    },
    viewSyllabusButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: 4,
    },
    viewSyllabusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    unitsContainer: {
        padding: 16,
    },
    unitItem: {
        marginBottom: 12,
    },
    unitHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
        flexWrap: "wrap",
    },
    unitTitle: {
        fontSize: 14,
        color: "#333",
        flex: 1,
        marginRight: 8,
    },
    unitProgress: {
        fontSize: 14,
        fontWeight: "600",
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
    },
});

export default styles;