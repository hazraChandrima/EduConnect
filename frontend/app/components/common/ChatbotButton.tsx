import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ChatbotButtonProps {
    onPress: () => void
}

export default function ChatbotButton({ onPress }: ChatbotButtonProps) {
    return (
        <TouchableOpacity
            style={{
                position: "absolute",
                right: 20,
                bottom: 70,
                backgroundColor: "#5c51f3",
                width: 56,
                height: 56,
                borderRadius: 28,
                justifyContent: "center",
                alignItems: "center",
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                zIndex: 2500,
            }}
            onPress={onPress}
        >
            <Ionicons name="chatbubble-ellipses" size={28} color="white" />
        </TouchableOpacity>
    )
}
