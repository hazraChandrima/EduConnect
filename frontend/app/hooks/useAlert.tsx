"use client"

import { useState, useCallback } from "react"
import { Alert, Platform } from "react-native"

interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: "default" | "cancel" | "destructive"; 
}


interface AlertOptions {
    title: string
    message: string
    buttons?: AlertButton[]
}

export const useAlert = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [alertConfig, setAlertConfig] = useState<AlertOptions>({
        title: "",
        message: "",
        buttons: [{ text: "OK" }],
    })

    const hideAlert = useCallback(() => {
        setIsVisible(false)
    }, [])

    const showAlert = useCallback((options: AlertOptions) => {
        if (Platform.OS === "web") {
            // For web, we'll use our custom alert
            setAlertConfig(options)
            setIsVisible(true)
        } else {
            // For native platforms, use the native Alert
            Alert.alert(
                options.title,
                options.message,
                options.buttons?.map((button) => ({
                    text: button.text,
                    onPress: button.onPress,
                    style: button.style,
                })),
            )
        }
    }, [])

    return {
        showAlert,
        hideAlert,
        isVisible,
        alertConfig,
    }
}

