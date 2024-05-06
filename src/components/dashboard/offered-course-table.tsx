import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OfferedCourse } from "@/lib/definition";

export default function OfferedCourseTable({ offeredCourses }: { offeredCourses: OfferedCourse[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Course ID</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Vacancy</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Faculty</TableHead>
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
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}