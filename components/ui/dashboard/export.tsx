"use client";

import { TooltipWrapper } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownToLine, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../button";
import { Course } from "@/lib/definition";
import { Sheet, SheetContent, SheetTrigger } from "../sheet";
import ComboBox from "../combo-box";

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
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
];

interface ExportProps {
    allCourses: Course[];
    courseBasics: {
        id: string;
        title: string;
    }[];
    selectionMap: { [key: string]: boolean };
    updateSelection: (courseId: string) => void;
}

export default function Export({
    allCourses,
    courseBasics,
    selectionMap,
    updateSelection,
}: ExportProps) {
    const [open, setOpen] = useState(false);
    const [filteredCourses, setFilteredCourses] = useState(courseBasics);
    const [isExporting, setIsExporting] = useState(false);
    const [day, setDay] = useState("");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const selectedCourses = courseBasics.filter(
        (course) => selectionMap[course.id]
    );

    function handleDaySelection(value: string) {
        let newSelectedDays = undefined;

        if (selectedDays.includes(value)) {
            newSelectedDays = selectedDays.filter((day) => day !== value);
            setDay(newSelectedDays.length > 0 ? newSelectedDays[0] : "");
            setSelectedDays(newSelectedDays);
        } else {
            newSelectedDays = [...selectedDays, value];
            setDay(value);
            setSelectedDays(newSelectedDays);
        }

        // TODO: show only the courses that matches the selected days
        if (newSelectedDays.length > 0) {
            setFilteredCourses(
                courseBasics.filter(cb => {
                    const timeSlot = allCourses.find(c => c.courseId === cb.id)!.timeSlot;
                    return false;
                })
            )
        }
    }

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
                <ScrollArea className="w-full h-[calc(100dvh-4rem)]">
                    <div className="space-y-4 mt-8 px-1">
                        <ComboBox
                            value={day}
                            values={days}
                            onChange={handleDaySelection}
                            name="Day"
                            className="pointer-events-auto"
                            isSelected={(value) => selectedDays.includes(value)}
                        />
                        {selectedCourses.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {selectedCourses.map((course) => (
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
                        )}
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
                        <ScrollArea className="h-[calc(100dvh-20rem)]">
                            <div className="space-y-4">
                                {filteredCourses.map((course) =>
                                    selectionMap[course.id] ? (
                                        <></>
                                    ) : (
                                        <div
                                            key={course.id}
                                            onClick={() =>
                                                updateSelection(course.id)
                                            }
                                            className="flex justify-between items-center text-sm font-medium cursor-pointer hover:bg-muted p-2 rounded-md border-b"
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
                        <Button
                            disabled={true}
                            className="w-full"
                            onClick={async () => await exportAs("pdf")}
                        >
                            Export as PDF
                        </Button>
                        <Button
                            disabled={isExporting}
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
