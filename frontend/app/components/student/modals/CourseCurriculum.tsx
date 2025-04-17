import { View, Text } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import styles from "../../../styles/StudentDashboard.style"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"

interface CourseCurriculumProps {
    courseId: string
    curriculum: any[]
}

export default function CourseCurriculum({ courseId, curriculum }: CourseCurriculumProps) {
    return (
        <View style={styles.curriculumContainer}>
            {curriculum.map((c) => (
                <View key={c._id} style={styles.curriculumSection}>
                    <Text style={styles.curriculumTitle}>{c.title}</Text>

                    <Text style={styles.curriculumDescription}>{c.description}</Text>

                    {c.units.map((unit: { _id: Key | null | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; topics: any[]; resources: any[] }) => (
                        <View key={unit._id} style={styles.curriculumUnit}>
                            <Text style={styles.unitTitle}>{unit.title}</Text>

                            <Text style={styles.topicsHeader}>Topics:</Text>
                            {unit.topics.map((topic: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                                <View key={index} style={styles.topicItem}>
                                    <View style={styles.bulletPoint} />
                                    <Text style={styles.topicText}>{topic}</Text>
                                </View>
                            ))}

                            <Text style={styles.resourcesHeader}>Resources:</Text>
                            {unit.resources.map((resource: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                                <View key={index} style={styles.resourceItem}>
                                    <MaterialIcons name="description" size={16} color="#5c51f3" />
                                    <Text style={styles.resourceText}>{resource}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    )
}
