import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OfferedCourse, PreRequisiteMap } from "@/lib/definition";
import { useEffect, useState } from "react";
import OfferedCoursePdf from "./offered-course-pdf";
import { PDfDownloadButton } from "../pdf";
import { ScrollArea } from "../ui/scroll-area";

const checkedMap: { [key: string]: boolean } = {};

interface OfferedCourseTableProps {
    allOfferedCourses: OfferedCourse[];
    filteredOfferedCourses: OfferedCourse[];
    preRequisiteMap: PreRequisiteMap;
}

export default function OfferedCourseTable(
    { allOfferedCourses, filteredOfferedCourses, preRequisiteMap }: OfferedCourseTableProps) {

    const [checkedArray, setCheckedArray] = useState(Array.from({ length: filteredOfferedCourses.length }, () => false));
    const [disableExport, setDisableExport] = useState(true);

    function updateCheckedArray() {
        console.log(checkedMap);
        filteredOfferedCourses.forEach((course, idx) => {
            if (checkedMap[course.courseId]) {
                checkedArray[idx] = true;
            } else {
                checkedArray[idx] = false;
            }
        });
        setCheckedArray(checkedArray.slice());
    }

    function handleClick(ev: React.ChangeEvent<HTMLInputElement>) {
        const { checked: newState, name: courseId }: { checked: boolean; name: string; } = ev.currentTarget;
        checkedMap[courseId] = newState;
        setDisableExport(!checkedArray.some(chk => chk));
        updateCheckedArray();
    }

    function handleSelectAll(ev: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = ev.currentTarget;
        filteredOfferedCourses.forEach(course => checkedMap[course.courseId] = checked);
        setDisableExport(!checked);
        updateCheckedArray();
    }

    useEffect(() => {
        updateCheckedArray();
    }, [filteredOfferedCourses]);

    return (
        <>
            <div className="flex w-full justify-between items-center p-4">
                <span className="flex items-center justify-start gap-2">
                    <input type="checkbox" id="selectAll" onChange={handleSelectAll} />
                    <label htmlFor="selectAll">Select All</label>
                </span>
                <PDfDownloadButton
                    fileName="offered_courses"
                    disabled={disableExport}
                    pdfDocument={
                        <OfferedCoursePdf
                            checkedMap={checkedMap}
                            offeredCourses={allOfferedCourses}
                            preRequisiteMap={preRequisiteMap}
                        />
                    }
                />
            </div>
            <div className="max-md:overflow-x-scroll">
                <ScrollArea className="h-[28rem] lg:text-sm max-md:w-[75rem] max-md:h-[22rem]">
                    <div className="p-4 pl-2">
                        <Table className="max-md:text-xs">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[8rem]">COURSE</TableHead>
                                    <TableHead className="w-[16rem]">TITLE</TableHead>
                                    <TableHead className="w-[5rem]">SECTION</TableHead>
                                    <TableHead className="w-[5rem]">ENROLLED</TableHead>
                                    <TableHead className="w-[5rem]">VACANCY</TableHead>
                                    <TableHead className="w-[10rem]">TIME SLOT</TableHead>
                                    <TableHead className="w-[15rem]">FACULTY</TableHead>
                                    <TableHead className="w-[9rem]">PRE-REQUISITES</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    filteredOfferedCourses.map((row, idx) => (
                                        <TableRow key={row.courseId + idx}>
                                            <TableCell>
                                                <span className="flex items-center justify-start gap-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleClick}
                                                        checked={checkedArray[idx]}
                                                        name={`${row.courseId}`}
                                                    />
                                                    <p className="">
                                                        {row.courseId}
                                                    </p>
                                                </span>
                                            </TableCell>
                                            <TableCell>{row.courseName}</TableCell>
                                            <TableCell>{row.section}</TableCell>
                                            <TableCell>{row.enrolled}</TableCell>
                                            <TableCell>{row.vacancy}</TableCell>
                                            <TableCell>{row.timeSlot}</TableCell>
                                            <TableCell>{row.facualtyName}</TableCell>
                                            <TableCell>
                                                <PreRequisites courseId={row.courseId} preRequisiteMap={preRequisiteMap} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>
            </div>
        </>
    );
}

function PreRequisites({ courseId, preRequisiteMap }: { courseId: string; preRequisiteMap: PreRequisiteMap }) {
    const reqs = preRequisiteMap[courseId]?.preRequisites;
    if (!reqs) {
        return <></>
    }

    return (
        <div className="space-y-2">
            {
                reqs.map(course => (
                    <p key={courseId + course.courseId} className={`rounded p-2 text-center text-white ${course.status === "complete" ? "bg-green-600" : "bg-red-600"}`}>{course.courseId}</p>
                ))
            }
        </div>
    );
}