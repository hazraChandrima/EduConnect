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
    forgotPasswordContainer: {
        alignItems: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: "#3b82f6",
        fontSize: 14,
        fontWeight: "500",
    },
    loginButton: {
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
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    registerText: {
        color: "#6b7280",
        fontSize: 14,
    },
    disabledButton: {
        backgroundColor: "#7fadf8",
        shadowColor: "#a1a1aa",
    },
    registerLink: {
        color: "#3b82f6",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 4,
    },
    testButton: {
        marginTop: 20,
        backgroundColor: "#f87171",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    testButtonText: {
        color: "white",
        fontWeight: "600",
    },
});


export default styles;