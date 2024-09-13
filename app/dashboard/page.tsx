"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GalleryVertical, LoaderCircle, Search, Table } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterMenu from "@/components/ui/dashboard/filter-menu";
import {
    Course,
    CourseCataloguePrimitive,
} from "@/lib/definition";
import { useEffect, useState } from "react";
import {
    cn,
    generateCourseArray,
    transformIntoPrerequisiteMap,
} from "@/lib/utils";
import {
    getCourseCatalogue,
    getOfferedCourses,
    getPrerequisiteCourses,
    getRequirementCatalogues,
} from "@/lib/apis";
import CardViewCourseList from "@/components/ui/dashboard/card-view-course-list";
import TableViewCourseList from "@/components/ui/dashboard/table-view-course-list";

const allCourses: Course[] = [];

export default function Dashboard() {
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [optionGroups, setOptionGroups] = useState<{ [key: string]: string }>(
        {}
    );
    const [optionStates, setOptionStates] = useState<{
        [key: string]: boolean;
    }>({});
    const [view, setView] = useState<"table" | "card">("table");

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

    function handleSearch(term: string) {
        setSearchTerm(term);

        term = term.trim().toLowerCase();
        setTimeout(() => {
            if (Object.values(optionStates).some((state) => state)) {
                const selectedGroups = Object.entries(optionStates)
                    .filter(([_, state]) => state)
                    .map(([opt, _]) => optionGroups[opt]);

                setFilteredCourses(
                    allCourses.filter(
                        (course) =>
                            matchGroups(selectedGroups, course) &&
                            (course.courseId.toLowerCase().includes(term) ||
                                course.courseTitle
                                    .toLowerCase()
                                    .includes(term) ||
                                course.faculty.toLowerCase().includes(term))
                    )
                );
            } else {
                setFilteredCourses(
                    allCourses.filter(
                        (course) =>
                            course.courseId.toLowerCase().includes(term) ||
                            course.courseTitle.toLowerCase().includes(term) ||
                            course.faculty.toLowerCase().includes(term)
                    )
                );
            }
        }, 100);
    }

    function handleOptionStateUpdate(option: string, state: boolean) {
        let newOptionStates: { [key: string]: boolean } = {};
        let newFilteredCourses: Course[] = [];

        if (option === "Clear") {
            Object.keys(optionStates).forEach(
                (key) => (newOptionStates[key] = false)
            );

            if (searchTerm.length == 0) {
                newFilteredCourses = [...allCourses];
            } else {
                const term = searchTerm.trim().toLocaleLowerCase();
                newFilteredCourses = allCourses.filter(
                    (course) =>
                        course.courseId.toLowerCase().includes(term) ||
                        course.courseTitle.toLowerCase().includes(term) ||
                        course.faculty.toLowerCase().includes(term)
                );
            }
        } else {
            newOptionStates = { ...optionStates, [option]: state };

            if (Object.values(newOptionStates).every(st => !st)) {
                newFilteredCourses = [...allCourses];
            } else {
                switch (optionGroups[option] || "") {
                    case "Catalogue":
                        if (state) {
                            newFilteredCourses = filteredCourses.filter(
                                (course) => course.catalogue === option
                            );
                        } else {
                            newFilteredCourses = allCourses.filter(
                                (course) =>
                                    optionStates[course.category] ||
                                    optionStates[course.group] ||
                                    optionStates[course.type]
                            );
                        }
                        break;
                    case "Category":
                        if (state) {
                            newFilteredCourses = filteredCourses.filter(
                                (course) => course.category === option
                            );
                        } else {
                            newFilteredCourses = allCourses.filter(
                                (course) =>
                                    optionStates[course.catalogue] ||
                                    optionStates[course.group] ||
                                    optionStates[course.type]
                            );
                        }
                        break;
                    case "Group":
                        if (state) {
                            newFilteredCourses = filteredCourses.filter(
                                (course) => course.group === option
                            );
                        } else {
                            newFilteredCourses = allCourses.filter(
                                (course) =>
                                    optionStates[course.catalogue] ||
                                    optionStates[course.category] ||
                                    optionStates[course.type]
                            );
                        }
                        break;
                    case "Type":
                        if (state) {
                            newFilteredCourses = filteredCourses.filter(
                                (course) => course.type === option
                            );
                        } else {
                            newFilteredCourses = allCourses.filter(
                                (course) =>
                                    optionStates[course.catalogue] ||
                                    optionStates[course.category] ||
                                    optionStates[course.group]
                            );
                        }
                        break;
                    default:
                        break;
                }
            }

        }

        setOptionStates(newOptionStates);
        setFilteredCourses(newFilteredCourses);
    }

    useEffect(() => {
        async function fetchData() {
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
                    catalogId: foundationCatalogue[0].catalogId,
                    catalogName: "Foundation",
                },
                {
                    catalogId: majorCatalogue[0].catalogId,
                    catalogName: "Major",
                },
                {
                    catalogId: minorCatalogue[0].catalogId,
                    catalogName: "Minor",
                },
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
            courses.forEach((course) => {
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
    }, []);

    return (
        <div className="w-full h-[calc(100vh-4rem)] flex justify-center">
            <div
                className={cn(
                    "flex flex-col gap-4 w-[45rem] max-md:w-[40rem] max-sm:w-[94%]",
                    { "md:w-[84%]": view === "table" }
                )}
            >
                <div className="w-full flex gap-4 items-center justify-between">
                    <div className="h-10 border rounded flex items-center focus-within:ring-1 focus-within:ring-ring px-4">
                        <Search />
                        <Input
                            disabled={isLoading}
                            type="text"
                            placeholder="Search here..."
                            className="text-base border-none focus-visible:ring-0"
                            autoComplete="off"
                            value={searchTerm}
                            onChange={(ev) => handleSearch(ev.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 max-sm:gap-2">
                        {view === "card" ? (
                            <Table
                                className="cursor-pointer"
                                onClick={() => {
                                    setView("table");
                                }}
                            />
                        ) : (
                            <GalleryVertical
                                className="cursor-pointer"
                                onClick={() => setView("card")}
                            />
                        )}
                        <FilterMenu
                            courses={filteredCourses}
                            optionStates={optionStates}
                            updateOptionState={handleOptionStateUpdate}
                        />
                    </div>
                </div>
                {isLoading ? (
                    <LoaderCircle className="absolute inset-0 m-auto animate-spin" />
                ) : (
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        {view === "card" ? (
                            <CardViewCourseList courses={filteredCourses} />
                        ) : (
                            <TableViewCourseList courses={filteredCourses} />
                        )}
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}
