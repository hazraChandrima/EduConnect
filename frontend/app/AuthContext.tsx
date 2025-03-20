import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface User {
  email: string;
  role: 'student' | 'professor' | 'admin';
  token: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean; 
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    console.log("Checking for stored user...");
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (token && storedUser) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(storedUser));
          console.log("Loaded user from storage:", JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);  
      }
    };
    loadUser();
  }, []);



  const login = async (email: string, password: string) => {
    console.log("Sending login request to backend...");
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      console.log("Server response:", response.data);
  
      const userData: User = { email, role: response.data.role, token: response.data.token };
  
      setUser(userData);
  
      // Store the user data in AsyncStorage
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      console.log("User logged in and stored:", userData);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Login request failed:", err.message);
    }
  };
  


  const logout = async () => {
    console.log("Logging out...");
    setIsLoading(true);  
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      axios.defaults.headers.common['Authorization'] = '';
      setUser(null);
      console.log(" User logged out.");
    } catch (error: unknown) {
      const err = error as Error;
      console.error(" Logout failed:", err.message);
    } finally {
      setIsLoading(false);  
    }
  };



  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
