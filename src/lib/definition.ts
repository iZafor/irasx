export interface AuthData {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    data?: { [key: string]: string; }[];
}

export interface StoredAuthData {
    id: string;
    data: AuthResponse;
}

export interface SemesterResult {
    courseId: string;
    courseName: string;
    section: number;
    regYear: string;
    regSemester: string;
    grade: string;
    classCount: number;
    attend: number;
    wExpCount: number;
    roomId: string;
    classTime: string;
}

export interface Result {
    [key: number]: {
        [key: number]: SemesterResult[];
        keys: number[];
    };
    keys: number[];
}

export const SemesterOrder = [3, 1, 2]

export interface GradesResponse {
    data: SemesterResult[];
    total: number;
}

export interface OfferedCourse {
    capacity: number;
    catalogId: string;
    catalogTypeId: string;
    coOfferCourseId: string;
    concentrationId: string;
    courseCategoryId: string;
    courseCode: string;
    courseGroupId: string;
    courseId: string;
    courseName: string;
    creditHour: number;
    enrolled: number;
    facualtyName: string;
    gp: number;
    grade: string;
    isMandatoryFail: number;
    monTimeString: string;
    programId: number;
    regSemester: string;
    regYear: string;
    roomCapacity: number;
    section: number;
    seqNo: string;
    status: number;
    timeSlot: string;
    timeString: string;
    vacancy: number;
    wedTimeString: string;
}