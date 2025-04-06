import { StyleSheet } from "react-native";

const forgotResetPassStyle = StyleSheet.create({
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
        paddingHorizontal:24,
        paddingVertical: 32,
        maxWidth: 400,
        alignSelf: "center",
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
    primaryButton: {
        backgroundColor: "#3b82f6",
        borderRadius: 12,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        marginTop: 10,
    },
    primaryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    linkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    linkText: {
        color: "#6b7280",
        fontSize: 14,
    },
    link: {
        color: "#3b82f6",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 4,
    },
    backButton: {
        paddingHorizontal: 24,
        paddingTop: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    backButtonText: {
        color: "#4b5563",
        fontSize: 16,
        marginLeft: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 4,
    },
    instructionText: {
        color: 'gray',
        fontSize: 14,
        marginBottom: 40,
    },
    disabledButton: {
        backgroundColor: "#7fadf8",
        shadowColor: "#a1a1aa",
    },
});

export default forgotResetPassStyle;