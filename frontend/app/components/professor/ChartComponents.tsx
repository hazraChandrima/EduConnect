import React from "react";
import { View, Text, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import styles from "../../styles/ProfessorDashboard.style";

const screenWidth = Dimensions.get("window").width;

const ensureSafeData = (data: number[]): number[] => {
    return data.map(value => {
        if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
            return 0;
        }
        return value;
    });
};

const ensureMinimumDataLength = (data: number[], minLength: number = 2): number[] => {
    if (!data || data.length === 0) return new Array(minLength).fill(0);
    if (data.length === 1) return [...data, ...new Array(minLength - 1).fill(data[0])];
    return data;
};

interface AttendanceChartProps {
    courses: any[];
    calculateCourseAttendance: (courseId: string) => number;
}


export const AttendanceChart: React.FC<AttendanceChartProps> = ({ courses, calculateCourseAttendance }) => {
    const getAttendanceChartData = () => {
        const labels = courses.map(course => course.code);
        const data = courses.map(course => calculateCourseAttendance(course._id));

        return {
            labels,
            datasets: [
                {
                    data: ensureSafeData(data),
                    color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
                    strokeWidth: 2,
                },
            ],
            legend: ["Attendance %"],
        };
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Attendance by Course</Text>
                <LineChart
                    data={getAttendanceChartData()}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#5c51f3",
                        },
                    }}
                    bezier
                    style={styles.chart}
                />
            </View>
        </ScrollView>
    );
};

interface GradeDistributionProps {
    marks: any[];
}

export const GradeDistributionChart: React.FC<GradeDistributionProps> = ({ marks }) => {
    const getGradeDistributionData = () => {
        // Count grades in ranges: A (90-100), B (80-89), C (70-79), D (60-69), F (0-59)
        const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };

        marks.forEach(mark => {
            const percentage = (mark.score / mark.maxScore) * 100;
            if (percentage >= 90) gradeCounts.A++;
            else if (percentage >= 80) gradeCounts.B++;
            else if (percentage >= 70) gradeCounts.C++;
            else if (percentage >= 60) gradeCounts.D++;
            else gradeCounts.F++;
        });

        // Ensure we have at least some data to prevent chart errors
        if (Object.values(gradeCounts).every(count => count === 0)) {
            gradeCounts.A = 1; // Add a default value to prevent empty charts
        }

        const total = Object.values(gradeCounts).reduce((sum, count) => sum + count, 0);

        return {
            labels: ["A", "B", "C", "D", "F"],
            data: [
                gradeCounts.A / total,
                gradeCounts.B / total,
                gradeCounts.C / total,
                gradeCounts.D / total,
                gradeCounts.F / total,
            ],
            colors: ["#52c4eb", "#5c51f3", "#ff9f40", "#ff5694", "#ff4040"],
        };
    };

    const chartData = getGradeDistributionData();

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Grade Distribution</Text>
                <PieChart
                    data={chartData.labels.map((label, index) => ({
                        name: label,
                        population: chartData.data[index] * 100,
                        color: chartData.colors[index],
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 12,
                    }))}
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
    );
};

interface AssignmentCompletionProps {
    courses: any[];
    assignments: any[];
    submissions: any[];
}

export const AssignmentCompletionChart: React.FC<AssignmentCompletionProps> = ({
    courses,
    assignments,
    submissions
}) => {
    const getAssignmentCompletionData = () => {
        const labels = courses.map(course => course.code);
        const data = courses.map(course => {
            const courseAssignments = assignments.filter(a => a.courseId === course._id);
            if (courseAssignments.length === 0) return 0;

            const totalSubmissions = courseAssignments.reduce((sum, assignment) => {
                const assignmentSubmissions = submissions.filter(sub => sub.assignmentId === assignment._id);
                return sum + assignmentSubmissions.length;
            }, 0);

            const totalPossibleSubmissions = courseAssignments.length * course.students.length;
            return totalPossibleSubmissions > 0
                ? Math.round((totalSubmissions / totalPossibleSubmissions) * 100)
                : 0;
        });

        return {
            labels,
            datasets: [
                {
                    data: ensureSafeData(data),
                    color: (opacity = 1) => `rgba(255, 86, 148, ${opacity})`,
                },
            ],
        };
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Assignment Completion Rate (%)</Text>
                <BarChart
                    data={getAssignmentCompletionData()}
                    width={screenWidth - 40}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="%"
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 86, 148, ${opacity})`,
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
    );
};