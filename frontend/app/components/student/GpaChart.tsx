"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { APP_CONFIG } from '@/app-config';

const API_BASE_URL = APP_CONFIG.API_BASE_URL;

// Type definitions
interface GpaEntry {
    value: number;
    date: string;
    _id: string;
}

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    program: string;
    year: number;
    gpa: GpaEntry[];
    isVerified: boolean;
    isSuspended: boolean;
    suspendedUntil: string | null;
    joinDate: string;
    createdAt: string;
    __v: number;
}

interface ChartDataset {
    data: number[];
    color: (opacity?: number) => string;
    strokeWidth: number;
}

interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
    legend: string[];
}

const GPAChart: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    const [gpaData, setGpaData] = useState<ChartData>({
        labels: [],
        datasets: [
            {
                data: [],
                color: (opacity = 1) => `rgba(92, 81, 243, ${opacity})`,
                strokeWidth: 2,
            },
        ],
        legend: ["GPA Trend"],
    });

    const ensureSafeData = (data: number[]): number[] => {
        return data.map(value => (isNaN(value) || value === null || value === undefined) ? 0 : value);
    };

    const ensureMinimumDataLength = (data: number[], minLength: number): number[] => {
        if (data.length < minLength) {
            return [...data, ...Array(minLength - data.length).fill(data[data.length - 1] || 0)];
        }
        return data;
    };

    const getChartWidth = (): number => {
        const screenWidth = Dimensions.get('window').width;
        const dataPointCount = gpaData.labels.length;
        const minWidthPerDataPoint = 80;
        return Math.max(screenWidth, dataPointCount * minWidthPerDataPoint);
    };

    const getLatestGpaValue = (): number => {
        if (!userData?.gpa || userData.gpa.length === 0) return 0;
        const sortedGpa = [...userData.gpa].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return sortedGpa[0]?.value ?? 0;
    };

    const getEarliestGpaValue = (): number => {
        if (!userData?.gpa || userData.gpa.length === 0) return 0;
        const sortedGpa = [...userData.gpa].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        return sortedGpa[0]?.value ?? 0;
    };

    const getGpaChange = (): number => {
        return getLatestGpaValue() - getEarliestGpaValue();
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get<UserData>(`${API_BASE_URL}/api/user/${userData?._id}`);
                setUserData(response.data);

                if (response.data.gpa && response.data.gpa.length > 0) {
                    const sortedGpa = [...response.data.gpa].sort((a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    );

                    const labels = sortedGpa.map(entry => {
                        const date = new Date(entry.date);
                        return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2)}`;
                    });

                    const values = sortedGpa.map(entry => entry.value);

                    setGpaData({
                        labels,
                        datasets: [
                            {
                                data: values,
                                color: (opacity = 1) => `rgba(92, 81, 243, ${opacity})`,
                                strokeWidth: 2,
                            },
                        ],
                        legend: ["GPA Trend"],
                    });
                }

                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(92, 81, 243, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#5C51F3"
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#5C51F3" />
                <Text style={styles.loadingText}>Loading GPA data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error loading data: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>GPA Trend Over Past 6 Months</Text>
            {userData && userData.gpa && userData.gpa.length > 0 ? (
                <>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <LineChart
                            data={{
                                ...gpaData,
                                datasets: gpaData.datasets.map(dataset => ({
                                    ...dataset,
                                    data: ensureMinimumDataLength(ensureSafeData(dataset.data), 2)
                                }))
                            }}
                            width={Math.max(getChartWidth(), 300)}
                            height={220}
                            chartConfig={chartConfig}
                            style={styles.chart}
                        />
                    </ScrollView>

                    <View style={styles.statsContainer}>
                        <Text style={styles.statsText}>
                            Current GPA: <Text style={styles.statsHighlight}>
                                {getLatestGpaValue().toFixed(2)}
                            </Text>
                        </Text>
                        <Text style={styles.statsText}>
                            GPA Change: <Text style={[
                                styles.statsHighlight,
                                {
                                    color: getGpaChange() >= 0 ? '#4CAF50' : '#F44336'
                                }
                            ]}>
                                {getGpaChange().toFixed(2)}
                            </Text>
                        </Text>
                    </View>
                </>
            ) : (
                <Text style={styles.noDataText}>No GPA data available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F5F8FF',
        borderRadius: 12,
        marginVertical: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    loadingText: {
        marginTop: 10,
        textAlign: 'center',
        color: '#666',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    noDataText: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    statsText: {
        fontSize: 14,
        color: '#555',
    },
    statsHighlight: {
        fontWeight: 'bold',
        color: '#5C51F3',
    },
});

export default GPAChart;
