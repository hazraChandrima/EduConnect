"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from "react-native"
import { MaterialIcons, AntDesign } from "@expo/vector-icons"
import * as DocumentPicker from "expo-document-picker"
import styles from "@/app/styles/QuizGenerator.style"
import { APP_CONFIG } from "@/app-config"

const API_PDF_QUIZ_URL = APP_CONFIG.API_PDF_QUIZ_URL

interface QuizQuestion {
    question: string
    A: string
    B: string
    C: string
    D: string
    reponse: string
}

interface QuizGeneratorProps {
    onQuizGenerated: (questions: QuizQuestion[]) => void
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onQuizGenerated }) => {
    const [generationMethod, setGenerationMethod] = useState<"pdf" | "text" | null>(null)
    const [numQuestions, setNumQuestions] = useState("5")
    const [textContent, setTextContent] = useState("")
    const [selectedFile, setSelectedFile] = useState<{
        name: string
        uri: string
        type: string
        size?: number
    } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            })

            if (result.canceled) {
                return
            }

            const file = result.assets[0]
            setSelectedFile({
                name: file.name,
                uri: file.uri,
                type: "application/pdf",
                size: file.size,
            })
        } catch (error) {
            console.error("Error picking document:", error)
            Alert.alert("Error", "Failed to select document. Please try again.")
        }
    }



    const generateQuizFromPDF = async () => {
        if (!selectedFile) {
            Alert.alert("Error", "Please select a PDF file first");
            return;
        }
        setIsLoading(true);
        try {
            // Create form data
            const formData = new FormData();

            // Platform-specific handling for file upload
            if (Platform.OS === 'web') {
                // Convert the file URI to a Blob before appending
                const response = await fetch(selectedFile.uri);
                const blob = await response.blob();
                formData.append("file", blob, selectedFile.name || "document.pdf");
            }
            else {
                // For native platforms, we need to structure the object differently
                formData.append("file", {
                    uri: selectedFile.uri,
                    name: selectedFile.name || 'document.pdf',
                    type: "application/pdf",
                } as any);
            }

            // Add number of questions parameter to the URL
            const numQuestionsInt = Number.parseInt(numQuestions) || 5;
            const url = `${API_PDF_QUIZ_URL}/pdf_to_quizz/?num_questions=${numQuestionsInt}`;
            console.log(`Sending request to ${url} with file ${selectedFile.name || 'document.pdf'}`);

            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            console.log(`Response status: ${response.status}`);

            // Attempt to parse JSON even if status is not 2xx to get error details
            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
                console.log("Parsed response data:", data);
            } catch (parseError) {
                console.error("Failed to parse response as JSON:", responseText);
                throw new Error(`Server response is not valid JSON: ${responseText.substring(0, 100)}...`);
            }

            if (!response.ok) {
                // Better handling for error messages
                let errorMessage = `Server error: ${response.status}`;
                if (data && typeof data === 'object' && data.detail) {
                    errorMessage = typeof data.detail === 'string'
                        ? data.detail
                        : JSON.stringify(data.detail);
                }
                throw new Error(errorMessage);
            }

            if (data.error) {
                const errorMsg = typeof data.error === 'string'
                    ? data.error
                    : JSON.stringify(data.error);
                throw new Error(errorMsg);
            }

            if (!data.questions || !Array.isArray(data.questions)) {
                throw new Error("Server returned invalid question format");
            }

            if (data.questions.length === 0) {
                Alert.alert(
                    "No Questions Generated",
                    "The system couldn't generate any questions from this PDF. Try a different document or enter text directly."
                );
                return;
            }

            onQuizGenerated(data.questions);
        } catch (error: unknown) {
            console.error("Error generating quiz from PDF:", error);
            if (error instanceof Error) {
                Alert.alert("Error", `Failed to generate quiz: ${error.message}`);
            } else {
                Alert.alert("Error", "An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };




    const generateQuizFromText = async () => {
        if (!textContent.trim()) {
            Alert.alert("Error", "Please enter some text content first")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${API_PDF_QUIZ_URL}/text_to_quizz/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: textContent,
                    num_questions: Number.parseInt(numQuestions),
                }),
            })

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`)
            }

            const data = await response.json()
            onQuizGenerated(data)
        } catch (error) {
            console.error("Error generating quiz from text:", error)
            Alert.alert("Error", "Failed to generate quiz. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }


    

    const handleGenerate = () => {
        if (generationMethod === "pdf") {
            generateQuizFromPDF()
        } else if (generationMethod === "text") {
            generateQuizFromText()
        }
    }

    const renderMethodSelection = () => (
        <View style={styles.methodSelectionContainer}>
            <Text style={styles.sectionTitle}>Generate Quiz</Text>
            <Text style={styles.sectionSubtitle}>Choose a method to generate quiz questions</Text>

            <View style={styles.methodOptions}>
                <TouchableOpacity
                    style={[styles.methodOption, generationMethod === "pdf" && styles.selectedMethodOption]}
                    onPress={() => setGenerationMethod("pdf")}
                >
                    <MaterialIcons name="picture-as-pdf" size={32} color={generationMethod === "pdf" ? "white" : "#5c51f3"} />
                    <Text style={[styles.methodOptionText, generationMethod === "pdf" && styles.selectedMethodOptionText]}>
                        Upload PDF
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.methodOption, generationMethod === "text" && styles.selectedMethodOption]}
                    onPress={() => setGenerationMethod("text")}
                >
                    <MaterialIcons name="text-fields" size={32} color={generationMethod === "text" ? "white" : "#5c51f3"} />
                    <Text style={[styles.methodOptionText, generationMethod === "text" && styles.selectedMethodOptionText]}>
                        Enter Text
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderPDFUpload = () => (
        <View style={styles.uploadContainer}>
            <Text style={styles.inputLabel}>Upload PDF Document</Text>

            <TouchableOpacity style={styles.filePickerButton} onPress={pickDocument}>
                <MaterialIcons name="file-upload" size={24} color="white" />
                <Text style={styles.filePickerButtonText}>Select PDF File</Text>
            </TouchableOpacity>

            {selectedFile && (
                <View style={styles.selectedFileContainer}>
                    <MaterialIcons name="picture-as-pdf" size={24} color="#5c51f3" />
                    <Text style={styles.selectedFileName} numberOfLines={1} ellipsizeMode="middle">
                        {selectedFile.name}
                    </Text>
                    <TouchableOpacity onPress={() => setSelectedFile(null)}>
                        <AntDesign name="close" size={20} color="#ff5694" />
                    </TouchableOpacity>
                </View>
            )}

            <Text style={styles.inputLabel}>Number of Questions</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Enter number of questions"
                keyboardType="numeric"
                value={numQuestions}
                onChangeText={setNumQuestions}
            />

            <TouchableOpacity
                style={[styles.generateButton, (!selectedFile || isLoading) && styles.disabledButton]}
                onPress={handleGenerate}
                disabled={!selectedFile || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <>
                        <MaterialIcons name="quiz" size={20} color="white" />
                        <Text style={styles.generateButtonText}>Generate Quiz</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    )

    const renderTextInput = () => (
        <View style={styles.textInputContainer}>
            <Text style={styles.inputLabel}>Enter Text Content</Text>
            <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Paste or type the content you want to generate questions from..."
                multiline={true}
                numberOfLines={8}
                value={textContent}
                onChangeText={setTextContent}
            />

            <Text style={styles.inputLabel}>Number of Questions</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Enter number of questions"
                keyboardType="numeric"
                value={numQuestions}
                onChangeText={setNumQuestions}
            />

            <TouchableOpacity
                style={[styles.generateButton, (!textContent.trim() || isLoading) && styles.disabledButton]}
                onPress={handleGenerate}
                disabled={!textContent.trim() || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <>
                        <MaterialIcons name="quiz" size={20} color="white" />
                        <Text style={styles.generateButtonText}>Generate Quiz</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.container}>
            {renderMethodSelection()}

            {generationMethod === "pdf" && renderPDFUpload()}
            {generationMethod === "text" && renderTextInput()}
        </View>
    )
}

export default QuizGenerator

