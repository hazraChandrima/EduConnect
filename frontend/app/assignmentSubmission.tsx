import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import styles from "./styles/AssignmentSubmission.style";

// Define attachment type
type Attachment = {
    name: string;
    uri: string;
    size?: number;
    type?: string;
};

const AssignmentSubmissionScreen: React.FC = () => {
    const router = useRouter(); // Using expo-router instead of navigation

    // Static assignment data
    const assignment = {
        id: "1",
        title: "Algorithm Analysis Report",
        course: "CS 101",
        courseColor: "#52c4eb",
        dueDate: "Tomorrow, 11:59 PM",
        description:
            "Submit a report analyzing the time and space complexity of the algorithms discussed in class. Your report should include detailed analysis of at least three different algorithms and compare their efficiency.",
        requirements: [
            "5-7 pages in length",
            "Include diagrams and charts",
            "Cite at least 3 academic sources",
            "Follow APA format",
        ],
        rubric: [
            { criteria: "Algorithm Analysis", points: 40 },
            { criteria: "Clarity of Explanation", points: 25 },
            { criteria: "Visual Aids", points: 15 },
            { criteria: "Citations & References", points: 10 },
            { criteria: "Format & Organization", points: 10 },
        ],
    };

    const [notes, setNotes] = useState<string>("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled && result.assets?.length > 0) {
                const file = result.assets[0];
                setAttachments((prevAttachments) => [
                    ...prevAttachments,
                    {
                        name: file.name || "Unnamed File",
                        uri: file.uri,
                        size: file.size,
                        type: file.mimeType,
                    },
                ]);
            }
        } catch (err) {
            console.error("Document picking error:", err);
        }
    };


    const removeAttachment = (index: number) => {
        setAttachments((prevAttachments) => prevAttachments.filter((_, i) => i !== index));
    };

    const submitAssignment = () => {
        Alert.alert(
            "Assignment Submitted",
            "Your assignment has been submitted successfully!",
            [{ text: "OK", onPress: () => router.back() }] // Using router.back() instead of navigation.goBack()
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#4252e5" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Submit Assignment</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Assignment Details */}
                <View style={styles.assignmentHeader}>
                    <View style={[styles.courseTag, { backgroundColor: assignment.courseColor }]}>
                        <Text style={styles.courseTagText}>{assignment.course}</Text>
                    </View>
                    <Text style={styles.dueDate}>Due: {assignment.dueDate}</Text>
                </View>

                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentDescription}>{assignment.description}</Text>

                {/* Requirements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Requirements</Text>
                    <View style={styles.requirementsList}>
                        {assignment.requirements.map((req, index) => (
                            <View key={index} style={styles.requirementItem}>
                                <MaterialIcons name="check-circle" size={18} color="#5c51f3" />
                                <Text style={styles.requirementText}>{req}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Rubric */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Grading Rubric</Text>
                    <View style={styles.rubricContainer}>
                        <View style={styles.rubricHeader}>
                            <Text style={styles.rubricCriteriaHeader}>Criteria</Text>
                            <Text style={styles.rubricPointsHeader}>Points</Text>
                        </View>
                        {assignment.rubric.map((item, index) => (
                            <View key={index} style={[styles.rubricRow, index === assignment.rubric.length - 1 && styles.lastRubricRow]}>
                                <Text style={styles.rubricCriteria}>{item.criteria}</Text>
                                <Text style={styles.rubricPoints}>{item.points}</Text>
                            </View>
                        ))}
                        <View style={styles.rubricTotalRow}>
                            <Text style={styles.rubricTotalLabel}>Total</Text>
                            <Text style={styles.rubricTotalPoints}>
                                {assignment.rubric.reduce((total, item) => total + item.points, 0)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Submission Form */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Submission</Text>

                    {/* Notes */}
                    <Text style={styles.inputLabel}>Notes to Professor (Optional)</Text>
                    <TextInput
                        style={styles.notesInput}
                        multiline
                        placeholder="Add any notes or comments about your submission..."
                        value={notes}
                        onChangeText={setNotes}
                    />

                    {/* Attachments */}
                    <Text style={styles.inputLabel}>Attachments</Text>
                    <View style={styles.attachmentsContainer}>
                        {attachments.map((file, index) => (
                            <View key={index} style={styles.attachmentItem}>
                                <View style={styles.attachmentInfo}>
                                    <MaterialIcons name="insert-drive-file" size={24} color="#5c51f3" />
                                    <View style={styles.attachmentDetails}>
                                        <Text style={styles.attachmentName} numberOfLines={1}>{file.name}</Text>
                                        <Text style={styles.attachmentSize}>{(file.size ?? 0 / 1024).toFixed(1)} KB</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => removeAttachment(index)} style={styles.removeButton}>
                                    <MaterialIcons name="close" size={20} color="#777" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.addAttachmentButton} onPress={pickDocument}>
                            <MaterialIcons name="add" size={24} color="#5c51f3" />
                            <Text style={styles.addAttachmentText}>Add File</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={submitAssignment} disabled={attachments.length === 0}>
                    <Text style={styles.submitButtonText}>Submit Assignment</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AssignmentSubmissionScreen;
