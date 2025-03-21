import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#4169E1",
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    adminBadge: {
        flexDirection: "row",
        alignItems: "center",
    },
    adminText: {
        color: "white",
        marginLeft: 8,
        fontWeight: "500",
    },
    scrollView: {
        flex: 1,
    },
    dashboardHeader: {
        backgroundColor: "#40BFFF",
        padding: 20,
        borderRadius: 8,
        margin: 16,
    },
    dashboardTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    dashboardSubtitle: {
        fontSize: 16,
        color: "white",
        opacity: 0.9,
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    statCard: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        width: "30%",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4169E1",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: "#777",
    },
    section: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        margin: 16,
        marginTop: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    serverStatusHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    serverStatusTitle: {
        fontSize: 16,
        fontWeight: "500",
    },
    viewDetailsLink: {
        color: "#4169E1",
        fontWeight: "500",
    },
    statusItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    statusLabel: {
        fontSize: 16,
        color: "#333",
    },
    statusIndicatorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    onlineIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#40BFFF",
        marginRight: 8,
    },
    degradedIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#FF4081",
        marginRight: 8,
    },
    statusText: {
        fontSize: 16,
        color: "#555",
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
    },
    activityItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    activityLabel: {
        fontSize: 16,
        color: "#333",
    },
    activityTime: {
        fontSize: 14,
        color: "#777",
    },
    quickActionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    actionCard: {
        backgroundColor: "#F8F9FA",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
        width: "48%",
        marginBottom: 16,
    },
    actionText: {
        marginTop: 12,
        color: "#333",
        fontWeight: "500",
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "white",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    navItem: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        marginTop: 4,
        color: "#777",
    },
    activeNavText: {
        color: "#4169E1",
        fontWeight: "500",
    },
});

export default styles;