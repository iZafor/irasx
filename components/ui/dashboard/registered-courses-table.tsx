"use client";

import { FormattedRegisteredCourses, RegisteredCourse } from "@/lib/definition";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import ComboBox from "@/components/ui/combo-box";
import { cn, mapSemester } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../scroll-area";

export default function RegisteredCoursesTable({
    registeredCourses,
}: {
    registeredCourses: FormattedRegisteredCourses;
}) {
    const defaultYear = registeredCourses.keys.at(-1);
    const defaultSemester = (
        registeredCourses[defaultYear as keyof FormattedRegisteredCourses]
            .keys as number[]
    ).at(-1);

    const yearComboBoxData = registeredCourses.keys.map((year) => ({
        value: year,
        label: `${year}`,
    }));
    const semesterComboBoxdata = Array.from({ length: 3 }).map((_, idx) => ({
        value: idx + 1,
        label: mapSemester(`${idx + 1}`),
    }));

    const [year, setYear] = useState(defaultYear);
    const [semester, setSemester] = useState(defaultSemester);

    return (
        <div className="space-y-4 w-full">
            <div className="flex gap-4">
                <ComboBox
                    values={yearComboBoxData}
                    value={year!}
                    onChange={(value) => setYear(value as number)}
                    name="year"
                />
                <ComboBox
                    values={semesterComboBoxdata}
                    value={semester!}
                    onChange={(value) => setSemester(value as number)}
                    name="semester"
                />
            </div>
            <ScrollArea className="w-full">
                <Table className="min-w-[1000px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course ID</TableHead>
                            <TableHead>Course Title</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Time Slot</TableHead>
                            <TableHead>Attendance</TableHead>
                            <TableHead>Grade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(
                            registeredCourses[
                                year as keyof FormattedRegisteredCourses
                            ][semester as number] as RegisteredCourse[]
                        )?.map((course) => (
                            <TableRow key={course.courseId}>
                                <TableCell className="w-[6rem]">
                                    {course.courseId}
                                </TableCell>
                                <TableCell className="w-[18rem]">
                                    {course.courseName}
                                </TableCell>
                                <TableCell className="w-[4rem]">
                                    {course.section}
                                </TableCell>
                                <TableCell className="w-[6rem]">
                                    {course.roomId}
                                </TableCell>
                                <TableCell className="w-[10rem]">
                                    {course.classTime}
                                </TableCell>
                                <TableCell className="w-[4rem]">
                                    <p
                                        className={cn(
                                            "size-fit px-2 rounded",
                                            {
                                                "bg-yellow-400 text-slate-900 font-semibold":
                                                    course.wState === 1,
                                            },
                                            {
                                                "bg-red-400 text-slate-900 font-semibold":
                                                    course.wState === 2,
                                            }
                                        )}
                                    >
                                        {`${course?.attend || 0}/${
                                            course.classCount
                                        }`}
                                    </p>
                                </TableCell>
                                <TableCell className="w-[2rem]">
                                    <p
                                        className={cn("size-fit px-2 rounded", {
                                            "bg-yellow-400 text-slate-900 font-semibold":
                                                course.grade === "Z",
                                        })}
                                    >
                                        {course.grade}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
