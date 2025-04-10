import { Stack } from "expo-router";

export default function RoleLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="[userId]" options={{ title: "User Details" }} />
        </Stack>
    );
}