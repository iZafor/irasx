import { Course } from "@/lib/definition";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "courseId",
        header: "Course ID",
        cell: (cell) => (
            <div className="w-[6rem]">{cell.getValue() as string}</div>
        ),
    },
    {
        accessorKey: "section",
        header: "Section",
        cell: (cell) => (
            <div className="w-[4rem]">{cell.getValue() as string}</div>
        ),
    },
    {
        accessorKey: "timeSlot",
        header: "Time Slot",
        cell: (cell) => (
            <div className="w-[10rem]">{cell.getValue() as string}</div>
        ),
    },
    {
        accessorKey: "enrolled",
        header: "Enrolled",
        cell: (cell) => (
            <div className="w-[4rem]">{cell.getValue() as string}</div>
        ),
    },
    {
        accessorKey: "vacancy",
        header: "Vacancy",
        cell: (cell) => (
            <div className="w-[6rem]">{cell.getValue() as string}</div>
        ),
    },
    {
        accessorKey: "creditHour",
        header: "Credit Hour",
        cell: (cell) => (
            <div className="w-[6rem]">{cell.getValue() as string}</div>
        ),
    },
    {
        accessorKey: "grade",
        header: "Grade",
        cell: (cell) => (
            <div className="w-[6rem]">{cell.getValue() as string}</div>
        ),
    },
    {
        accessorKey: "courseTitle",
        header: "Course Title",
        cell: (cell) => (
            <div className="w-[18rem]">{cell.getValue() as string}</div>
        ),
    },
    {
        accessorKey: "faculty",
        header: "Faculty",
        cell: (cell) => (
            <div className="w-[14rem]">{cell.getValue() as string}</div>
        ),
    },
    {
        accessorKey: "prerequisites",
        header: "Prerequisites",
        cell: (cell) => (
            <div className="w-[16rem] flex flex-wrap gap-2">
                {(
                    cell.getValue() as { courseId: string; status: boolean }[]
                ).map((pre, idx) => (
                    <p
                        key={pre.courseId + idx}
                        className={`font-semibold ${
                            pre.status ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {pre.courseId}
                    </p>
                ))}
            </div>
        ),
    },
];
