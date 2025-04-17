import { View, Text } from "react-native"

export default function OfflineNotice() {
    return (
        <View style={{ backgroundColor: "orange", padding: 10 }}>
            <Text style={{ color: "white", textAlign: "center" }}>You are offline. Showing cached data.</Text>
        </View>
    )
}
