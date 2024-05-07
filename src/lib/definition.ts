export interface AuthData {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    data?: { [key: string]: string; }[];
}

export const STORED_AUTH_DATA_KEY = "userAuth";

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

export interface PreRequisiteCourse {
    courseId: string;
    courseName: string;
    grade?: string;
    gradePoint: number;
    groupId: number;
    preReqCourseId: string;
}

export interface PreRequisiteMap {
    [key: string]: {
        preRequisites: {
            courseId: string;
            status: "complete" | "incomplete";
        }[]
    }
}

export interface CatalogueCourse {
    catalogId: string;
    catalogName: string;
    courseId: string;
    courseName: string;
    createHour: string;
    courseGroupName: string;
    courseNatureName: string;
    courseTypeId: string;
}

export interface RequirementCatalogue {
    studentId: string;
    admissionCode: string;
    programId: string;
    countS: string;
    concentrationId: string;
    creditEarned: string;
    creditForGPA: string;
    creditAttemted: string;
    cgpa: string;
    courseGroupName: string;
    courseCatGroupName: string;
    courseGroupId: string;
    courseTypeName: string;
    courseTypeId: string;
    courseCatId: string;
    doneCredit: string;
    maxRequirment: string;
    minRequirment: string;
    approvedFinAid: string;
    approvedFemaleAid: string;
    advisorName: string;
}