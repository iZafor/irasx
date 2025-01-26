import {
    getOfferedCourses,
    getCourseCatalogue,
    getPrerequisiteCourses,
    getRequirementCatalogues,
} from "@/lib/apis";
import { CourseCataloguePrimitive } from "@/lib/definition";
import { transformIntoPrerequisiteMap, generateCourseArray } from "@/lib/utils";
import CourseList from "./course-list";

export default async function OfferedCourses() {
    const [
        offeredCourses,
        foundationCatalogue,
        majorCatalogue,
        minorCatalogue,
        prerequisiteCourses,
        requirementCatalogues,
    ] = await Promise.all([
        getOfferedCourses(),
        getCourseCatalogue("Foundation"),
        getCourseCatalogue("Major"),
        getCourseCatalogue("Minor"),
        getPrerequisiteCourses(),
        getRequirementCatalogues(),
    ]);
    const prerequisiteMap = transformIntoPrerequisiteMap(
        prerequisiteCourses,
        offeredCourses
    );
    const catalogues: CourseCataloguePrimitive[] = [
        {
            catalogId: foundationCatalogue[0]?.catalogId,
            catalogName: "Foundation",
        },
        {
            catalogId: majorCatalogue[0]?.catalogId,
            catalogName: "Major",
        },
        {
            catalogId: minorCatalogue[0]?.catalogId,
            catalogName: "Minor",
        },
    ];
    const courses = generateCourseArray(
        offeredCourses,
        requirementCatalogues,
        prerequisiteMap,
        catalogues
    );

    return <CourseList allCourses={courses} />;
}
