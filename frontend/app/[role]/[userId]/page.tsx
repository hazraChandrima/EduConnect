import { useContext, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthContext } from '@/app/context/AuthContext';
import StudentDashboard from '@/app/components/StudentDashboard';
import ProfessorDashboard from '@/app/components/ProfessorDashboard';
import AdminDashboard from '@/app/components/AdminDashboard';

type RouteParams = {
    role?: string;
    userId?: string;
};

// goddamn type safetyyy
type UserRole = 'student' | 'professor' | 'admin';

export default function DashboardPage() {
    const params = useLocalSearchParams<RouteParams>();
    const { role, userId } = params;
    const router = useRouter();
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!auth?.user) {
            router.push('/login' as never);
            return;
        }

        if (auth.user.userId !== userId) {
            router.push(`/${auth.user.role}/${auth.user.userId}` as never);
            return;
        }

        if (auth.user.role !== role) {
            router.push(`/${auth.user.role}/${auth.user.userId}` as never);
            return;
        }

    }, [auth, role, userId, router]);


    if (!auth?.user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#5c51f3" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }


    switch (role as UserRole) {
        case 'student':
            return <StudentDashboard userId={userId || ''} />;
        case 'professor':
            return <ProfessorDashboard userId={userId || ''} />;
        case 'admin':
            return <AdminDashboard userId={userId || ''} />;
        default:
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Invalid role</Text>
                </View>
            );
    }
}