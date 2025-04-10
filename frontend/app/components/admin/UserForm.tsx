import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "../../styles/AdminDashboard.style";
import { APP_CONFIG } from "@/app-config";

const API_BASE_URL = APP_CONFIG.API_BASE_URL;

interface UserFormProps {
    onClose: () => void;
    onSuccess: (newUser: any) => void;
}

export default function UserForm({ onClose, onSuccess }: UserFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "student" as "student" | "professor" | "admin",
        department: "",
        program: "",
        year: undefined as number | undefined,
        isVerified: true // Set verified by default for admin-created users
    });

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${API_BASE_URL}/api/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "User created successfully");
                onSuccess(data.user);
            } else {
                Alert.alert("Error", data.error || "Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            Alert.alert("Error", "Failed to create user");
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New User</Text>
                <TouchableOpacity onPress={onClose}>
                    <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    value={newUser.email}
                    onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                />

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    value={newUser.password}
                    onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                />

                <Text style={styles.inputLabel}>Role</Text>
                <View style={styles.roleOptions}>
                    <TouchableOpacity
                        style={[styles.roleOption, newUser.role === "student" && styles.selectedRoleOption]}
                        onPress={() => setNewUser({ ...newUser, role: "student" })}
                    >
                        <Text style={[styles.roleOptionText, newUser.role === "student" && styles.selectedRoleOptionText]}>
                            Student
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleOption, newUser.role === "professor" && styles.selectedRoleOption]}
                        onPress={() => setNewUser({ ...newUser, role: "professor" })}
                    >
                        <Text style={[styles.roleOptionText, newUser.role === "professor" && styles.selectedRoleOptionText]}>
                            Professor
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleOption, newUser.role === "admin" && styles.selectedRoleOption]}
                        onPress={() => setNewUser({ ...newUser, role: "admin" })}
                    >
                        <Text style={[styles.roleOptionText, newUser.role === "admin" && styles.selectedRoleOptionText]}>
                            Admin
                        </Text>
                    </TouchableOpacity>
                </View>

                {newUser.role === "professor" || newUser.role === "student" && (
                    <>
                        <Text style={styles.inputLabel}>Department</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter department"
                            value={newUser.department}
                            onChangeText={(text) => setNewUser({ ...newUser, department: text })}
                        />
                    </>
                )}

                {newUser.role === "student" && (
                    <>
                        <Text style={styles.inputLabel}>Program</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter program"
                            value={newUser.program}
                            onChangeText={(text) => setNewUser({ ...newUser, program: text })}
                        />

                        <Text style={styles.inputLabel}>Year</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter year (1-4)"
                            keyboardType="numeric"
                            value={newUser.year?.toString() || ""}
                            onChangeText={(text) => setNewUser({ ...newUser, year: parseInt(text) || undefined })}
                        />
                    </>
                )}

                <TouchableOpacity style={styles.submitButton} onPress={handleAddUser} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Add User</Text>}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}