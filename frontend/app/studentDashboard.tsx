import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome, MaterialIcons, AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles/StudentDashboard.style";
import { useRouter } from "expo-router";
import AcademicAnalytics from "./components/AcademicAnalytics";
import { useWindowDimensions } from "react-native";
import { AuthContext } from "./context/AuthContext"; 
import * as DocumentPicker from 'expo-document-picker';
import {
  UserData,
  Course,
  Assignment,
  Curriculum,
  CurriculumUnit,
  Attendance,
  Mark,
  ProfessorRemark,
  SubmissionFile,
  sampleCourses,
  sampleAssignments,
  sampleCurriculum,
  sampleAttendance,
  sampleMarks,
  sampleRemarks
} from "./utils/dummy_data/sample_student";


const useIsSmallDevice = () => {
  const { width } = useWindowDimensions();
  return width < 500;
};


export default function StudentDashboard(): React.ReactElement {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSmallDevice = useIsSmallDevice();
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "courses" | "assignments" | "attendance">("home");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [activeCourseTab, setActiveCourseTab] = useState<"curriculum" | "attendance" | "marks" | "remarks">("curriculum");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<SubmissionFile[]>([]);
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments);
  const [curriculum, setCurriculum] = useState<Curriculum[]>(sampleCurriculum);
  const [attendance, setAttendance] = useState<Attendance[]>(sampleAttendance);
  const [marks, setMarks] = useState<Mark[]>(sampleMarks);
  const [remarks, setRemarks] = useState<ProfessorRemark[]>(sampleRemarks);

  // Default name for fallback
  const displayName = userData?.name || "Student";
  const firstName = displayName.split(" ")[0];


  useEffect(() => {
    const checkAuthAndFetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);

        if (!auth?.user) {
          console.log("No authenticated user, redirecting to login");
          router.replace("/login");
          return;
        }

        if (auth.user.role !== "student") {
          console.log(`User role is ${auth.user.role}, not authorized for student dashboard`);
          router.replace(`/${auth.user.role}Dashboard`);
          return;
        }

        const response = await fetch(`http://192.168.142.247:3000/api/user/${auth.user.userId}`);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json() as UserData;
        if (data && data.name) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error in StudentDashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [auth, router]);

  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout().then(() => router.replace("/login"));
    }
  };


  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setActiveCourseTab("curriculum");
    setIsCourseModalVisible(true);
  };


  const handleAssignmentSelect = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionText("");
    setSubmissionFiles([]);
    setIsSubmissionModalVisible(true);
  };


  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const pickedFile = result.assets[0]; // Get the first selected file

        const newFile: SubmissionFile = {
          name: pickedFile.name,
          uri: pickedFile.uri,
          type: pickedFile.mimeType || "application/octet-stream",
          size: pickedFile.size ?? 0,
        };

        setSubmissionFiles([...submissionFiles, newFile]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };


  const removeFile = (index: number) => {
    const updatedFiles = [...submissionFiles];
    updatedFiles.splice(index, 1);
    setSubmissionFiles(updatedFiles);
  };


  const submitAssignment = async () => {
    if (!selectedAssignment) return;

    const formData = new FormData();
    formData.append("assignmentId", selectedAssignment.id);
    formData.append("text", submissionText);


    const filePromises = submissionFiles.map(async (file) => {
      try {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        const fileObject = new File([blob], file.name, { type: file.type });

        formData.append("file", fileObject); //Ensure key matches backend
      } catch (error) {
        console.error(" Error converting file to Blob:", error);
      }
    });

    await Promise.all(filePromises); // Ensure all files are processed before sending request

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    try {
      const response = await fetch("http://192.168.142.247:3000/api/assignment/submit", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, //Send token for authentication
        },
      });

      console.log("Raw response from backend:", response);

      const data = await response.json();
      if (response.ok) {
        console.log("Assignment submitted successfully:", data);
      } else {
        console.error("Failed to submit assignment:", data.error);
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
    // Update the assignment status
    const updatedAssignments = assignments.map(assignment =>
      assignment.id === selectedAssignment.id
        ? { ...assignment, status: "submitted" as const }
        : assignment
    );

    setAssignments(updatedAssignments);
    setIsSubmissionModalVisible(false);


    alert("Assignment submitted successfully!");
    Alert.alert("Assignment submitted successfully!");
  };


  const calculateAttendancePercentage = (courseId: string): number => {
    const courseAttendance = attendance.filter(a => a.courseId === courseId);
    if (courseAttendance.length === 0) return 0;

    const presentCount = courseAttendance.filter(a => a.status === "present" || a.status === "excused").length;
    return Math.round((presentCount / courseAttendance.length) * 100);
  };


  const calculateAverageScore = (courseId: string): number => {
    const courseMarks = marks.filter(m => m.courseId === courseId);
    if (courseMarks.length === 0) return 0;

    const totalPercentage = courseMarks.reduce((sum, mark) => sum + (mark.score / mark.maxScore), 0);
    return Math.round((totalPercentage / courseMarks.length) * 100);
  };


  if (auth?.isLoading || isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#5c51f3" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </SafeAreaView>
    );
  }


  
  if (!auth?.user || auth.user.role !== "student" || !userData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#5c51f3" />
        <Text style={{ marginTop: 10 }}>Redirecting...</Text>
      </SafeAreaView>
    );
  }


  const renderCourseModal = () => (
    <Modal
      visible={isCourseModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsCourseModalVisible(false)}
    >
      {selectedCourse && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={[styles.courseModalIcon, { backgroundColor: selectedCourse.color }]}>
                <FontAwesome name={selectedCourse.icon as any} size={24} color="white" />
              </View>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>{selectedCourse.title}</Text>
                <Text style={styles.modalSubtitle}>{selectedCourse.code} • {selectedCourse.professor}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsCourseModalVisible(false)}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.courseTabs}>
              <TouchableOpacity
                style={[styles.courseTab, activeCourseTab === "curriculum" && styles.courseTabActive]}
                onPress={() => setActiveCourseTab("curriculum")}
              >
                <Text style={[styles.courseTabText, activeCourseTab === "curriculum" && styles.courseTabTextActive]}>
                  Curriculum
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.courseTab, activeCourseTab === "attendance" && styles.courseTabActive]}
                onPress={() => setActiveCourseTab("attendance")}
              >
                <Text style={[styles.courseTabText, activeCourseTab === "attendance" && styles.courseTabTextActive]}>
                  Attendance
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.courseTab, activeCourseTab === "marks" && styles.courseTabActive]}
                onPress={() => setActiveCourseTab("marks")}
              >
                <Text style={[styles.courseTabText, activeCourseTab === "marks" && styles.courseTabTextActive]}>
                  Marks
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.courseTab, activeCourseTab === "remarks" && styles.courseTabActive]}
                onPress={() => setActiveCourseTab("remarks")}
              >
                <Text style={[styles.courseTabText, activeCourseTab === "remarks" && styles.courseTabTextActive]}>
                  Remarks
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {activeCourseTab === "curriculum" && (
                <View style={styles.curriculumContainer}>
                  {curriculum
                    .filter(c => c.courseId === selectedCourse.id)
                    .map(c => (
                      <View key={c.id} style={styles.curriculumSection}>
                        <Text style={styles.curriculumTitle}>{c.title}</Text>
                        <Text style={styles.curriculumDescription}>{c.description}</Text>

                        {c.units.map(unit => (
                          <View key={unit.id} style={styles.curriculumUnit}>
                            <Text style={styles.unitTitle}>{unit.title}</Text>

                            <Text style={styles.topicsHeader}>Topics:</Text>
                            {unit.topics.map((topic, index) => (
                              <View key={index} style={styles.topicItem}>
                                <View style={styles.bulletPoint} />
                                <Text style={styles.topicText}>{topic}</Text>
                              </View>
                            ))}

                            <Text style={styles.resourcesHeader}>Resources:</Text>
                            {unit.resources.map((resource, index) => (
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
              )}

              {activeCourseTab === "attendance" && (
                <View style={styles.attendanceContainer}>
                  <View style={styles.attendanceSummary}>
                    <View style={styles.attendanceChart}>
                      <View style={styles.attendancePercentage}>
                        <Text style={styles.attendancePercentageText}>
                          {calculateAttendancePercentage(selectedCourse.id)}%
                        </Text>
                      </View>
                    </View>
                    <View style={styles.attendanceStats}>
                      <View style={styles.attendanceStat}>
                        <View style={[styles.attendanceIndicator, { backgroundColor: "#4CAF50" }]} />
                        <Text style={styles.attendanceStatText}>Present</Text>
                      </View>
                      <View style={styles.attendanceStat}>
                        <View style={[styles.attendanceIndicator, { backgroundColor: "#FFC107" }]} />
                        <Text style={styles.attendanceStatText}>Excused</Text>
                      </View>
                      <View style={styles.attendanceStat}>
                        <View style={[styles.attendanceIndicator, { backgroundColor: "#F44336" }]} />
                        <Text style={styles.attendanceStatText}>Absent</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.attendanceHistoryTitle}>Attendance History</Text>
                  {attendance
                    .filter(a => a.courseId === selectedCourse.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(a => (
                      <View key={a.id} style={styles.attendanceRecord}>
                        <View style={styles.attendanceDate}>
                          <Text style={styles.attendanceDateText}>
                            {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.attendanceStatus,
                            a.status === "present" ? styles.statusPresent :
                              a.status === "excused" ? styles.statusExcused : styles.statusAbsent
                          ]}
                        >
                          <Text style={styles.attendanceStatusText}>
                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              )}

              {activeCourseTab === "marks" && (
                <View style={styles.marksContainer}>
                  <View style={styles.marksSummary}>
                    <View style={styles.marksChart}>
                      <Text style={styles.marksAverage}>{calculateAverageScore(selectedCourse.id)}%</Text>
                      <Text style={styles.marksAverageLabel}>Average Score</Text>
                    </View>
                  </View>

                  <Text style={styles.marksHistoryTitle}>Assessment Marks</Text>
                  {marks
                    .filter(m => m.courseId === selectedCourse.id)
                    .map(m => (
                      <View key={m.id} style={styles.markRecord}>
                        <View style={styles.markHeader}>
                          <Text style={styles.markTitle}>{m.title}</Text>
                          <View style={styles.markType}>
                            <Text style={styles.markTypeText}>{m.type.charAt(0).toUpperCase() + m.type.slice(1)}</Text>
                          </View>
                        </View>
                        <View style={styles.markScoreContainer}>
                          <Text style={styles.markScore}>{m.score}/{m.maxScore}</Text>
                          <Text style={styles.markPercentage}>
                            {Math.round((m.score / m.maxScore) * 100)}%
                          </Text>
                        </View>
                        {m.feedback && (
                          <View style={styles.markFeedback}>
                            <Text style={styles.markFeedbackLabel}>Feedback:</Text>
                            <Text style={styles.markFeedbackText}>{m.feedback}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                </View>
              )}

              {activeCourseTab === "remarks" && (
                <View style={styles.remarksContainer}>
                  {remarks
                    .filter(r => r.courseId === selectedCourse.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(r => (
                      <View
                        key={r.id}
                        style={[
                          styles.remarkItem,
                          r.type === "positive" ? styles.remarkPositive :
                            r.type === "negative" ? styles.remarkNegative : styles.remarkNeutral
                        ]}
                      >
                        <View style={styles.remarkHeader}>
                          <Text style={styles.remarkDate}>
                            {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Text>
                          <View style={styles.remarkTypeIndicator}>
                            <Text style={styles.remarkTypeText}>
                              {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.remarkText}>{r.remark}</Text>
                      </View>
                    ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </Modal>
  );

  // Render assignment submission modal
  const renderSubmissionModal = () => (
    <Modal
      visible={isSubmissionModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsSubmissionModalVisible(false)}
    >
      {selectedAssignment && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>Submit Assignment</Text>
                <Text style={styles.modalSubtitle}>{selectedAssignment.courseCode} • {selectedAssignment.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsSubmissionModalVisible(false)}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.submissionSection}>
                <Text style={styles.submissionLabel}>Assignment Description:</Text>
                <Text style={styles.submissionDescription}>{selectedAssignment.description}</Text>
              </View>

              <View style={styles.submissionSection}>
                <Text style={styles.submissionLabel}>Due Date:</Text>
                <Text style={styles.submissionDueDate}>{selectedAssignment.dueDate}</Text>
              </View>

              <View style={styles.submissionSection}>
                <Text style={styles.submissionLabel}>Your Submission:</Text>
                <TextInput
                  style={styles.submissionTextInput}
                  placeholder="Add comments or notes about your submission..."
                  multiline={true}
                  numberOfLines={4}
                  value={submissionText}
                  onChangeText={setSubmissionText}
                />
              </View>

              <View style={styles.submissionSection}>
                <Text style={styles.submissionLabel}>Attach Files:</Text>
                <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
                  <Feather name="paperclip" size={20} color="white" />
                  <Text style={styles.attachButtonText}>Attach File</Text>
                </TouchableOpacity>

                {submissionFiles.length > 0 && (
                  <View style={styles.attachedFilesContainer}>
                    {submissionFiles.map((file, index) => (
                      <View key={index} style={styles.attachedFile}>
                        <View style={styles.fileInfo}>
                          <MaterialIcons name="insert-drive-file" size={20} color="#5c51f3" />
                          <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                            {file.name}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => removeFile(index)}>
                          <Feather name="x" size={20} color="#F44336" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitAssignment}
                disabled={submissionFiles.length === 0 && submissionText.trim() === ""}
              >
                <Text style={styles.submitButtonText}>Submit Assignment</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
    </Modal>
  );

  // Render home tab content
  const renderHomeTab = () => (
    <>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeTitle}>Hello, {firstName}!</Text>
        <Text style={styles.welcomeSubtitle}>
          Welcome back to your student dashboard
        </Text>

        <View
          style={[
            styles.statsContainer,
            isSmallDevice && { flexDirection: "column", alignItems: "center" },
          ]}
        >
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3.8</Text>
            <Text style={styles.statLabel}>GPA</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>75%</Text>
            <Text style={styles.statLabel}>Semester Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{courses.length}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
        </View>
      </View>

      {/* Academic Analytics Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Academic Analytics</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <AcademicAnalytics />
      </View>

      {/* Courses Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Courses</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Course Items */}
        {courses.map(course => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseItem}
            onPress={() => handleCourseSelect(course)}
          >
            <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
              <FontAwesome name={course.icon as any} size={24} color="white" />
            </View>
            <View style={styles.courseDetails}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.professorContainer}>
                <Ionicons name="person" size={16} color="#777" />
                <Text style={styles.professorName}>{course.professor}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${course.progress}%` }]} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Assignments Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Assignment Items */}
        {assignments.slice(0, 3).map(assignment => (
          <View key={assignment.id} style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <View style={[styles.courseTag, { backgroundColor: assignment.color }]}>
                <Text style={styles.courseTagText}>{assignment.courseCode}</Text>
              </View>
              <Text style={styles.assignmentDueDate}>Due: {assignment.dueDate}</Text>
            </View>
            <Text style={styles.assignmentTitle}>{assignment.title}</Text>
            <Text style={styles.assignmentDescription}>{assignment.description}</Text>
            <View style={styles.assignmentFooter}>
              <View style={[
                styles.statusBadge,
                assignment.status === "submitted" ? styles.statusSubmitted :
                  assignment.status === "graded" ? styles.statusGraded :
                    assignment.status === "late" ? styles.statusLate :
                      styles.statusPending
              ]}>
                <Text style={styles.statusText}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </Text>
              </View>
              {assignment.status !== "submitted" && assignment.status !== "graded" && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAssignmentSelect(assignment)}
                >
                  <Text style={styles.actionButtonText}>Submit Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </>
  );

  // Render courses tab content
  const renderCoursesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Your Courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => handleCourseSelect(item)}
          >
            <View style={[styles.courseCardHeader, { backgroundColor: item.color }]}>
              <FontAwesome name={item.icon as any} size={24} color="white" />
              <Text style={styles.courseCardCode}>{item.code}</Text>
            </View>
            <View style={styles.courseCardBody}>
              <Text style={styles.courseCardTitle}>{item.title}</Text>
              <Text style={styles.courseCardProfessor}>{item.professor}</Text>

              <View style={styles.courseCardStats}>
                <View style={styles.courseCardStat}>
                  <MaterialIcons name="date-range" size={16} color="#5c51f3" />
                  <Text style={styles.courseCardStatText}>
                    {calculateAttendancePercentage(item.id)}% Attendance
                  </Text>
                </View>
                <View style={styles.courseCardStat}>
                  <MaterialIcons name="grade" size={16} color="#5c51f3" />
                  <Text style={styles.courseCardStatText}>
                    {calculateAverageScore(item.id)}% Average
                  </Text>
                </View>
              </View>

              <View style={styles.courseCardProgress}>
                <View style={styles.courseCardProgressBar}>
                  <View
                    style={[
                      styles.courseCardProgressFill,
                      { width: `${item.progress}%`, backgroundColor: item.color }
                    ]}
                  />
                </View>
                <Text style={styles.courseCardProgressText}>{item.progress}% Complete</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.coursesList}
      />
    </View>
  );

  // Render assignments tab content
  const renderAssignmentsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Your Assignments</Text>

      <View style={styles.assignmentFilters}>
        <TouchableOpacity style={[styles.assignmentFilter, styles.assignmentFilterActive]}>
          <Text style={styles.assignmentFilterTextActive}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignmentFilter}>
          <Text style={styles.assignmentFilterText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignmentFilter}>
          <Text style={styles.assignmentFilterText}>Submitted</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignmentFilter}>
          <Text style={styles.assignmentFilterText}>Graded</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.assignmentCard}>
            <View style={styles.assignmentCardHeader}>
              <View style={[styles.assignmentCardTag, { backgroundColor: item.color }]}>
                <Text style={styles.assignmentCardTagText}>{item.courseCode}</Text>
              </View>
              <Text style={styles.assignmentCardDue}>Due: {item.dueDate}</Text>
            </View>

            <Text style={styles.assignmentCardTitle}>{item.title}</Text>
            <Text style={styles.assignmentCardDescription}>{item.description}</Text>

            <View style={styles.assignmentCardFooter}>
              <View style={[
                styles.assignmentCardStatus,
                item.status === "submitted" ? styles.statusSubmitted :
                  item.status === "graded" ? styles.statusGraded :
                    item.status === "late" ? styles.statusLate :
                      styles.statusPending
              ]}>
                <Text style={styles.assignmentCardStatusText}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>

              {item.status !== "submitted" && item.status !== "graded" && (
                <TouchableOpacity
                  style={styles.assignmentCardAction}
                  onPress={() => handleAssignmentSelect(item)}
                >
                  <Text style={styles.assignmentCardActionText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.assignmentsList}
      />
    </View>
  );

  // Render attendance tab content
  const renderAttendanceTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Your Attendance</Text>

      <View style={styles.attendanceOverview}>
        <View style={styles.attendanceOverviewChart}>
          <Text style={styles.attendanceOverviewPercentage}>85%</Text>
          {/* <Text style={styles.attendanceOverviewLabel}>Overall Attendance</Text> */}
        </View>

        <View style={styles.attendanceOverviewLegend}>
          <View style={styles.attendanceLegendItem}>
            <View style={[styles.attendanceLegendColor, { backgroundColor: "#4CAF50" }]} />
            <Text style={styles.attendanceLegendText}>Present</Text>
          </View>
          <View style={styles.attendanceLegendItem}>
            <View style={[styles.attendanceLegendColor, { backgroundColor: "#FFC107" }]} />
            <Text style={styles.attendanceLegendText}>Excused</Text>
          </View>
          <View style={styles.attendanceLegendItem}>
            <View style={[styles.attendanceLegendColor, { backgroundColor: "#F44336" }]} />
            <Text style={styles.attendanceLegendText}>Absent</Text>
          </View>
        </View>
      </View>

      <Text style={styles.attendanceCoursesTitle}>Attendance by Course</Text>

      {courses.map(course => {
        const attendancePercentage = calculateAttendancePercentage(course.id);
        return (
          <TouchableOpacity
            key={course.id}
            style={styles.attendanceCourseItem}
            onPress={() => {
              setSelectedCourse(course);
              setActiveCourseTab("attendance");
              setIsCourseModalVisible(true);
            }}
          >
            <View style={styles.attendanceCourseHeader}>
              <View style={[styles.attendanceCourseIcon, { backgroundColor: course.color }]}>
                <FontAwesome name={course.icon as any} size={20} color="white" />
              </View>
              <Text style={styles.attendanceCourseTitle}>{course.title}</Text>
            </View>

            <View style={styles.attendanceCourseStats}>
              <View style={styles.attendanceCourseProgress}>
                <View style={styles.attendanceCourseProgressBar}>
                  <View
                    style={[
                      styles.attendanceCourseProgressFill,
                      {
                        width: `${attendancePercentage ?? 0}%`,  // Ensure it always has a value
                        backgroundColor: attendancePercentage >= 75
                          ? "#4CAF50"
                          : attendancePercentage >= 60
                            ? "#FFC107"
                            : "#F44336"
                      }
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.attendanceCoursePercentage}>{attendancePercentage}%</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4252e5" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>EduConnect</Text>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setIsProfileMenuVisible(!isProfileMenuVisible)}
          >
            <View style={styles.profilePic}>
              <Ionicons name="person" size={24} color="white" />
            </View>
            <Text style={styles.profileName}>{displayName}</Text>
            <Ionicons
              name={isProfileMenuVisible ? "chevron-up" : "chevron-down"}
              size={16}
              color="white"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          {isProfileMenuVisible && (
            <View style={styles.profileDropdown}>
              <TouchableOpacity
                style={styles.profileMenuItem}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color="#333" />
                <Text style={styles.profileMenuItemText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {activeTab === "home" && renderHomeTab()}
        {activeTab === "courses" && renderCoursesTab()}
        {activeTab === "assignments" && renderAssignmentsTab()}
        {activeTab === "attendance" && renderAttendanceTab()}
      </ScrollView>

      {/* Chatbot Floating Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          bottom: 80, // Positioned above the navigation bar
          backgroundColor: "#5c51f3",
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          zIndex: 2500,
        }}
        onPress={() => router.push("/chatbotScreen")}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>

      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("home")}
        >
          <Ionicons name="home" size={24} color={activeTab === "home" ? "#5c51f3" : "#777"} />
          <Text style={[styles.navText, activeTab === "home" && styles.navActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("courses")}
        >
          <MaterialIcons name="menu-book" size={24} color={activeTab === "courses" ? "#5c51f3" : "#777"} />
          <Text style={[styles.navText, activeTab === "courses" && styles.navActive]}>Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("assignments")}
        >
          <MaterialIcons name="assignment" size={24} color={activeTab === "assignments" ? "#5c51f3" : "#777"} />
          <Text style={[styles.navText, activeTab === "assignments" && styles.navActive]}>Assignments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("attendance")}
        >
          <MaterialIcons name="date-range" size={24} color={activeTab === "attendance" ? "#5c51f3" : "#777"} />
          <Text style={[styles.navText, activeTab === "attendance" && styles.navActive]}>Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      {renderCourseModal()}
      {renderSubmissionModal()}
    </SafeAreaView>
  );
};