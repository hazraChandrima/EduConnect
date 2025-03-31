import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    methodSelectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
    },
    methodOptions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    methodOption: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#5c51f3",
        marginHorizontal: 8,
        backgroundColor: "#fff",
    },
    selectedMethodOption: {
        backgroundColor: "#5c51f3",
    },
    methodOptionText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "500",
        color: "#5c51f3",
    },
    selectedMethodOptionText: {
        color: "#fff",
    },
    uploadContainer: {
        marginTop: 16,
    },
    textInputContainer: {
        marginTop: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        marginBottom: 8,
    },
    filePickerButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5c51f3",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    filePickerButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 8,
    },
    selectedFileContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        marginBottom: 16,
    },
    selectedFileName: {
        flex: 1,
        fontSize: 14,
        color: "#333",
        marginLeft: 8,
        marginRight: 8,
    },
    textInput: {
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: "top",
    },
    generateButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5c51f3",
        borderRadius: 8,
        padding: 16,
        marginTop: 8,
    },
    generateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 8,
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
})
