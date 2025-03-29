import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    keyboardAvoidView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    formContainer: {
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
        textAlign: "center",
    },
    subHeaderText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 24,
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
        color: "#333",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "#f9f9f9",
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: "#333",
        padding: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    forgotPasswordContainer: {
        alignItems: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: "#5c51f3",
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: "#5c51f3",
        borderRadius: 8,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    disabledButton: {
        backgroundColor: "#a8a5e6",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    registerText: {
        color: "#666",
        fontSize: 14,
    },
    registerLink: {
        color: "#5c51f3",
        fontWeight: "600",
        marginLeft: 4,
        fontSize: 14,
    },
    testButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        alignItems: "center",
    },
    testButtonText: {
        color: "#333",
    },

    // Progress bar styles
    progressContainer: {
        width: "100%",
        height: 4,
        backgroundColor: "#e0e0e0",
        borderRadius: 2,
        marginBottom: 20,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#5c51f3",
        borderRadius: 2,
    },

    // Back button styles
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
    },
    backButtonText: {
        color: "#666",
        marginLeft: 4,
        fontSize: 14,
    },

    // Resend code styles
    resendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
    },
    resendText: {
        color: "#666",
        fontSize: 14,
    },
    resendLink: {
        color: "#5c51f3",
        fontWeight: "600",
        marginLeft: 4,
        fontSize: 14,
    },
    countdownText: {
        color: "#999",
        marginLeft: 4,
        fontSize: 14,
    },
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 4,
        marginLeft: 4,
    }
});


export default styles;