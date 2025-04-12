import { View, Text, StyleSheet } from "react-native"

interface AttendanceStatusBadgeProps {
    status: "present" | "absent" | "excused" | string
}

const AttendanceStatusBadge = ({ status }: AttendanceStatusBadgeProps) => {
    return (
        <View style={[styles.badge, getBadgeStyle(status)]}>
            <Text style={styles.text}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        </View>
    )
}

const getBadgeStyle = (status: string) => {
    switch (status) {
        case "present":
            return styles.presentBadge
        case "absent":
            return styles.absentBadge
        case "excused":
            return styles.excusedBadge
        default:
            return styles.unknownBadge
    }
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    presentBadge: {
        backgroundColor: "#4CAF50",
    },
    absentBadge: {
        backgroundColor: "#F44336",
    },
    excusedBadge: {
        backgroundColor: "#FFC107",
    },
    unknownBadge: {
        backgroundColor: "#9E9E9E",
    },
    text: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
})

export default AttendanceStatusBadge
