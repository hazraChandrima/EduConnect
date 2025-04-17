"use client"

import { useState, useEffect } from "react"
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Alert, Linking } from "react-native"
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons"
import * as DocumentPicker from "expo-document-picker"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "../../../firebase"
import styles from "../../../styles/StudentDashboard.style"
import { APP_CONFIG } from "@/app-config"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

interface SubmissionFile {
    name: string
    uri: string
    type: string
    size: number
}

interface SubmissionModalProps {
    isVisible: boolean
    setIsVisible: (visible: boolean) => void
    assignment: any
    token: string | null
    userId: string
    onSubmitSuccess: (updatedAssignment: any) => void
    isDesktop: boolean
}

export default function SubmissionModal({
    isVisible,
    setIsVisible,
    assignment,
    token,
    userId,
    onSubmitSuccess,
    isDesktop,
}: SubmissionModalProps) {
    const [submissionText, setSubmissionText] = useState("")
    const [submissionFiles, setSubmissionFiles] = useState<SubmissionFile[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentSubmissionUrl, setCurrentSubmissionUrl] = useState<string | null>(null)
    const [isResubmitting, setIsResubmitting] = useState(false)

    // Reset state when modal opens with a new assignment
    useEffect(() => {
        if (isVisible && assignment) {
            setSubmissionText("")
            setSubmissionFiles([])
            setIsResubmitting(false)

            // Check if assignment has a submission URL
            if (assignment.submissionUrl) {
                setCurrentSubmissionUrl(assignment.submissionUrl)
            } else {
                setCurrentSubmissionUrl(null)
            }
        }
    }, [isVisible, assignment])

    if (!assignment) return null

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            })

            if (!result.canceled && result.assets.length > 0) {
                const pickedFile = result.assets[0]

                const newFile: SubmissionFile = {
                    name: pickedFile.name,
                    uri: pickedFile.uri,
                    type: pickedFile.mimeType || "application/octet-stream",
                    size: pickedFile.size ?? 0,
                }

                setSubmissionFiles([...submissionFiles, newFile])
            }
        } catch (error) {
            console.error("Error picking document:", error)
        }
    }

    const removeFile = (index: number) => {
        const updatedFiles = [...submissionFiles]
        updatedFiles.splice(index, 1)
        setSubmissionFiles(updatedFiles)
    }

    const viewSubmittedFile = () => {
        if (currentSubmissionUrl) {
            Linking.openURL(currentSubmissionUrl).catch((err) => {
                console.error("Error opening URL:", err)
                Alert.alert("Error", "Could not open the file. Please try again.")
            })
        }
    }

    const enableResubmission = () => {
        setIsResubmitting(true)
    }

    const cancelResubmission = () => {
        setIsResubmitting(false)
        setSubmissionFiles([])
        setSubmissionText("")
    }

    const submitAssignment = async () => {
        if (!assignment || submissionFiles.length === 0) return

        setIsSubmitting(true)

        try {
            const file = submissionFiles[0] // Assuming one file for simplicity
            const response = await fetch(file.uri)
            const blob = await response.blob()

            const storageRef = ref(storage, `assignments/${Date.now()}_${file.name}`)
            await uploadBytes(storageRef, blob)

            const downloadUrl = await getDownloadURL(storageRef)

            const backendResponse = await fetch(`${API_BASE_URL}/api/assignment/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    assignmentId: assignment._id,
                    courseId: assignment.courseId,
                    downloadUrl,
                    comments: submissionText,
                    isResubmission: isResubmitting,
                }),
            })

            const data = await backendResponse.json()

            if (backendResponse.ok) {
                console.log("Assignment submitted successfully:", data)

                // Update the assignment status
                const updatedAssignment = {
                    ...assignment,
                    status: "submitted" as const,
                    submissionUrl: downloadUrl,
                }

                // Call the callback to update parent state
                onSubmitSuccess(updatedAssignment)

                // Update local state
                setCurrentSubmissionUrl(downloadUrl)
                setIsResubmitting(false)
                setSubmissionFiles([])

                setIsVisible(false)
                Alert.alert(
                    "Success",
                    isResubmitting ? "Assignment resubmitted successfully!" : "Assignment submitted successfully!",
                )
            } else {
                console.error("Failed to submit assignment:", data.error)
                Alert.alert("Error", data.error || "Failed to submit assignment")
            }
        } catch (error) {
            console.error("Error submitting assignment:", error)
            Alert.alert("Error", "Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={() => setIsVisible(false)}>
            <View style={[styles.modalOverlay, isDesktop && styles.desktopModalOverlay]}>
                <View style={[styles.modalContainer, isDesktop && styles.desktopModalContainer]}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderText}>
                            <Text style={styles.modalTitle}>{isResubmitting ? "Resubmit Assignment" : "Submit Assignment"}</Text>
                            <Text style={styles.modalSubtitle}>
                                {assignment.courseCode} • {assignment.title}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsVisible(false)}>
                            <AntDesign name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.submissionSection}>
                            <Text style={styles.submissionLabel}>Assignment Description:</Text>
                            <Text style={styles.submissionDescription}>{assignment.description}</Text>
                        </View>

                        <View style={styles.submissionSection}>
                            <Text style={styles.submissionLabel}>Due Date:</Text>
                            <Text style={styles.submissionDueDate}>{assignment.dueDate}</Text>
                        </View>

                        {/* Show current submission if it exists */}
                        {currentSubmissionUrl && !isResubmitting && (
                            <View style={styles.submissionSection}>
                                <Text style={styles.submissionLabel}>Current Submission:</Text>
                                <View style={styles.currentSubmissionContainer}>
                                    <View style={styles.currentSubmissionFile}>
                                        <MaterialIcons name="insert-drive-file" size={24} color="#5c51f3" />
                                        <Text style={styles.currentSubmissionText}>File submitted</Text>
                                    </View>
                                    <View style={styles.currentSubmissionActions}>
                                        <TouchableOpacity style={styles.viewFileButton} onPress={viewSubmittedFile}>
                                            <Feather name="eye" size={18} color="white" />
                                            <Text style={styles.viewFileButtonText}>View</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.resubmitButton} onPress={enableResubmission}>
                                            <Feather name="refresh-cw" size={18} color="white" />
                                            <Text style={styles.resubmitButtonText}>Resubmit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Show submission form if resubmitting or no current submission */}
                        {(isResubmitting || !currentSubmissionUrl) && (
                            <>
                                <View style={styles.submissionSection}>
                                    <Text style={styles.submissionLabel}>Your Submission:</Text>
                                    <TextInput
                                        style={styles.submissionTextInput}
                                        placeholder="Add comments or notes about your submission..."
                                        multiline={true}
                                        numberOfLines={4}
                                        value={submissionText}
                                        onChangeText={setSubmissionText}
                                    />
                                </View>

                                <View style={styles.submissionSection}>
                                    <Text style={styles.submissionLabel}>Attach Files:</Text>
                                    <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
                                        <Feather name="paperclip" size={20} color="white" />
                                        <Text style={styles.attachButtonText}>Attach File</Text>
                                    </TouchableOpacity>

                                    {submissionFiles.length > 0 && (
                                        <View style={styles.attachedFilesContainer}>
                                            {submissionFiles.map((file, index) => (
                                                <View key={index} style={styles.attachedFile}>
                                                    <View style={styles.fileInfo}>
                                                        <MaterialIcons name="insert-drive-file" size={20} color="#5c51f3" />
                                                        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                                                            {file.name}
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => removeFile(index)}>
                                                        <Feather name="x" size={20} color="#F44336" />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                <View style={styles.submissionActions}>
                                    {isResubmitting && (
                                        <TouchableOpacity style={styles.cancelButton} onPress={cancelResubmission}>
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={[
                                            styles.submitButton,
                                            (submissionFiles.length === 0 || isSubmitting) && styles.submitButtonDisabled,
                                        ]}
                                        onPress={submitAssignment}
                                        disabled={submissionFiles.length === 0 || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Text style={styles.submitButtonText}>Submitting...</Text>
                                        ) : (
                                            <Text style={styles.submitButtonText}>
                                                {isResubmitting ? "Resubmit Assignment" : "Submit Assignment"}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}
