"use client";

import { Course } from "@/lib/definition";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterMenu from "@/components/ui/dashboard/filter-menu";
import Export from "@/components/ui/dashboard/export";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { columns } from "@/components/ui/dashboard/columns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

export default function CourseList({ allCourses }: { allCourses: Course[] }) {
    const newOptionGroups: { [key: string]: string } = {};
    const newOptionStates: { [key: string]: boolean } = {};
    const newCourseBasics: { id: string; title: string }[] = [];
    const newSelectionMap: { [key: string]: boolean } = {};

    for (const course of allCourses) {
        newOptionStates[course.catalogue] = false;
        newOptionStates[course.category] = false;
        newOptionStates[course.group] = false;
        newOptionStates[course.type] = false;

        newOptionGroups[course.catalogue] = "Catalogue";
        newOptionGroups[course.category] = "Category";
        newOptionGroups[course.group] = "Group";
        newOptionGroups[course.type] = "Type";

        if (newSelectionMap[course.courseId] == undefined) {
            newCourseBasics.push({
                id: course.courseId,
                title: course.courseTitle,
            });
        }
        newSelectionMap[course.courseId] = false;
    }

    const [filteredCourses, setFilteredCourses] = useState(allCourses);
    const [searchTerm, setSearchTerm] = useState("");
    const [optionGroups] = useState(newOptionGroups);
    const [optionStates, setOptionStates] = useState(newOptionStates);
    const [courseBasics] = useState(newCourseBasics);
    const [selectionMap, setSelectionMap] = useState(newSelectionMap);

    const table = useReactTable({
        data: filteredCourses,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    function handleSearch(term: string) {
        setSearchTerm(term);

        term = term.trim().toLowerCase();
        setTimeout(() => {
            const selectedGroups = Object.entries(optionStates)
                .filter(([_, state]) => state)
                .map(([opt, _]) => optionGroups[opt]);

            // check whether if any groups are selected
            if (selectedGroups.length !== 0) {
                setFilteredCourses(
                    allCourses.filter(
                        (course) =>
                            // first match groups
                            selectedGroups.every(
                                (group) =>
                                    optionStates[
                                        course[
                                            group.toLowerCase() as keyof Course
                                        ] as string
                                    ]
                            ) &&
                            // then match with the search term
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

            if (Object.values(newOptionStates).every((st) => !st)) {
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>OFFERED COURSES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="w-full flex gap-4 items-center justify-between">
                    <div className="h-10 border rounded flex items-center focus-within:ring-1 focus-within:ring-ring px-4">
                        <Search />
                        <Input
                            type="text"
                            placeholder="Search here..."
                            className="text-base border-none focus-visible:ring-0"
                            autoComplete="off"
                            value={searchTerm}
                            onChange={(ev) => handleSearch(ev.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 max-sm:gap-2">
                        <Export
                            allCourses={allCourses}
                            courseBasics={courseBasics}
                            selectionMap={selectionMap}
                            updateSelection={(id) =>
                                setSelectionMap((prev) => ({
                                    ...prev,
                                    [id]: !prev[id],
                                }))
                            }
                        />
                        <FilterMenu
                            courses={filteredCourses}
                            optionStates={optionStates}
                            updateOptionState={handleOptionStateUpdate}
                        />
                    </div>
                </div>
                <ScrollArea
                    className={cn("h-[40rem]", {
                        "h-[10rem]": filteredCourses.length === 0,
                    })}
                >
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
