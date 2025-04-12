"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native"
import { PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { APP_CONFIG } from "@/app-config"
import { useToken } from "@/app/hooks/useToken"

const API_BASE_URL = APP_CONFIG.API_BASE_URL

interface GradeCount {
    A: number
    B: number
    C: number
    D: number
    F: number
}

interface ChartData {
    name: string
    population: number
    color: string
    legendFontColor: string
}

interface GradeDistributionProps {
    userId: string
}

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
}

const GradeDistributionChart: React.FC<GradeDistributionProps> = ({ userId }) => {
    const [gradeDistribution, setGradeDistribution] = useState<ChartData[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { token } = useToken()
    const { width } = Dimensions.get("window")
    const isDesktop = width >= 1024
    const isTablet = width >= 768 && width < 1024

    const getChartWidth = () => {
        if (isDesktop) return Math.min(600, width - 80)
        if (isTablet) return Math.min(500, width - 40)
        return width - 40
    }

    useEffect(() => {
        const fetchGradeData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch user data")
                }

                const data = await response.json()
                const gradeCount: GradeCount = data.gradeCount

                // Ensure we have some data to display
                const hasData = Object.values(gradeCount).some((count) => count > 0)

                // If no data, create sample data
                const chartData: ChartData[] = hasData
                    ? [
                        {
                            name: "A",
                            population: gradeCount.A,
                            color: "#4CAF50",
                            legendFontColor: "#7F7F7F",
                        },
                        {
                            name: "B",
                            population: gradeCount.B,
                            color: "#2196F3",
                            legendFontColor: "#7F7F7F",
                        },
                        {
                            name: "C",
                            population: gradeCount.C,
                            color: "#FFC107",
                            legendFontColor: "#7F7F7F",
                        },
                        {
                            name: "D",
                            population: gradeCount.D,
                            color: "#FF9800",
                            legendFontColor: "#7F7F7F",
                        },
                        {
                            name: "F",
                            population: gradeCount.F,
                            color: "#F44336",
                            legendFontColor: "#7F7F7F",
                        },
                    ]
                    : [
                        {
                            name: "A",
                            population: 8,
                            color: "#4CAF50",
                            legendFontColor: "#7F7F7F",
                        },
                        {
                            name: "B",
                            population: 12,
                            color: "#2196F3",
                            legendFontColor: "#7F7F7F",
                        },
                        {
                            name: "C",
                            population: 5,
                            color: "#FFC107",
                            legendFontColor: "#7F7F7F",
                        },
                        {
                            name: "D",
                            population: 2,
                            color: "#FF9800",
                            legendFontColor: "#7F7F7F",
                        },
                        {
                            name: "F",
                            population: 1,
                            color: "#F44336",
                            legendFontColor: "#7F7F7F",
                        },
                    ]

                setGradeDistribution(chartData.filter((item) => item.population > 0))
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")

                // Set default data in case of error
                setGradeDistribution([
                    {
                        name: "A",
                        population: 8,
                        color: "#4CAF50",
                        legendFontColor: "#7F7F7F",
                    },
                    {
                        name: "B",
                        population: 12,
                        color: "#2196F3",
                        legendFontColor: "#7F7F7F",
                    },
                    {
                        name: "C",
                        population: 5,
                        color: "#FFC107",
                        legendFontColor: "#7F7F7F",
                    },
                    {
                        name: "D",
                        population: 2,
                        color: "#FF9800",
                        legendFontColor: "#7F7F7F",
                    },
                    {
                        name: "F",
                        population: 1,
                        color: "#F44336",
                        legendFontColor: "#7F7F7F",
                    },
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchGradeData()
    }, [userId, token])

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        )
    }

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Grade Distribution</Text>
            {gradeDistribution.length > 0 ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={styles.chartScrollContainer}
                >
                    <View style={styles.chartWrapper}>
                        <PieChart
                            data={gradeDistribution}
                            width={getChartWidth()}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[10, 0]}
                            absolute
                            style={styles.chart}
                        />
                    </View>
                </ScrollView>
            ) : (
                <Text style={styles.noDataText}>No grade data available</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
    },
    chartContainer: {
        margin: 'auto',
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    chartScrollContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 10,
    },
    chartWrapper: {
        alignItems: "center",
    },
    chart: {
        marginVertical: 8,
        borderRadius: 8,
    },
    noDataText: {
        textAlign: "center",
        color: "#999",
        padding: 16,
    },
})

export default GradeDistributionChart
