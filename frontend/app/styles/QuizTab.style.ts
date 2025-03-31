import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    tabHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tabTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    createButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#5c51f3",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    createButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 4,
    },
    quizListContainer: {
        flex: 1,
        padding: 16,
    },
    quizCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        marginBottom: 16,
        overflow: "hidden",
        borderLeftWidth: 4,
        borderLeftColor: "#5c51f3",
    },
    quizCardContent: {
        flexDirection: "row",
        padding: 16,
    },
    quizInfo: {
        flex: 1,
    },
    quizTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    quizMeta: {
        fontSize: 12,
        color: "#777",
    },
    quizActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    quizAction: {
        padding: 8,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        marginTop: 32,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#777",
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: "#999",
        marginTop: 8,
        textAlign: "center",
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#777",
    },
})
