"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../button";
import { ClassTiming, Course } from "@/lib/definition";
import ComboBox from "@/components/ui/combo-box";

function downloadFile(response: Response, filename: string) {
    return response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
}

const days = [
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
];

interface PlannerProps {
    allCourses: Course[];
    courseBasics: {
        id: string;
        title: string;
    }[];
    selectionMap: { [key: string]: boolean };
    updateSelection: (courseId: string) => void;
}

export default function Planner({
    allCourses,
    courseBasics,
    selectionMap,
    updateSelection,
}: PlannerProps) {
    const [open, setOpen] = useState(false);
    const [filteredCourses, setFilteredCourses] = useState(courseBasics);
    const [isExporting, setIsExporting] = useState(false);
    const [day, setDay] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const timings: { [key: string]: ClassTiming } = {};

    async function exportAs(format: "pdf" | "xlsx") {
        setIsExporting(true);
        const response = await fetch(
            format === "pdf"
                ? "/api/dashboard/export-pdf"
                : "/api/dashboard/export-xlsx",
            {
                method: "POST",
                body: JSON.stringify({
                    data: allCourses.filter(
                        (course) => selectionMap[course.courseId]
                    ),
                }),
            }
        );

        if (response.ok) {
            const filename = `offered-course-list.${format}`;
            await downloadFile(response, filename);
        } else {
            console.error("Failed to export file");
        }
        setIsExporting(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <TooltipWrapper tooltipText="Planner">
                    <Zap
                        className="cursor-pointer"
                        onClick={() => setOpen(true)}
                    />
                </TooltipWrapper>
            </DialogTrigger>
            <DialogContent className="max-w-[34rem]">
                <div className="mt-4 space-y-2">
                    <div className="flex gap-2 justify-between">
                        <Button
                            disabled={true}
                            className="w-1/2"
                            onClick={async () => await exportAs("pdf")}
                        >
                            Export as PDF
                        </Button>
                        <Button
                            disabled={isExporting}
                            className="w-1/2"
                            onClick={async () => await exportAs("xlsx")}
                        >
                            Export as XLSX
                        </Button>
                    </div>
                    <div className="z-[9999] w-full">
                        <ComboBox
                            name="Day"
                            value={day}
                            values={days}
                            onChange={(item) => {
                                setDay(item);
                                console.log(item);
                            }}
                            className="w-full"
                        />
                    </div>
                    <div className="flex gap-2 justify-between">
                        <Input placeholder="Start Time" type="time" />
                        <Input placeholder="End Time" type="time" />
                    </div>
                    <Button
                        className="w-full"
                        onClick={() => {
                            if (day) {
                                timings[day] = {
                                    startTime,
                                    endTime,
                                };
                                setStartTime("");
                                setEndTime("");
                            }
                            console.log(timings);
                        }}
                    >
                        ADD
                    </Button>
                    <ScrollArea>
                        <div className="flex flex-wrap gap-1 max-h-[10rem] max-sm:max-h-[8rem]">
                            {courseBasics
                                .filter((course) => selectionMap[course.id])
                                .map((course) => (
                                    <TooltipWrapper
                                        key={course.id}
                                        tooltipText={course.title}
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                updateSelection(course.id)
                                            }
                                        >
                                            {course.id}{" "}
                                            <X className="ml-2 size-4" />
                                        </Button>
                                    </TooltipWrapper>
                                ))}
                        </div>
                    </ScrollArea>
                    <Input
                        type="text"
                        placeholder="Search course..."
                        className="font-medium"
                        onChange={(ev) =>
                            setTimeout(() => {
                                const val = ev.target.value.toLowerCase();
                                setFilteredCourses(
                                    courseBasics.filter(
                                        (course) =>
                                            course.id
                                                .toLowerCase()
                                                .includes(val) ||
                                            course.title
                                                .toLowerCase()
                                                .includes(val)
                                    )
                                );
                            }, 100)
                        }
                    />
                    <ScrollArea className="h-[20rem]">
                        <div className="space-y-2">
                            {filteredCourses.map((course) =>
                                selectionMap[course.id] ? (
                                    <></>
                                ) : (
                                    <div
                                        key={course.id}
                                        onClick={() =>
                                            updateSelection(course.id)
                                        }
                                        className="flex justify-between items-center font-medium cursor-pointer hover:bg-muted p-2 rounded-md border-b"
                                    >
                                        <p className="text-muted-foreground">
                                            {course.title}
                                        </p>
                                        <p>{course.id}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
