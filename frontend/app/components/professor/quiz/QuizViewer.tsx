import React, { useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from "react-native"
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons"
import styles from "@/app/styles/QuizViewer.style"

interface QuizQuestion {
    question: string
    A: string
    B: string
    C: string
    D: string
    reponse: string
}

interface QuizViewerProps {
    questions: QuizQuestion[]
    onBack: () => void
    onSave: (questions: QuizQuestion[]) => void
}

const QuizViewer: React.FC<QuizViewerProps> = ({ questions, onBack, onSave }) => {
    const [editedQuestions, setEditedQuestions] = useState<QuizQuestion[]>(questions)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [quizTitle, setQuizTitle] = useState("New Quiz")
    const [editingTitle, setEditingTitle] = useState(false)

    const handleQuestionEdit = (index: number, field: keyof QuizQuestion, value: string) => {
        const updatedQuestions = [...editedQuestions]
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value,
        }
        setEditedQuestions(updatedQuestions)
    }

    const handleCorrectAnswerChange = (index: number, option: string) => {
        const updatedQuestions = [...editedQuestions]
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            reponse: option,
        }
        setEditedQuestions(updatedQuestions)
    }

    const handleDeleteQuestion = (index: number) => {
        Alert.alert(
            "Delete Question",
            "Are you sure you want to delete this question?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        const updatedQuestions = [...editedQuestions]
                        updatedQuestions.splice(index, 1)
                        setEditedQuestions(updatedQuestions)
                        if (editingIndex === index) {
                            setEditingIndex(null)
                        }
                    },
                    style: "destructive",
                },
            ]
        )
    }

    const handleSaveQuiz = () => {
        if (editedQuestions.length === 0) {
            Alert.alert("Error", "Cannot save an empty quiz")
            return
        }

        onSave(editedQuestions)
    }

    const renderQuestionItem = (question: QuizQuestion, index: number) => {
        const isEditing = editingIndex === index

        return (
            <View key={index} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>Question {index + 1}</Text>
                    <View style={styles.questionActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setEditingIndex(isEditing ? null : index)}
                        >
                            <MaterialIcons
                                name={isEditing ? "check" : "edit"}
                                size={20}
                                color="#5c51f3"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteQuestion(index)}
                        >
                            <MaterialIcons name="delete" size={20} color="#ff5694" />
                        </TouchableOpacity>
                    </View>
                </View>

                {isEditing ? (
                    <TextInput
                        style={styles.questionEditInput}
                        value={question.question}
                        onChangeText={(text) => handleQuestionEdit(index, "question", text)}
                        multiline
                    />
                ) : (
                    <Text style={styles.questionText}>{question.question}</Text>
                )}

                <View style={styles.optionsContainer}>
                    {["A", "B", "C", "D"].map((option) => (
                        <View key={option} style={styles.optionRow}>
                            <TouchableOpacity
                                style={[
                                    styles.optionSelector,
                                    question.reponse === option && styles.selectedOption,
                                ]}
                                onPress={() => handleCorrectAnswerChange(index, option)}
                            >
                                <Text
                                    style={[
                                        styles.optionSelectorText,
                                        question.reponse === option && styles.selectedOptionText,
                                    ]}
                                >
                                    {option}
                                </Text>
                            </TouchableOpacity>

                            {isEditing ? (
                                <TextInput
                                    style={styles.optionEditInput}
                                    value={question[option as keyof QuizQuestion] as string}
                                    onChangeText={(text) => handleQuestionEdit(index, option as keyof QuizQuestion, text)}
                                />
                            ) : (
                                <Text style={styles.optionText}>
                                    {question[option as keyof QuizQuestion]}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <AntDesign name="arrowleft" size={24} color="#5c51f3" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    {editingTitle ? (
                        <TextInput
                            style={styles.titleInput}
                            value={quizTitle}
                            onChangeText={setQuizTitle}
                            onBlur={() => setEditingTitle(false)}
                            autoFocus
                        />
                    ) : (
                        <TouchableOpacity onPress={() => setEditingTitle(true)}>
                            <Text style={styles.title}>{quizTitle}</Text>
                            <MaterialIcons name="edit" size={16} color="#777" style={styles.editIcon} />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveQuiz}>
                    <MaterialIcons name="save" size={20} color="white" />
                    <Text style={styles.saveButtonText}>Save Quiz</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.questionsContainer}>
                {editedQuestions.length > 0 ? (
                    editedQuestions.map((question, index) => renderQuestionItem(question, index))
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="quiz" size={64} color="#ccc" />
                        <Text style={styles.emptyStateText}>No questions available</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

export default QuizViewer
