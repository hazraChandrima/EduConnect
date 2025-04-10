import { Stack, Slot } from "expo-router";

export default function RoleLayout() {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="index" options={{ title: "Role Home" }} />
            <Stack.Screen name="[userId]" options={{ title: "User Details" }} />
        </Stack>
    );
}