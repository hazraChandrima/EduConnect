import { Platform, StyleSheet } from "react-native";


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
        
    },
    // Add these to your styles.js file in the Login.styles

    locationStatusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderColor: '#ff9800',
    },

    locationStatusText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '500',
        color: '#ff9800',
    },

    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: Platform.OS === 'web' ? '80%' : '90%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },

    modalText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        lineHeight: 20,
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    modalButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginLeft: 12,
        borderRadius: 8,
    },

    modalButtonText: {
        fontSize: 14,
        color: '#666',
    },

    primaryButton: {
        backgroundColor: '#5c6bc0',
    },

    primaryButtonText: {
        color: '#fff',
        fontWeight: '500',
    },

    permissionButton: {
        backgroundColor: 'rgba(92, 107, 192, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(92, 107, 192, 0.3)',
    },

    permissionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    permissionButtonText: {
        marginLeft: 8,
        color: '#5c6bc0',
        fontWeight: '500',
    },
    permissionButtonEnabled: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
    },

    permissionButtonDisabled: {
        backgroundColor: 'rgba(92, 107, 192, 0.1)',
        borderColor: 'rgba(92, 107, 192, 0.3)',
    },

    permissionButtonWarning: {
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderColor: 'rgba(255, 152, 0, 0.3)',
    },

    locationStatusButtonDisabled: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderColor: 'rgba(244, 67, 54, 0.3)',
    },
    
});


export default styles;