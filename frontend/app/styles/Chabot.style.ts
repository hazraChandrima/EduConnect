import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9fc",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#4252e5",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitleContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    suggestionsContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "white",
    },
    chipsScrollContainer: {
        flexDirection: "row",
        paddingHorizontal: 12,
    },
    chip: {
        backgroundColor: "#f0f0ff",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#e0e0ff",
    },
    chipText: {
        color: "#5c51f3",
        fontWeight: "500",
        fontSize: 14,
    },
    messagesList: {
        padding: 12,
        paddingBottom: 20,
    },
    messageContainer: {
        flexDirection: "row",
        marginVertical: 6,
        alignItems: "flex-start",
    },
    botMessageContainer: {
        alignSelf: "flex-start",
    },
    userMessageContainer: {
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    },
    avatarContainer: {
        width: 36,
        marginHorizontal: 8,
    },
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#5c51f3",
        justifyContent: "center",
        alignItems: "center",
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#4252e5",
        justifyContent: "center",
        alignItems: "center",
    },
    messageContent: {
        borderRadius: 18,
        padding: 12,
        maxWidth: "70%",
    },
    botMessageContent: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#eee",
        borderBottomLeftRadius: 5,
    },
    userMessageContent: {
        backgroundColor: "#5c51f3",
        borderBottomRightRadius: 5,
    },
    botMessageText: {
        color: "#333",
        fontSize: 16,
        lineHeight: 22,
    },
    userMessageText: {
        color: "white",
        fontSize: 16,
        lineHeight: 22,
    },
    botTimestamp: {
        color: "#888",
        fontSize: 11,
        alignSelf: "flex-end",
        marginTop: 4,
    },
    userTimestamp: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 11,
        alignSelf: "flex-end",
        marginTop: 4,
    },
    typingContainer: {
        flexDirection: "row",
        padding: 8,
        alignItems: "center",
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#5c51f3",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "white",
        alignItems: "center",
    },
    attachButton: {
        marginRight: 8,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#eee",
    },
    sendButton: {
        backgroundColor: "#5c51f3",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
        elevation: 2,
    },
    sendButtonDisabled: {
        backgroundColor: "#c5c1f8",
    },
});

export default styles;