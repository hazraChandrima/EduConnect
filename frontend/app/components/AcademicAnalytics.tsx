import React, { useState } from "react";
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    useWindowDimensions,
    SafeAreaView,
} from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
} from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/AcademicAnalytics.style";

type TabType = "performance" | "attendance" | "marks" | "curriculum";

interface TabItem {
    id: TabType;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}

interface GradeDistributionItem {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
}

interface MarkItem {
    subject: string;
    marks: number;
    grade: string;
    remarks: string;
    color: string;
}

interface Unit {
    name: string;
    progress: number;
}

interface CourseItem {
    subject: string;
    color: string;
    units: Unit[];
}

const AcademicAnalytics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("performance");
    const { width } = useWindowDimensions();

    // Responsive chart width calculation
    const getChartWidth = (): number => {
        return width;
    };

    // Performance data (GPA over time)
    const performanceData = {
        labels: ["Aug","Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        datasets: [
            {
                data: [2.9, 3.2, 3.5, 3.3, 3.7, 3.8, 3.9, 3.5],
                color: (opacity = 1) => `rgba(92, 81, 243, ${opacity})`,
                strokeWidth: 2,
            },
        ],
        legend: ["GPA Trend"],
    };

    // Attendance data
    const attendanceData = {
        labels: ["CS 101", "MATH 202", "PHYS 101", "ENG 110", "HIST 105"],
        data: [0.85, 0.92, 0.78, 0.95, 0.88],
    };

    // Subject performance data
    const subjectPerformanceData = {
        labels: ["CS 101", "MATH 202", "PHYS 101", "ENG 110", "HIST 105"],
        datasets: [
            {
                data: [85, 78, 82, 91, 76],
            },
        ],
    };

    // Grade distribution data
    const gradeDistributionData: GradeDistributionItem[] = [
        {
            name: "A",
            population: 3,
            color: "#5c51f3",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        },
        {
            name: "B",
            population: 2,
            color: "#52c4eb",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        },
        {
            name: "C",
            population: 1,
            color: "#ff5694",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        },
        {
            name: "D",
            population: 4,
            color: "#ffc107",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        },
        {
            name: "F",
            population: 0,
            color: "#ff5252",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        },
    ];

    // Chart configuration
    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(92, 81, 243, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#5c51f3",
        },
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "performance":
                return (
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>GPA Trend</Text>
                        <Text style={styles.chartSubtitle}>
                            Your academic performance over time
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <LineChart
                                data={performanceData}
                                width={Math.max(getChartWidth(), 300)}
                                height={220}
                                chartConfig={chartConfig}
                                bezier
                                style={styles.chart}
                            />
                        </ScrollView>

                        <Text style={styles.chartTitle}>Grade Distribution</Text>
                        <Text style={styles.chartSubtitle}>
                            Current semester grade breakdown
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <PieChart
                                data={gradeDistributionData}
                                width={Math.max(getChartWidth(), 300)}
                                height={220}
                                chartConfig={chartConfig}
                                accessor={"population"}
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                center={[10, 0]}
                                absolute
                                style={styles.chart}
                            />
                        </ScrollView>
                    </View>
                );
            case "attendance":
                return (
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Attendance by Subject</Text>
                        <Text style={styles.chartSubtitle}>
                            Your attendance percentage across courses
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <ProgressChart
                                data={attendanceData}
                                width={Math.max(getChartWidth(), 500)}
                                height={300}
                                strokeWidth={16}
                                radius={24}
                                chartConfig={{
                                    ...chartConfig,
                                    color: (opacity = 1) => `rgba(92, 81, 243, ${opacity})`,
                                }}
                                hideLegend={false}
                                style={styles.chart}
                            />
                        </ScrollView>

                        <View style={styles.attendanceDetails}>
                            <Text style={styles.detailsTitle}>Attendance Details</Text>

                            <View style={styles.attendanceItem}>
                                <View style={styles.attendanceItemHeader}>
                                    <Text style={styles.attendanceItemTitle}>CS 101</Text>
                                    <Text style={styles.attendanceItemValue}>85%</Text>
                                </View>
                                <Text style={styles.attendanceItemDetail}>
                                    Attended 17 of 20 classes
                                </Text>
                                <View style={styles.attendanceWarning}>
                                    <Ionicons name="warning" size={16} color="#ffc107" />
                                    <Text style={styles.attendanceWarningText}>
                                        Minimum required: 75%
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.attendanceItem}>
                                <View style={styles.attendanceItemHeader}>
                                    <Text style={styles.attendanceItemTitle}>MATH 202</Text>
                                    <Text style={styles.attendanceItemValue}>92%</Text>
                                </View>
                                <Text style={styles.attendanceItemDetail}>
                                    Attended 22 of 24 classes
                                </Text>
                            </View>

                            <View style={styles.attendanceItem}>
                                <View style={styles.attendanceItemHeader}>
                                    <Text style={styles.attendanceItemTitle}>PHYS 101</Text>
                                    <Text style={[styles.attendanceItemValue, { color: "#ff5252" }]}>
                                        78%
                                    </Text>
                                </View>
                                <Text style={styles.attendanceItemDetail}>
                                    Attended 14 of 18 classes
                                </Text>
                                <View style={styles.attendanceWarning}>
                                    <Ionicons name="warning" size={16} color="#ff5252" />
                                    <Text style={[styles.attendanceWarningText, { color: "#ff5252" }]}>
                                        Only 3% above minimum requirement
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            case "marks":
                return (
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Subject Performance</Text>
                        <Text style={styles.chartSubtitle}>
                            Your marks across different subjects
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <BarChart
                                data={subjectPerformanceData}
                                width={Math.max(getChartWidth(), 300)}
                                height={220}
                                yAxisLabel=""
                                yAxisSuffix="%"
                                chartConfig={{
                                    ...chartConfig,
                                    barPercentage: 1.0,
                                }}
                                style={styles.chart}
                            />
                        </ScrollView>

                        <View style={styles.marksDetails}>
                            <Text style={styles.detailsTitle}>Detailed Marks</Text>

                            {[
                                {
                                    subject: "CS 101",
                                    marks: 85,
                                    grade: "A",
                                    remarks: "Excellent work on the final project. Your algorithm implementation was very efficient.",
                                    color: "#52c4eb"
                                },
                                {
                                    subject: "MATH 202",
                                    marks: 78,
                                    grade: "B",
                                    remarks: "Good understanding of calculus concepts. Need to work on integration techniques.",
                                    color: "#ff5694"
                                },
                                {
                                    subject: "PHYS 101",
                                    marks: 82,
                                    grade: "B+",
                                    remarks: "Strong grasp of mechanics. Could improve on electricity concepts.",
                                    color: "#5c51f3"
                                },
                            ].map((item: MarkItem, index: number) => (
                                <View key={index} style={styles.marksItem}>
                                    <View style={styles.marksItemHeader}>
                                        <View style={[styles.subjectTag, { backgroundColor: item.color }]}>
                                            <Text style={styles.subjectTagText}>{item.subject}</Text>
                                        </View>
                                        <View style={styles.gradeContainer}>
                                            <Text style={styles.marksValue}>{item.marks}%</Text>
                                            <Text style={styles.gradeValue}>Grade: {item.grade}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.remarksContainer}>
                                        <Text style={styles.remarksTitle}>Professor Remarks:</Text>
                                        <Text style={styles.remarksText}>{item.remarks}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case "curriculum":
                return (
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Curriculum Progress</Text>
                        <Text style={styles.chartSubtitle}>
                            Your progress through course materials
                        </Text>

                        {[
                            {
                                subject: "CS 101",
                                color: "#52c4eb",
                                units: [
                                    { name: "Introduction to Algorithms", progress: 100 },
                                    { name: "Data Structures", progress: 85 },
                                    { name: "Object-Oriented Programming", progress: 75 },
                                    { name: "Database Systems", progress: 60 },
                                    { name: "Web Development", progress: 30 },
                                ]
                            },
                            {
                                subject: "MATH 202",
                                color: "#ff5694",
                                units: [
                                    { name: "Limits and Continuity", progress: 100 },
                                    { name: "Differentiation", progress: 100 },
                                    { name: "Applications of Derivatives", progress: 90 },
                                    { name: "Integration", progress: 65 },
                                    { name: "Differential Equations", progress: 20 },
                                ]
                            },
                            {
                                subject: "PHYS 101",
                                color: "#5c51f3",
                                units: [
                                    { name: "Mechanics", progress: 100 },
                                    { name: "Thermodynamics", progress: 85 },
                                    { name: "Waves and Optics", progress: 70 },
                                    { name: "Electricity and Magnetism", progress: 40 },
                                    { name: "Modern Physics", progress: 10 },
                                ]
                            }
                        ].map((course: CourseItem, index: number) => (
                            <View key={index} style={styles.curriculumItem}>
                                <View style={[styles.curriculumHeader, { backgroundColor: course.color + '20' }]}>
                                    <Text style={[styles.curriculumTitle, { color: course.color }]}>
                                        {course.subject}
                                    </Text>
                                    <TouchableOpacity style={[styles.viewSyllabusButton, { backgroundColor: course.color }]}>
                                        <Text style={styles.viewSyllabusText}>View Syllabus</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.unitsContainer}>
                                    {course.units.map((unit, unitIndex) => (
                                        <View key={unitIndex} style={styles.unitItem}>
                                            <View style={styles.unitHeader}>
                                                <Text style={styles.unitTitle}>{unit.name}</Text>
                                                <Text style={styles.unitProgress}>{unit.progress}%</Text>
                                            </View>
                                            <View style={styles.progressBarContainer}>
                                                <View
                                                    style={[
                                                        styles.progressBar,
                                                        { width: `${unit.progress}%`, backgroundColor: course.color }
                                                    ]}
                                                />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                );
            default:
                return null;
        }
    };

    const tabs: TabItem[] = [
        { id: "performance", label: "Performance", icon: "analytics" },
        { id: "attendance", label: "Attendance", icon: "calendar" },
        { id: "marks", label: "Marks & Remarks", icon: "school" },
        { id: "curriculum", label: "Curriculum", icon: "book" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[
                                styles.tab,
                                activeTab === tab.id && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab(tab.id)}
                        >
                            <Ionicons
                                name={tab.icon}
                                size={20}
                                color={activeTab === tab.id ? "#5c51f3" : "#777"}
                            />

                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab.id && styles.activeTabText,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {renderTabContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AcademicAnalytics;