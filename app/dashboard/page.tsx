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
    const [searchTerm, setSearchTerm] = useState("");
    const [optionGroups, setOptionGroups] = useState<{ [key: string]: string }>({});
    const [optionStates, setOptionStates] = useState<{ [key: string]: boolean }>({});

    function matchGroups(groups: string[], course: Course) {
        let res = false;
        for (const group of groups) {
            switch (group) {
                case "Catalogue":
                    res = optionStates[course.catalogue];
                    break;
                case "Category":
                    res = optionStates[course.category];
                    break;
                case "Group":
                    res = optionStates[course.group];
                    break;
                case "Type":
                    res = optionStates[course.type];
                    break;
            }
            if (!res) return false;
        }
        return true;
    }

    function handleSearch(ev: ChangeEvent<HTMLInputElement>) {
        const term = ev.target.value.toLowerCase().trim();
        setSearchTerm(term);
        setTimeout(() => {
            if (Object.values(optionStates).some(state => state)) {
                const selectedGroups = Object
                    .entries(optionStates)
                    .filter(([_, state]) => state)
                    .map(([opt, _]) => optionGroups[opt]);

                setFilteredCourses(allCourses.filter(course =>
                    matchGroups(selectedGroups, course)
                    && (course.courseId.toLowerCase().includes(term)
                        || course.courseTitle.toLowerCase().includes(term)
                        || course.faculty.toLowerCase().includes(term))
                ));
            } else {
                setFilteredCourses(allCourses.filter(course =>
                    course.courseId.toLowerCase().includes(term)
                    || course.courseTitle.toLowerCase().includes(term)
                    || course.faculty.toLowerCase().includes(term)
                ));
            }
        }, 100);
    }

    function handleOptionStateUpdate(option: string, state: boolean) {
        let newOptionStates: { [key: string]: boolean } = {};
        let newFilteredCourses: Course[] = [];
        if (option === "Clear") {
            Object.keys(optionStates).forEach(key => newOptionStates[key] = false);
        } else {
            newOptionStates = { ...optionStates, [option]: state };
        }

        if (Object.values(newOptionStates).every(st => !st)) {
            newFilteredCourses = [...allCourses];
        } else {
            switch (optionGroups[option] || "") {
                case "Catalogue":
                    if (state) {
                        newFilteredCourses = filteredCourses.filter(course => course.catalogue === option);
                    } else {
                        newFilteredCourses = allCourses.filter(course =>
                            optionStates[course.category]
                            || optionStates[course.group]
                            || optionStates[course.type]
                        );
                    }
                    break;
                case "Category":
                    if (state) {
                        newFilteredCourses = filteredCourses.filter(course => course.category === option);
                    } else {
                        newFilteredCourses = allCourses.filter(course =>
                            optionStates[course.catalogue]
                            || optionStates[course.group]
                            || optionStates[course.type]
                        );
                    }
                    break;
                case "Group":
                    if (state) {
                        newFilteredCourses = filteredCourses.filter(course => course.group === option);
                    } else {
                        newFilteredCourses = allCourses.filter(course =>
                            optionStates[course.catalogue]
                            || optionStates[course.category]
                            || optionStates[course.type]
                        );
                    }
                    break;
                case "Type":
                    if (state) {
                        newFilteredCourses = filteredCourses.filter(course => course.type === option);
                    } else {
                        newFilteredCourses = allCourses.filter(course =>
                            optionStates[course.catalogue]
                            || optionStates[course.category]
                            || optionStates[course.group]
                        );
                    }
                    break;
                default:
                    break;
            }
        }

        setSearchTerm("");
        setOptionStates(newOptionStates);
        setFilteredCourses(newFilteredCourses);
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
            const newOptionGroups: { [key: string]: string } = {};
            const newOptionStates: { [key: string]: boolean } = {};
            courses.forEach(course => {
                newOptionStates[course.catalogue] = false;
                newOptionStates[course.category] = false;
                newOptionStates[course.group] = false;
                newOptionStates[course.type] = false;

                newOptionGroups[course.catalogue] = "Catalogue";
                newOptionGroups[course.category] = "Category";
                newOptionGroups[course.group] = "Group";
                newOptionGroups[course.type] = "Type";
            });
            setOptionStates(newOptionStates);
            setOptionGroups(newOptionGroups);
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
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <FilterMenu
                        courses={filteredCourses}
                        optionStates={optionStates}
                        updateOptionState={handleOptionStateUpdate}
                    />
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
