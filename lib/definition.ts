import { z } from "zod";

export const LoginFormSchema = z.object({
    email: z
        .string()
        .length(7, {
            message: "Student ID must be 7 digits.",
        })
        .default(""),
    password: z
        .string()
        .min(1, {
            message: "Password cannot be empty.",
        })
        .default(""),
});

export type LoginFormState =
    | {
          errors?: {
              email?: string[];
              password?: string[];
          };
          message?: string;
          authResponse?: {
              studentId?: string;
              authToken?: string;
              expiry?: string;
          };
      }
    | undefined;

export interface AuthData {
    email: string;
    password: string;
}

export interface AuthResponse {
    data?: { [key: string]: string }[];
    message: string;
}

export const STORED_AUTH_DATA_KEY = "userAuth";

export interface StoredAuthData {
    studentId: string;
    authToken: string;
    expiry: string;
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

export const SemesterOrder = [3, 1, 2];

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

export interface PrerequisiteCourse {
    courseId: string;
    courseName: string;
    grade?: string;
    gradePoint: number;
    groupId: number;
    preReqCourseId: string;
}

export interface PrerequisiteMap {
    [key: string]: {
        preRequisites: {
            courseId: string;
            status: boolean;
        }[];
    };
}

export interface CourseCatalogue {
    catalogId: string;
    catalogName: string;
    courseId: string;
    courseName: string;
    createHour: string;
    courseGroupName: string;
    courseNatureName: string;
    courseTypeId: string;
}

export interface CourseCataloguePrimitive {
    catalogId: string;
    catalogName: string;
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

export interface RequirementCatalogueMap {
    [key: string]: {
        minRequirement: number;
        maxRequirement: number;
        doneCredit: number;
    };
}

export const CatalogueGroupMap: { [key: string]: string } = {
    foundation: "Foundation Courses",
    internship: "Internship/Sr, Project/Study Abroad",
    major: "Major/Concentration/Departmental Requirement",
    core: "Core Courses",
    minor: "Minor",
};

export interface Course {
    courseId: string;
    courseTitle: string;
    section: number;
    faculty: string;
    timeSlot: string;
    vacancy: string;
    enrolled: number;
    prerequisites: { courseId: string; status: boolean }[];
    grade: string;
    creditHour: number;
    catalogue: string;
    group: string;
    category: string;
    type: string;
}
