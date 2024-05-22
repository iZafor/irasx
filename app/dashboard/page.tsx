"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterMenu from "@/components/ui/dashboard/filter-menu";
import { Course, CourseCataloguePrimitive, STORED_AUTH_DATA_KEY } from "@/lib/definition";
import { ChangeEvent, useEffect, useState } from "react";
import {
    generateCourseArray,
    getStoredAuthData,
    transformIntoPrerequisiteMap,
    validateStoredAuthData
} from "@/lib/utils";
import { redirect } from "next/navigation";
import {
    getCourseCatalogue,
    getOfferedCourses,
    getPrerequisiteCourses,
    getRequirementCatalogues
} from "@/lib/apis";
import CourseCardSkeleton from "@/components/ui/dashboard/course-card-skeleton";
import CourseList from "@/components/ui/dashboard/course-list";

const allCourses: Course[] = [];

export default function Dashboard() {
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    function handleSearch(ev: ChangeEvent<HTMLInputElement>) {
        const term = ev.target.value.toLowerCase().trim();
        setTimeout(() => {
            setFilteredCourses(allCourses.filter(course =>
                course.courseId.toLowerCase().includes(term) ||
                course.courseTitle.toLowerCase().includes(term) ||
                course.faculty.toLowerCase().includes(term)
            ));
        }, 100);
    }

    useEffect(() => {
        const authData = getStoredAuthData();
        if (!validateStoredAuthData(authData)) {
            redirect("/");
        }

        const logoutUser = setTimeout(() => {
            localStorage.removeItem(STORED_AUTH_DATA_KEY);
            redirect("/");
        }, Date.parse(authData.expiry) - Date.now());

        async function fetchData() {
            const { studentId, authToken } = authData;
            const [
                offeredCourses,
                foundationCatalogue,
                majorCatalogue,
                minorCatalogue,
                prerequisiteCourses,
                requirementCatalogues
            ] = await Promise.all([
                getOfferedCourses(studentId, authToken),
                getCourseCatalogue(studentId, authToken, "Foundation"),
                getCourseCatalogue(studentId, authToken, "Major"),
                getCourseCatalogue(studentId, authToken, "Minor"),
                getPrerequisiteCourses(studentId, authToken),
                getRequirementCatalogues(studentId, authToken)
            ]);
            const prerequisiteMap = transformIntoPrerequisiteMap(prerequisiteCourses, offeredCourses);
            const catalogues: CourseCataloguePrimitive[] = [
                { catalogId: foundationCatalogue[0].catalogId, catalogName: "Foundation" },
                { catalogId: majorCatalogue[0].catalogId, catalogName: "Major" },
                { catalogId: minorCatalogue[0].catalogId, catalogName: "Minor" },
            ];
            const courses = generateCourseArray(
                offeredCourses,
                requirementCatalogues,
                prerequisiteMap,
                catalogues
            );
            allCourses.length = 0;
            allCourses.push(...courses);
            setFilteredCourses(courses);
            setIsLoading(false);
        }

        fetchData();

        return () => {
            clearTimeout(logoutUser);
        };
    }, []);

    return (
        <div className="p-4 w-full h-[calc(100vh-4rem)] grid place-items-center">
            <div className="border rounded p-4 flex flex-col gap-4 w-[45rem] max-md:w-[40rem] max-sm:w-[98%]">
                <div className="w-full flex gap-4 items-center justify-between">
                    <div className="h-10 border rounded flex items-center focus-within:ring-1 focus-within:ring-ring px-4">
                        <Search />
                        <Input
                            type="text"
                            placeholder="Search here..."
                            className="text-base border-none focus-visible:ring-0"
                            autoComplete="off"
                            onChange={handleSearch}
                        />
                    </div>
                    <FilterMenu />
                </div>
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    {isLoading ? (
                        <div className="flex flex-col gap-4">
                            <CourseCardSkeleton />
                            <CourseCardSkeleton />
                        </div>
                    ) : (
                        <CourseList courses={filteredCourses} />
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
