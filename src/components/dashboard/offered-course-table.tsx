import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OfferedCourse, PreRequisiteMap } from "@/lib/definition";
import { useState } from "react";
import OfferedCoursePdf from "./offered-course-pdf";
import { PDfDownloadButton } from "../pdf";
import { ScrollArea } from "../ui/scroll-area";

interface OfferedCourseTableProps {
    offeredCourses: OfferedCourse[];
    preRequisiteMap: PreRequisiteMap;
}

export default function OfferedCourseTable(
    { offeredCourses, preRequisiteMap }: OfferedCourseTableProps) {

    const [checkedArray, setCheckedArray] = useState(Array.from({ length: offeredCourses.length }, () => false));
    const [exportDisable, setExportDisable] = useState(true);

    function handleClick(ev: React.ChangeEvent<HTMLInputElement>) {
        const { checked: newState, name } = ev.currentTarget;
        const courseId = offeredCourses[parseInt(name)].courseId;
        const firstIdx = offeredCourses.findIndex(oc => oc.courseId.indexOf(courseId) !== -1);
        for (let i = firstIdx; i < checkedArray.length; i++) {
            if (offeredCourses[i].courseCode.indexOf(courseId) === -1) {
                break;
            }
            checkedArray[i] = newState;
        }
        setExportDisable(!checkedArray.some(chk => chk));
        setCheckedArray(checkedArray.slice());
    }

    return (
        <>
            <div className="flex w-full justify-end p-4">
                <PDfDownloadButton
                    fileName="offered_courses"
                    disabled={exportDisable}
                    pdfDocument={
                        <OfferedCoursePdf
                            checkedArray={checkedArray}
                            offeredCourses={offeredCourses}
                            preRequisiteMap={preRequisiteMap}
                        />
                    }
                />
            </div>
            <ScrollArea className="h-[28rem]">
                <div className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[8rem]">Course ID</TableHead>
                                <TableHead className="w-[18rem]">Course Name</TableHead>
                                <TableHead className="w-[5rem]">Section</TableHead>
                                <TableHead className="w-[5rem]">Enrolled</TableHead>
                                <TableHead className="w-[5rem]">Vacancy</TableHead>
                                <TableHead className="w-[8rem]">Time Slot</TableHead>
                                <TableHead className="w-[15rem]">Faculty</TableHead>
                                <TableHead className="w-[7rem]">Pre-Requisites</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                offeredCourses.map((row, idx) => (
                                    <TableRow key={row.courseId + idx}>
                                        <TableCell>
                                            <span className="flex items-center justify-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleClick}
                                                    checked={checkedArray[idx]}
                                                    name={`${idx}-chk`}
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