"use client";

import { TooltipWrapper } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownToLine, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../button";
import { Course } from "@/lib/definition";
import { Sheet, SheetContent, SheetTrigger } from "../sheet";
import ComboBox from "../combo-box";
import { cn } from "@/lib/utils";

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
    { value: "S", label: "Sunday" },
    { value: "M", label: "Monday" },
    { value: "T", label: "Tuesday" },
    { value: "W", label: "Wednesday" },
    { value: "R", label: "Thursday" },
    { value: "F", label: "Friday" },
    { value: "A", label: "Saturday" },
];

interface ExportProps {
    allCourses: Course[];
    selectionMap: { [key: string]: boolean };
    updateSelection: (courseId: string) => void;
}

export default function Export({
    allCourses,
    selectionMap,
    updateSelection,
}: ExportProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [filteredCourses, setFilteredCourses] = useState<{ id: string; title: string }[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [timeRanges, setTimeRanges] = useState<{
        [key: string]: { start: string; end: string };
    }>({});

    useEffect(() => {
        const allFilteredCourses = allCourses.filter((course) => {
            if (searchValue) {
                const searchLower = searchValue.toLowerCase();
                const courseId = course.courseId.toLowerCase();
                const courseTitle = course.courseTitle.toLowerCase();

                if (!courseId.includes(searchLower) && !courseTitle.includes(searchLower)) {
                    return false;
                }
            }

            if (selectedDays.length === 0) {
                return true;
            }

            let timingMatched = true;
            if (selectedDays.some((day) => course.timeSlot.days.includes(day))) {
                for (const day of selectedDays) {
                    if (!course.timeSlot.days.includes(day)) {
                        continue;
                    }

                    const start = timeRanges[day]?.start;
                    const end = timeRanges[day]?.end;

                    if (start && end) {
                        const [startHour, startMinute] = start.split(":").map(Number);
                        const [endHour, endMinute] = end.split(":").map(Number);

                        timingMatched =
                            course.timeSlot.hours[0] >= startHour &&
                            (course.timeSlot.hours[0] > startHour || course.timeSlot.minutes[0] >= startMinute) &&
                            course.timeSlot.hours[1] <= endHour &&
                            (course.timeSlot.hours[1] < endHour || course.timeSlot.minutes[1] <= endMinute);
                    } else if (start) {
                        const [startHour, startMinute] = start.split(":").map(Number);

                        timingMatched =
                            course.timeSlot.hours[0] >= startHour &&
                            (course.timeSlot.hours[0] > startHour || course.timeSlot.minutes[0] >= startMinute);
                    } else if (end) {
                        const [endHour, endMinute] = end.split(":").map(Number);

                        timingMatched =
                            course.timeSlot.hours[1] <= endHour &&
                            (course.timeSlot.hours[1] < endHour || course.timeSlot.minutes[1] <= endMinute);
                    } else {
                        timingMatched = true;
                    }
                }
            } else {
                timingMatched = false;
            }

            return timingMatched;
        });

        const addStatus: { [key: string]: boolean } = {};
        const newFilteredCourses: { id: string; title: string }[] = [];
        for (const course of allFilteredCourses) {
            if (!addStatus[course.courseId]) {
                addStatus[course.courseId] = true;
                newFilteredCourses.push({ id: course.courseId, title: course.courseTitle });
            } 
        }
        setFilteredCourses(newFilteredCourses);
    }, [allCourses, searchValue, selectedDays, timeRanges]);

    async function exportAs(format: "pdf" | "xlsx") {
        setIsExporting(true);
        const response = await fetch(
            format === "pdf"
                ? "/api/dashboard/export-pdf"
                : "/api/dashboard/export-xlsx",
            {
                method: "POST",
                body: JSON.stringify({
                    data: allCourses.filter((course) => {
                        if (!selectionMap[course.courseId]) {
                            return false;
                        }

                        if (selectedDays.length === 0) {
                            return true;
                        }

                        let timingMatched = true;
                        if (selectedDays.some((day) => course.timeSlot.days.includes(day))) {
                            for (const day of selectedDays) {
                                if (!course.timeSlot.days.includes(day)) {
                                    continue;
                                }

                                const start = timeRanges[day]?.start;
                                const end = timeRanges[day]?.end;

                                if (start && end) {
                                    const [startHour, startMinute] = start.split(":").map(Number);
                                    const [endHour, endMinute] = end.split(":").map(Number);

                                    timingMatched =
                                        course.timeSlot.hours[0] >= startHour &&
                                        (course.timeSlot.hours[0] > startHour || course.timeSlot.minutes[0] >= startMinute) &&
                                        course.timeSlot.hours[1] <= endHour &&
                                        (course.timeSlot.hours[1] < endHour || course.timeSlot.minutes[1] <= endMinute);
                                } else if (start) {
                                    const [startHour, startMinute] = start.split(":").map(Number);

                                    timingMatched =
                                        course.timeSlot.hours[0] >= startHour &&
                                        (course.timeSlot.hours[0] > startHour || course.timeSlot.minutes[0] >= startMinute);
                                } else if (end) {
                                    const [endHour, endMinute] = end.split(":").map(Number);

                                    timingMatched =
                                        course.timeSlot.hours[1] <= endHour &&
                                        (course.timeSlot.hours[1] < endHour || course.timeSlot.minutes[1] <= endMinute);
                                } else {
                                    timingMatched = true;
                                }
                            }
                        } else {
                            timingMatched = false;
                        }

                        return timingMatched;
                    }),
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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <TooltipWrapper tooltipText="Export">
                    <ArrowDownToLine
                        className="cursor-pointer"
                        onClick={() => setOpen(true)}
                    />
                </TooltipWrapper>
            </SheetTrigger>
            <SheetContent>
                <ScrollArea className="w-full h-[100dvh]">
                    <div className="space-y-2 mt-8 px-1">
                        <ComboBox
                            values={days}
                            selectedValues={selectedDays}
                            onChange={(day) =>
                                setSelectedDays((prev) =>
                                    prev.includes(day)
                                        ? prev.filter((d) => d !== day)
                                        : [...prev, day]
                                )
                            }
                            name="Days"
                            className="pointer-events-auto"
                            isSelected={(value) => selectedDays.includes(value)}
                        />

                        {selectedDays.length > 0 && (
                            <ScrollArea>
                                <div className="space-y-3 max-h-[13rem]">
                                    {selectedDays.map((day) => (
                                        <div
                                            key={day}
                                            className="text-sm flex flex-col gap-2 p-3 rounded-md bg-muted/50"
                                        >
                                            <p className="font-medium">
                                                {
                                                    days.find(
                                                        (d) => d.value === day
                                                    )?.label
                                                }
                                            </p>
                                            <div className="flex items-center gap-2 max-sm:flex-col">
                                                <Input
                                                    type="time"
                                                    className="flex-1"
                                                    value={
                                                        timeRanges[day]
                                                            ?.start || ""
                                                    }
                                                    onChange={(e) =>
                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            [day]: {
                                                                ...prev[day],
                                                                start: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    to
                                                </span>
                                                <Input
                                                    type="time"
                                                    className="flex-1"
                                                    value={
                                                        timeRanges[day]?.end ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            [day]: {
                                                                ...prev[day],
                                                                end: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}

                        <Input
                            type="text"
                            placeholder="Search course..."
                            className="font-medium"
                            value={searchValue}
                            onChange={(ev) => setSearchValue(ev.target.value)}
                        />

                        <ScrollArea
                            className={cn(
                                "h-[calc(100dvh-16rem)]",
                                {
                                    [`h-[calc(100dvh-22rem)] max-sm:h-[calc(100dvh-26rem)]`]:
                                        selectedDays.length === 1,
                                },
                                {
                                    [`h-[calc(100dvh-29rem)]`]:
                                        selectedDays.length >= 2,
                                }
                            )}
                        >
                            <div className="space-y-2">
                                {filteredCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        onClick={() =>
                                            updateSelection(course.id)
                                        }
                                        className={cn(
                                            "flex items-center gap-2 text-sm font-medium cursor-pointer p-2 rounded-md border-b",
                                            {
                                                "hover:bg-muted":
                                                    !selectionMap[course.id],
                                            },
                                            {
                                                "bg-muted border":
                                                    selectionMap[course.id],
                                            }
                                        )}
                                    >
                                        {selectionMap[course.id] && (
                                            <Check className="size-4" />
                                        )}
                                        <div className="w-full space-y-1">
                                            <p className="text-muted-foreground">
                                                {course.id}
                                            </p>
                                            <p>{course.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <Button
                            disabled={true}
                            className="w-full"
                            onClick={async () => await exportAs("pdf")}
                        >
                            Export as PDF
                        </Button>
                        <Button
                            disabled={
                                isExporting ||
                                Object.values(selectionMap).every((v) => !v)
                            }
                            className="w-full"
                            onClick={async () => await exportAs("xlsx")}
                        >
                            Export as XLSX
                        </Button>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
