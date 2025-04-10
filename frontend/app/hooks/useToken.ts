import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";

export const useToken = () => {
    const [token, setToken] = useState<string | null>(null);

    // Load token on mount
    useEffect(() => {
        const loadToken = async () => {
            const storedToken =
                Platform.OS === "web"
                    ? localStorage.getItem(TOKEN_KEY)
                    : await AsyncStorage.getItem(TOKEN_KEY);
            setToken(storedToken);
        };

        loadToken();
    }, []);


    const saveToken = useCallback(async (newToken: string) => {
        if (Platform.OS === "web") {
            localStorage.setItem(TOKEN_KEY, newToken);
        } else {
            await AsyncStorage.setItem(TOKEN_KEY, newToken);
        }
        setToken(newToken);
    }, []);

    
    const removeToken = useCallback(async () => {
        if (Platform.OS === "web") {
            localStorage.removeItem(TOKEN_KEY);
        } else {
            await AsyncStorage.removeItem(TOKEN_KEY);
        }
        setToken(null);
    }, []);

    return { token, saveToken, removeToken };
};
