// components/admin/SettingsTab.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/AdminDashboard.style";

export default function SettingsTab() {
    return (
        <>
            <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>System Settings</Text>
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>General Settings</Text>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="school" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Institution Information</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="calendar" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Academic Calendar</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="notifications" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Notification Settings</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Security Settings</Text>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="lock-closed" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Authentication Settings</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="key" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>API Keys</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="shield" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Privacy Settings</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>System Maintenance</Text>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="cloud-upload" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>Backup & Restore</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="refresh" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>System Updates</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                        <Ionicons name="analytics" size={24} color="#4169E1" />
                        <Text style={styles.settingsItemText}>System Logs</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>
        </>
    );
}