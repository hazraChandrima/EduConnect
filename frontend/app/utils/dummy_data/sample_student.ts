// sampleData.ts

export interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    __v: number;
}

export interface Course {
    id: string;
    code: string;
    title: string;
    professor: string;
    progress: number;
    color: string;
    icon: string;
}

export interface Assignment {
    _id: string;
    courseId: string;
    courseCode?: string;
    title: string;
    description: string;
    dueDate: string;
    status?: "pending" | "submitted" | "graded" | "late";
    color?: string;
}

export interface Curriculum {
    id: string;
    courseId: string;
    title: string;
    description: string;
    units: CurriculumUnit[];
}

export interface CurriculumUnit {
    id: string;
    title: string;
    topics: string[];
    resources: string[];
}

export interface Attendance {
    id: string;
    courseId: string;
    date: string;
    status: "present" | "absent" | "excused";
}

export interface Mark {
    id: string;
    courseId: string;
    title: string;
    score: number;
    maxScore: number;
    type: "assignment" | "quiz" | "exam" | "project";
    feedback?: string;
}

export interface ProfessorRemark {
    id: string;
    courseId: string;
    date: string;
    remark: string;
    type: "positive" | "negative" | "neutral";
}

export interface SubmissionFile {
    name: string;
    uri: string;
    type: string;
    size: number;
}

// Sample data
export const sampleCourses: Course[] = [
    {
        id: "1",
        code: "CS 101",
        title: "Computer Science 101",
        professor: "Prof. Smith",
        progress: 75,
        color: "#52c4eb",
        icon: "laptop",
    },
    {
        id: "2",
        code: "MATH 202",
        title: "Mathematics 202",
        professor: "Prof. Johnson",
        progress: 60,
        color: "#ff5694",
        icon: "calculator",
    },
    {
        id: "3",
        code: "PHYS 101",
        title: "Physics 101",
        professor: "Prof. Williams",
        progress: 45,
        color: "#5c51f3",
        icon: "settings",
    },
    {
        id: "4",
        code: "ENG 105",
        title: "English Composition",
        professor: "Prof. Davis",
        progress: 80,
        color: "#ffa726",
        icon: "book",
    },
];


export const sampleCurriculum: Curriculum[] = [
  {
    id: "1",
    courseId: "1",
    title: "Introduction to Computer Science",
    description: "Fundamentals of computer science and programming",
    units: [
      {
        id: "1-1",
        title: "Algorithms and Data Structures",
        topics: ["Introduction to Algorithms", "Time Complexity", "Space Complexity", "Basic Data Structures"],
        resources: ["Textbook Ch. 1-3", "Online Lecture Notes", "Practice Problems"],
      },
      {
        id: "1-2",
        title: "Programming Fundamentals",
        topics: ["Variables and Data Types", "Control Structures", "Functions and Methods", "Object-Oriented Programming"],
        resources: ["Textbook Ch. 4-6", "Coding Exercises", "Programming Lab"],
      },
    ],
  },
  {
    id: "2",
    courseId: "2",
    title: "Advanced Mathematics",
    description: "Calculus and linear algebra concepts",
    units: [
      {
        id: "2-1",
        title: "Differential Calculus",
        topics: ["Limits and Continuity", "Derivatives", "Applications of Derivatives"],
        resources: ["Textbook Ch. 1-2", "Problem Set 1", "Online Calculator Tools"],
      },
      {
        id: "2-2",
        title: "Integral Calculus",
        topics: ["Indefinite Integrals", "Definite Integrals", "Applications of Integration"],
        resources: ["Textbook Ch. 3-4", "Problem Set 2", "Video Tutorials"],
      },
    ],
  },
  {
    id: "3",
    courseId: "3",
    title: "Fundamentals of Physics",
    description: "Basic principles of physics and mechanics",
    units: [
      {
        id: "3-1",
        title: "Mechanics",
        topics: ["Newton's Laws", "Work and Energy", "Momentum", "Rotational Motion"],
        resources: ["Textbook Ch. 1-4", "Lab Manual", "Physics Simulations"],
      },
      {
        id: "3-2",
        title: "Waves and Oscillations",
        topics: ["Simple Harmonic Motion", "Wave Properties", "Sound Waves", "Standing Waves"],
        resources: ["Textbook Ch. 5-7", "Lab Experiments", "Wave Demonstrations"],
      },
    ],
  },
  {
    id: "4",
    courseId: "4",
    title: "English Composition",
    description: "Principles of effective writing and communication",
    units: [
      {
        id: "4-1",
        title: "Essay Writing",
        topics: ["Thesis Development", "Paragraph Structure", "Argumentative Writing", "Research Methods"],
        resources: ["Writing Handbook Ch. 1-3", "Sample Essays", "Writing Workshops"],
      },
      {
        id: "4-2",
        title: "Literary Analysis",
        topics: ["Critical Reading", "Analyzing Themes", "Character Analysis", "Symbolism and Imagery"],
        resources: ["Literary Analysis Guide", "Assigned Novels", "Critical Essays"],
      },
    ],
  },
];


