import React, { useState, useRef, useEffect } from "react";
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
    ActivityIndicator,
    Image,
    Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "./styles/Chabot.style";


interface ScrollableChipsProps {
    suggestions: string[];
    onPress: (suggestion: string) => void;
}

type Message = {
    id: string;
    text: string;
    sender: "bot" | "user";
    timestamp: Date;
    isTyping?: boolean;
};

const initialMessages: Message[] = [
    {
        id: "1",
        text: "Hello! I'm EduBot, your virtual assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        id: "2",
        text: "I can help with course information, assignment deadlines, or general questions about EduConnect.",
        sender: "bot",
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
];

const ChatbotScreen = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState<string>("");
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    useEffect(() => {
        // Animation for typing indicator
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
                ])
            ).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [isTyping, fadeAnim]);

    const sendMessage = () => {
        if (inputText.trim() === "") return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages([...messages, userMessage]);
        setInputText("");
        setIsTyping(true);

        // Add typing indicator
        const typingIndicator: Message = {
            id: `typing-${Date.now()}`,
            text: "",
            sender: "bot",
            timestamp: new Date(),
            isTyping: true,
        };

        setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, typingIndicator]);
        }, 300);

        // Remove typing indicator and add actual response
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prevMessages) =>
                prevMessages.filter(msg => !msg.isTyping)
            );

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(inputText),
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prevMessages) => [...prevMessages, botResponse]);
        }, 1500);
    };

    const getBotResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes("assignment") || lowerInput.includes("homework")) {
            return "Your next assignment is the Algorithm Analysis Report for CS 101, due tomorrow. Would you like me to help you prepare for it?";
        } else if (lowerInput.includes("course") || lowerInput.includes("class")) {
            return "You're currently enrolled in Computer Science 101, Mathematics 202, and Physics 101. Which course would you like to know more about?";
        } else if (lowerInput.includes("gpa") || lowerInput.includes("grade")) {
            return "Your current GPA is 3.8. You're doing great! Keep up the good work.";
        } else if (lowerInput.includes("attendance")) {
            return "Your overall attendance is 85%. You've attended 17 out of 20 classes this semester.";
        } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
            return "Hello there! How can I assist you with your studies today?";
        } else {
            return "I'm not sure I understand. Could you rephrase your question? I can help with courses, assignments, grades, and attendance.";
        }
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const renderTypingIndicator = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.typingContainer}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, { marginHorizontal: 4 }]} />
                <View style={styles.typingDot} />
            </View>
        </Animated.View>
    );

    const renderMessage = ({ item }: { item: Message }) => {
        const isBot = item.sender === "bot";

        if (item.isTyping) {
            return (
                <View style={[styles.messageContainer, styles.botMessageContainer]}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.botAvatar}>
                            <MaterialCommunityIcons name="robot" size={16} color="white" />
                        </View>
                    </View>
                    <View style={[styles.messageContent, styles.botMessageContent]}>
                        {renderTypingIndicator()}
                    </View>
                </View>
            );
        }

        return (
            <View style={[
                styles.messageContainer,
                isBot ? styles.botMessageContainer : styles.userMessageContainer
            ]}>
                {isBot && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.botAvatar}>
                            <MaterialCommunityIcons name="robot" size={16} color="white" />
                        </View>
                    </View>
                )}
                <View style={[
                    styles.messageContent,
                    isBot ? styles.botMessageContent : styles.userMessageContent
                ]}>
                    <Text style={isBot ? styles.botMessageText : styles.userMessageText}>
                        {item.text}
                    </Text>
                    <Text style={isBot ? styles.botTimestamp : styles.userTimestamp}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
                {!isBot && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.userAvatar}>
                            <Ionicons name="person" size={16} color="white" />
                        </View>
                    </View>
                )}
            </View>
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
                <View style={styles.headerTitleContainer}>
                    <View style={styles.headerAvatar}>
                        <MaterialCommunityIcons name="robot-outline" size={20} color="white" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>EduBot Assistant</Text>
                        <Text style={styles.headerSubtitle}>
                            {isTyping ? "Typing..." : "Online"}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Suggestions */}
            <View style={styles.suggestionsContainer}>
                <ScrollableChips
                    suggestions={["Assignments", "GPA", "Courses", "Attendance"]}
                    onPress={(suggestion: string) => {
                        setInputText(suggestion);
                    }}
                />
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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
            >
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
                        style={[
                            styles.sendButton,
                            !inputText.trim() && styles.sendButtonDisabled
                        ]}
                        disabled={inputText.trim() === ""}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Scrollable suggestion chips component
const ScrollableChips: React.FC<ScrollableChipsProps> = ({ suggestions, onPress }) => {
    return (
        <View style={styles.chipsScrollContainer}>
            {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.chip}
                    onPress={() => onPress(suggestion)}
                >
                    <Text style={styles.chipText}>{suggestion}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ChatbotScreen;