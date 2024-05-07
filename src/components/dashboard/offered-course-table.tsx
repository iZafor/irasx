import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OfferedCourse, PreRequisiteMap } from "@/lib/definition";

export default function OfferedCourseTable(
    { offeredCourses, preRequisiteMap }: { offeredCourses: OfferedCourse[]; preRequisiteMap: PreRequisiteMap }) {
    return (
        <Table>
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