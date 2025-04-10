export interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    program?: string;
    year?: number;
    joinDate?: string;
}

export interface Course {
    enrolledStudents: any;
    _id: string;
    title: string;
    code: string;
    department: string;
    professor: {
        _id: string;
        name: string;
    };
    students: UserData[];
    credits: number;
    color?: string;
    icon?: string;
}