export const sampleAttendance: Attendance[] = [
  { id: "1", courseId: "1", date: "2023-09-05", status: "present" },
  { id: "2", courseId: "1", date: "2023-09-07", status: "present" },
  { id: "3", courseId: "1", date: "2023-09-12", status: "absent" },
  { id: "4", courseId: "1", date: "2023-09-14", status: "present" },
  { id: "5", courseId: "2", date: "2023-09-06", status: "present" },
  { id: "6", courseId: "2", date: "2023-09-08", status: "excused" },
  { id: "7", courseId: "2", date: "2023-09-13", status: "present" },
  { id: "8", courseId: "2", date: "2023-09-15", status: "present" },
  { id: "9", courseId: "3", date: "2023-09-05", status: "present" },
  { id: "10", courseId: "3", date: "2023-09-07", status: "present" },
  { id: "11", courseId: "3", date: "2023-09-12", status: "present" },
  { id: "12", courseId: "3", date: "2023-09-14", status: "absent" },
  { id: "13", courseId: "4", date: "2023-09-06", status: "present" },
  { id: "14", courseId: "4", date: "2023-09-08", status: "present" },
  { id: "15", courseId: "4", date: "2023-09-13", status: "present" },
  { id: "16", courseId: "4", date: "2023-09-15", status: "present" },
];

export const sampleMarks: Mark[] = [
  { id: "1", courseId: "1", title: "Quiz 1", score: 18, maxScore: 20, type: "quiz" },
  { id: "2", courseId: "1", title: "Midterm Exam", score: 85, maxScore: 100, type: "exam" },
  { id: "3", courseId: "1", title: "Programming Assignment 1", score: 92, maxScore: 100, type: "assignment", feedback: "Excellent work on algorithm optimization!" },
  { id: "4", courseId: "2", title: "Problem Set 1", score: 45, maxScore: 50, type: "assignment" },
  { id: "5", courseId: "2", title: "Quiz 1", score: 17, maxScore: 20, type: "quiz" },
  { id: "6", courseId: "2", title: "Midterm Exam", score: 78, maxScore: 100, type: "exam", feedback: "Good understanding of concepts, but work on application problems." },
  { id: "7", courseId: "3", title: "Lab Report 1", score: 28, maxScore: 30, type: "assignment" },
  { id: "8", courseId: "3", title: "Quiz 1", score: 15, maxScore: 20, type: "quiz" },
  { id: "9", courseId: "3", title: "Midterm Exam", score: 82, maxScore: 100, type: "exam" },
  { id: "10", courseId: "4", title: "Essay 1", score: 88, maxScore: 100, type: "assignment", feedback: "Strong thesis and well-structured arguments." },
  { id: "11", courseId: "4", title: "Reading Quiz", score: 9, maxScore: 10, type: "quiz" },
  { id: "12", courseId: "4", title: "Midterm Paper", score: 92, maxScore: 100, type: "exam" },
];

export const sampleRemarks: ProfessorRemark[] = [
  { id: "1", courseId: "1", date: "2023-09-10", remark: "Excellent participation in class discussions.", type: "positive" },
  { id: "2", courseId: "1", date: "2023-09-17", remark: "Please review the material on time complexity before the next quiz.", type: "neutral" },
  { id: "3", courseId: "2", date: "2023-09-12", remark: "Your problem-solving approach shows creativity.", type: "positive" },
  { id: "4", courseId: "2", date: "2023-09-18", remark: "Missing homework assignments. Please submit them as soon as possible.", type: "negative" },
  { id: "5", courseId: "3", date: "2023-09-14", remark: "Great lab work and attention to detail.", type: "positive" },
  { id: "6", courseId: "4", date: "2023-09-16", remark: "Your writing has improved significantly since the beginning of the semester.", type: "positive" },
];