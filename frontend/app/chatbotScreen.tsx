"use client"

import type React from "react"
import { useState, useRef, useEffect, useContext } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    Alert,
    ActivityIndicator
} from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import styles from "./styles/Chabot.style"
import { AuthContext } from "./context/AuthContext"
import { APP_CONFIG } from "@/app-config"

const LOCAL_CHATBOT_URL = APP_CONFIG.LOCAL_CHATBOT_URL;
const DEPLOYED_CHATBOT_URL = APP_CONFIG.DEPLOYED_CHATBOT_URL;

interface ScrollableChipsProps {
    suggestions: string[]
    onPress: (suggestion: string) => void
}

type Message = {
    id: string
    text: string
    sender: "bot" | "user"
    timestamp: Date
    isTyping?: boolean
}

const initialMessages: Message[] = [
    {
        id: "1",
        text: "Hello! I'm EduBot, your virtual assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        id: "2",
        text: "I can help with course information, assignments, academic concepts, or answer questions about computer science, programming, and more.",
        sender: "bot",
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
]



const ChatbotScreen = () => {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [inputText, setInputText] = useState<string>("")
    const [isTyping, setIsTyping] = useState(false)
    const flatListRef = useRef<FlatList>(null)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const isLoggedIn = async (): Promise<void> => {
            setIsLoading(true);
            try {
                if (!auth?.user) {
                    console.log("No authenticated user, redirecting to login");
                    router.replace("/login");
                    return;
                }
            } catch {
                console.log("Some unknown error occurred");
            } finally {
                setIsLoading(false);
            }
        }
        isLoggedIn();
    }, [auth])



    useEffect(() => {
        
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true })
        }
    }, [messages])



    useEffect(() => {

        if (isTyping) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0.3,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ).start()
        } else {
            fadeAnim.setValue(0)
        }
    }, [isTyping, fadeAnim])


    
    if (auth?.isLoading || isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#5c51f3" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </SafeAreaView>
        );
    }


    
    const fetchBotResponse = async (email:string, query: string): Promise<string> => {
        try {
            const response = await fetch(`${DEPLOYED_CHATBOT_URL}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, query }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            return data.answer;
        } catch (error) {
            console.error('Error fetching bot response:', error);
            return "I'm sorry, I couldn't process your request.";
        }
    };


    const sendMessage = async () => {
        if (inputText.trim() === "") return

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "user",
            timestamp: new Date(),
        }

        setMessages([...messages, userMessage])
        setInputText("")
        setIsTyping(true)

        const typingIndicator: Message = {
            id: `typing-${Date.now()}`,
            text: "",
            sender: "bot",
            timestamp: new Date(),
            isTyping: true,
        }

        setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, typingIndicator])
        }, 300)

        try {
            const userEmail = auth?.user?.email
            const botResponseText = await fetchBotResponse(userEmail as string, inputText)

            // Remove typing indicator and add actual response
            setTimeout(() => {
                setIsTyping(false)
                setMessages((prevMessages) => prevMessages.filter((msg) => !msg.isTyping))

                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: botResponseText,
                    sender: "bot",
                    timestamp: new Date(),
                }

                setMessages((prevMessages) => [...prevMessages, botResponse])
            }, 1500)
        } catch (error) {
            // Handle any errors in fetching response
            setIsTyping(false)
            setMessages((prevMessages) => prevMessages.filter((msg) => !msg.isTyping))
        }
    }

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const renderTypingIndicator = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.typingContainer}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, { marginHorizontal: 4 }]} />
                <View style={styles.typingDot} />
            </View>
        </Animated.View>
    )

    const renderMessage = ({ item }: { item: Message }) => {
        const isBot = item.sender === "bot"

        if (item.isTyping) {
            return (
                <View style={[styles.messageContainer, styles.botMessageContainer]}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.botAvatar}>
                            <MaterialCommunityIcons name="robot" size={16} color="white" />
                        </View>
                    </View>
                    <View style={[styles.messageContent, styles.botMessageContent]}>{renderTypingIndicator()}</View>
                </View>
            )
        }

        return (
            <View style={[styles.messageContainer, isBot ? styles.botMessageContainer : styles.userMessageContainer]}>
                {isBot && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.botAvatar}>
                            <MaterialCommunityIcons name="robot" size={16} color="white" />
                        </View>
                    </View>
                )}
                <View style={[styles.messageContent, isBot ? styles.botMessageContent : styles.userMessageContent]}>
                    <Text style={isBot ? styles.botMessageText : styles.userMessageText}>{item.text}</Text>
                    <Text style={isBot ? styles.botTimestamp : styles.userTimestamp}>{formatTime(item.timestamp)}</Text>
                </View>
                {!isBot && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.userAvatar}>
                            <Ionicons name="person" size={16} color="white" />
                        </View>
                    </View>
                )}
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#4252e5" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.headerAvatar}>
                        <MaterialCommunityIcons name="robot-outline" size={20} color="white" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>EduBot Assistant</Text>
                        <Text style={styles.headerSubtitle}>{isTyping ? "Typing..." : "Online"}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Suggestions */}
            <View style={styles.suggestionsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <ScrollableChips
                        suggestions={[
                            "Assignments",
                            "GPA",
                            "Courses",
                            "Attendance",
                            "Algorithms",
                            "Data Structures",
                            "OOP",
                            "Databases",
                            "Machine Learning",
                        ]}
                        onPress={(suggestion: string) => {
                            setInputText(suggestion)
                        }}
                    />
                </ScrollView>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
            />

            {/* Input area */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="add-circle-outline" size={24} color="#5c51f3" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask me anything..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={1000}
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        disabled={inputText.trim() === ""}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

// Scrollable suggestion chips component
const ScrollableChips: React.FC<ScrollableChipsProps> = ({ suggestions, onPress }) => {
    return (
        <View style={styles.chipsScrollContainer}>
            {suggestions.map((suggestion, index) => (
                <TouchableOpacity key={index} style={styles.chip} onPress={() => onPress(suggestion)}>
                    <Text style={styles.chipText}>{suggestion}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default ChatbotScreen