import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Result, SemesterResult } from "@/lib/definition";
import { mapGradePoint, mapSemester } from "@/lib/utils";

export function SemesterTable({ res }: { res: SemesterResult[] }) {
    let totalGrade = 0, totalCredit = 0;
    for (const course of res) {
        const credit = course.courseId.endsWith("L") ? 1 : 3;
        totalCredit += credit;
        totalGrade += mapGradePoint(course.grade) * credit;
    }
    const gpa = (totalGrade / totalCredit || 1).toFixed(2);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead colSpan={4} className="text-xl font-bold">{mapSemester(res[0].regSemester).toUpperCase()} - {res[0].regYear}</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead className="w-[6rem]">COURSE</TableHead>
                    <TableHead className="w-[28rem]">TITLE</TableHead>
                    <TableHead>GRADE</TableHead>
                    <TableHead className="text-right">POINT</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {res.map((data, idx) => (
                    <TableRow key={data.courseId + data.regSemester + data.regYear + idx}>
                        <TableCell className="font-medium">{data.courseId}</TableCell>
                        <TableCell>{data.courseName}</TableCell>
                        <TableCell>{data.grade}</TableCell>
                        <TableCell className="text-right">{mapGradePoint(data.grade)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2} />
                    <TableCell>GPA</TableCell>
                    <TableCell className="text-right">{gpa}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export function CGPATable({ res }: { res: Result }) {
    const finalRes: Map<string, SemesterResult> = new Map<string, SemesterResult>();
    res.keys.forEach(key => {
        res[key].keys.forEach(k => {
            for (const course of res[key][k]) {
                finalRes.set(course.courseId, course);
            }
        })
    });

    let totalGrade = 0, totalCredit = 0;
    for (const course of finalRes.values()) {
        const credit = course.courseId.endsWith("L") ? 1 : 3;
        totalCredit += credit;
        totalGrade += mapGradePoint(course.grade) * credit;
    }

    const cgpa = (totalGrade / totalCredit || 1).toFixed(2);

    return (
        <>
            {
                res.keys.length != 0 &&
                < Table >
                    <TableBody>
                        <TableRow>
                            <TableCell>CGPA</TableCell>
                            <TableCell className="text-right">{cgpa}</TableCell>
                        </TableRow>
                    </TableBody>
                </ Table>
            }
        </>
    );
}