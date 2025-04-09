import React from "react";
import { View, Text, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import styles from "../../styles/AdminDashboard.style";

const screenWidth = Dimensions.get("window").width;

interface AnalyticsSectionProps {
    userGrowthData: any;
    departmentDistributionData: any;
    systemUsageData: any;
}

export default function AnalyticsSection({
    userGrowthData,
    departmentDistributionData,
    systemUsageData
}: AnalyticsSectionProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analytics</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>User Growth</Text>
                    <LineChart
                        data={userGrowthData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#4169E1",
                            },
                        }}
                        style={styles.chart}
                    />
                </View>
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Department Distribution</Text>
                    <PieChart
                        data={departmentDistributionData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                </View>
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>System Usage (Last Week)</Text>
                    <BarChart
                        data={systemUsageData}
                        width={screenWidth - 40}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=" hrs"
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(64, 191, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            barPercentage: 0.7,
                        }}
                        style={styles.chart}
                    />
                </View>
            </ScrollView>
        </View>
    );
}