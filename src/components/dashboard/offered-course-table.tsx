import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OfferedCourse, PreRequisiteMap, RequirementCatalogueMap, CatalogGroupMap } from "@/lib/definition";
import { Separator } from "../ui/separator";
import { Asterisk, CircleCheck } from "lucide-react";

interface OfferedCourseTableProps {
    offeredCourses: OfferedCourse[];
    preRequisiteMap: PreRequisiteMap;
    requirementCatalogueMap: RequirementCatalogueMap;
}

export default function OfferedCourseTable(
    { offeredCourses, preRequisiteMap, requirementCatalogueMap }: OfferedCourseTableProps) {
    return (
        <span>
            <div className="flex items-center space-x-4 text-sm">
                <div className="flex gap-2 items-center">
                    <h3>Foundation</h3>
                    <p className="flex gap-1 items-center">
                        <Asterisk />{requirementCatalogueMap[CatalogGroupMap.foundation].minRequirement}
                    </p>
                    <p className="flex gap-1 items-center">
                        <CircleCheck />{requirementCatalogueMap[CatalogGroupMap.foundation].doneCredit}
                    </p>
                </div>
                <Separator orientation="vertical" className="h-4"/>
                <div className="flex gap-2 items-center">
                    <h3>Major</h3>
                    <p className="flex gap-1 items-center">
                        <Asterisk />{requirementCatalogueMap[CatalogGroupMap.major].minRequirement}
                    </p>
                    <p className="flex gap-1 items-center">
                        <CircleCheck />{requirementCatalogueMap[CatalogGroupMap.major].doneCredit}
                    </p>
                </div>
                <Separator orientation="vertical" className="h-4"/>
                <div className="flex gap-2 items-center">
                    <h3>Minor</h3>
                    <p className="flex gap-1 items-center">
                        <Asterisk />{requirementCatalogueMap[CatalogGroupMap.minor].minRequirement}
                    </p>
                    <p className="flex gap-1 items-center">
                        <CircleCheck />{requirementCatalogueMap[CatalogGroupMap.minor].doneCredit}
                    </p>
                </div>
            </div>
            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[5rem]">Course ID</TableHead>
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
                                <TableCell>{row.courseId}</TableCell>
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
        </span>
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