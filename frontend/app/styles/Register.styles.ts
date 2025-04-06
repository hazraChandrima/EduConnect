import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    keyboardAvoidView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
    },
    formContainer: {
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    headerText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 8,
    },
    subHeaderText: {
        fontSize: 16,
        color: "#6b7280",
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#4b5563",
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        height: 50,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        height: "100%",
        paddingLeft: 8,
        fontSize: 16,
        color: "#1f2937",
    },
    inputIcon: {
        marginRight: 8,
    },
    eyeIcon: {
        padding: 8,
    },
    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    roleOption: {
        flex: 1,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        marginHorizontal: 4,
    },
    roleOptionSelected: {
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
    },
    roleText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#4b5563",
    },
    roleTextSelected: {
        color: "white",
    },
    registerButton: {
        backgroundColor: "#3b82f6",
        borderRadius: 12,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    registerButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    disabledButton: {
        backgroundColor: "#7fadf8",
        shadowColor: "#a1a1aa",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    loginText: {
        color: "#6b7280",
        fontSize: 14,
    },
    loginLink: {
        color: "#3b82f6",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 4,
    },
    progressContainer: {
        height: 6,
        backgroundColor: "#e0e0e0",
        borderRadius: 3,
        marginBottom: 30,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#5c51f3",
        borderRadius: 3,
    },
    stepIndicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    stepDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#e0e0e0",
        marginHorizontal: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    stepDotActive: {
        backgroundColor: "#5c51f3",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
    },
    backButtonText: {
        color: "#5c51f3",
        marginLeft: 5,
        fontSize: 16,
    },
    resendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    resendText: {
        color: "#666",
        marginRight: 5,
    },
    resendLink: {
        color: "#5c51f3",
        fontWeight: "bold",
    },
    countdownText: {
        color: "#999",
    },
    passwordHint: {
        color: "#666",
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    completionContainer: {
        alignItems: "center",
        padding: 20,
    },
    successIconContainer: {
        marginBottom: 20,
    },
    completionHeader: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    completionText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    redirectLoader: {
        marginTop: 20,
    },
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 4,
        marginLeft: 4,
    },
    locationStatusButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 15,
        alignSelf: "center",
    },
    locationStatusText: {
        fontSize: 14,
        marginLeft: 8,
    },
    securityNote: {
        fontSize: 12,
        color: "#777",
        textAlign: "center",
        marginBottom: 15,
        fontStyle: "italic",
    },
});


export default styles;