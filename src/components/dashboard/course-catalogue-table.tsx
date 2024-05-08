import { CourseCatalogue, PreRequisiteMap } from "@/lib/definition";
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { PDfDownloadButton } from "../pdf";
import CourseCataloguePdf from "./course-catalogue-pdf";

interface CatalogueTableProps {
    catalogue: string | null;
    courseCatalogue: CourseCatalogue[];
    preRequisiteMap: PreRequisiteMap;
}

export default function CatalogueTable(
    { catalogue, courseCatalogue, preRequisiteMap }: CatalogueTableProps) {
    return (
        <>
            <div className="flex w-full justify-end p-4">
                <PDfDownloadButton
                    fileName={`${catalogue?.toLowerCase()}_courses_catalogue`}
                    disabled={false}
                    pdfDocument={
                        <CourseCataloguePdf
                            catalogueTitle={catalogue || ""}
                            courseCatalogue={courseCatalogue}
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
                                <TableHead className="w-[5rem]">COURSE</TableHead>
                                <TableHead className="w-[16rem]">TITLE</TableHead>
                                <TableHead className="w-[7rem]">CREDIT HOUR</TableHead>
                                <TableHead className="w-[18rem]">COURSE GROUP</TableHead>
                                <TableHead className="w-[7rem]">PRE-REQUISITES</TableHead>
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
                                            {
                                                <PreRequisites courseId={course.courseId} preRequisiteMap={preRequisiteMap} />
                                            }
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