import { CourseCatalogue, PreRequisiteMap, RequirementCatalogueMap, CatalogGroupMap } from "@/lib/definition";
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "../ui/table";
import { Asterisk, CircleCheck } from "lucide-react";

interface CatalogueTableProps {
    catalogue: string;
    courseCatalogue: CourseCatalogue[];
    preRequisiteMap: PreRequisiteMap;
    requirementCatalogueMap: RequirementCatalogueMap;
}

export default function CatalogueTable(
    { catalogue, courseCatalogue, preRequisiteMap, requirementCatalogueMap }: CatalogueTableProps) {
    return (
        <span>
            <div className="flex items-center space-x-4 text-sm">
                <div className="flex gap-2 items-center">
                    <h3>{catalogue}</h3>
                    <p className="flex gap-1 items-center">
                        <Asterisk />
                        {requirementCatalogueMap[CatalogGroupMap[catalogue.toLowerCase()]].minRequirement}
                    </p>
                    <p className="flex gap-1 items-center">
                        <CircleCheck />
                        {requirementCatalogueMap[CatalogGroupMap[catalogue.toLowerCase()]].doneCredit}
                    </p>
                </div>
            </div>
            <Table className="mt-4">
                <TableHeader>
                    <TableHead className="w-[5rem]">Course ID</TableHead>
                    <TableHead className="w-[18rem]">Course Name</TableHead>
                    <TableHead className="w-[5rem]">Credit Hour</TableHead>
                    <TableHead className="w-[18rem]">Course Group</TableHead>
                    <TableHead className="w-[7rem]">Pre-Requisites</TableHead>
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