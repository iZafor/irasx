import { CourseCatalogue, PreRequisiteMap } from "@/lib/definition";
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "../ui/table";

interface CatalogueTableProps {
    courseCatalogue: CourseCatalogue[];
    preRequisiteMap: PreRequisiteMap;
}

export default function CatalogueTable(
    { courseCatalogue, preRequisiteMap }: CatalogueTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[5rem]">Course ID</TableHead>
                    <TableHead className="w-[18rem]">Course Name</TableHead>
                    <TableHead className="w-[5rem]">Credit Hour</TableHead>
                    <TableHead className="w-[18rem]">Course Group</TableHead>
                    <TableHead className="w-[7rem]">Pre-Requisites</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    courseCatalogue.map(course => (
                        <TableRow key={course.courseId}>
                            <TableCell>{course.courseId}</TableCell>
                            <TableCell>{course.courseName}</TableCell>
                            <TableCell>{course.createHour}</TableCell>
                            <TableCell>{course.courseGroupName}</TableCell>
                            <TableCell>
                                {<PreRequisites courseId={course.courseId} preRequisiteMap={preRequisiteMap} />}
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