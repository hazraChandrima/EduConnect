import { View, Text, StyleSheet } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface SubmissionStatsBadgeProps {
    totalSubmissions: number
    pendingCount: number
    gradedCount: number
    backgroundColor?: string
}

export default function SubmissionStatsBadge({
    totalSubmissions,
    pendingCount,
    gradedCount,
    backgroundColor = "#f0f4ff",
}: SubmissionStatsBadgeProps) {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.statItem}>
                <MaterialIcons name="description" size={16} color="#555" />
                <Text style={styles.statText}>{totalSubmissions} Total</Text>
            </View>

            {pendingCount > 0 && (
                <View style={styles.statItem}>
                    <MaterialIcons name="pending-actions" size={16} color="#f59e0b" />
                    <Text style={[styles.statText, styles.pendingText]}>{pendingCount} Pending</Text>
                </View>
            )}

            {gradedCount > 0 && (
                <View style={styles.statItem}>
                    <MaterialIcons name="check-circle" size={16} color="#10b981" />
                    <Text style={[styles.statText, styles.gradedText]}>{gradedCount} Graded</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 6,
        flexWrap: "wrap",
        gap: 8,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    statText: {
        fontSize: 12,
        marginLeft: 4,
        color: "#555",
    },
    pendingText: {
        color: "#b45309",
    },
    gradedText: {
        color: "#047857",
    },
})
