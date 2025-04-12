import React, { useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native"
import { MaterialIcons, AntDesign } from "@expo/vector-icons"
import QuizGenerator from "./QuizGenerator"
import QuizViewer from "./QuizViewer"
import styles from "@/app/styles/QuizTab.style"

interface QuizQuestion {
    question: string
    A: string
    B: string
    C: string
    D: string
    reponse: string
}

interface Quiz {
    id: string
    title: string
    questions: QuizQuestion[]
    createdAt: string
    courseId?: string
}

const QuizTab: React.FC = () => {
    const [activeView, setActiveView] = useState<"list" | "generate" | "view">("list")
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
    const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleQuizGenerated = (questions: QuizQuestion[]) => {
        setGeneratedQuestions(questions)
        setActiveView("view")
    }

    const handleSaveQuiz = (questions: QuizQuestion[]) => {
        setIsLoading(true)

        // Generate a unique ID
        const newQuizId = `quiz_${Date.now()}`

        // Create a new quiz object
        const newQuiz: Quiz = {
            id: newQuizId,
            title: "New Quiz",
            questions: questions,
            createdAt: new Date().toISOString(),
        }

        // Add to quizzes list
        setQuizzes([newQuiz, ...quizzes])
        setIsLoading(false)
        setActiveView("list")

        Alert.alert("Success", "Quiz has been saved successfully!")
    }

    const handleDeleteQuiz = (quizId: string) => {
        Alert.alert(
            "Delete Quiz",
            "Are you sure you want to delete this quiz?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId)
                        setQuizzes(updatedQuizzes)
                    },
                    style: "destructive",
                },
            ]
        )
    }

    const renderQuizList = () => (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Quizzes</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => setActiveView("generate")}
                >
                    <AntDesign name="plus" size={20} color="white" />
                    <Text style={styles.createButtonText}>Create Quiz</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.quizListContainer}>
                {quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                        <View key={quiz.id} style={styles.quizCard}>
                            <TouchableOpacity
                                style={styles.quizCardContent}
                                onPress={() => {
                                    setCurrentQuiz(quiz)
                                    setGeneratedQuestions(quiz.questions)
                                    setActiveView("view")
                                }}
                            >
                                <View style={styles.quizInfo}>
                                    <Text style={styles.quizTitle}>{quiz.title}</Text>
                                    <Text style={styles.quizMeta}>
                                        {quiz.questions.length} questions • {new Date(quiz.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={styles.quizActions}>
                                    <TouchableOpacity
                                        style={styles.quizAction}
                                        onPress={(e) => {
                                            e.stopPropagation()
                                            handleDeleteQuiz(quiz.id)
                                        }}
                                    >
                                        <MaterialIcons name="delete" size={20} color="#ff5694" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="quiz" size={64} color="#ccc" />
                        <Text style={styles.emptyStateText}>No quizzes created yet</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Create your first quiz by clicking the "Create Quiz" button
                        </Text>
                    </View>
                )}
            </ScrollView>
        </>
    )

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5c51f3" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {activeView === "list" && renderQuizList()}

            {activeView === "generate" && (
                <QuizGenerator onQuizGenerated={handleQuizGenerated} />
            )}

            {activeView === "view" && (
                <QuizViewer
                    questions={generatedQuestions}
                    onBack={() => setActiveView(currentQuiz ? "list" : "generate")}
                    onSave={handleSaveQuiz}
                />
            )}
        </View>
    )
}

export default QuizTab
