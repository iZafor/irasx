import { verifySession } from "@/lib/dal";
import { NextRequest, NextResponse } from "next/server";
import { Course } from "@/lib/definition";
import { Workbook } from "exceljs";
import { getFormattedTimeSlot } from "@/lib/utils";

export async function POST(req: NextRequest) {
    await verifySession();

    const { data } = (await req.json()) as { data: Course[] };
    if (!data) {
        return Response.json({ message: "invalid data!" }, { status: 422 });
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("offered courses");
    worksheet.columns = [
        { header: "Course ID", key: "courseId", width: 14 },
        { header: "Section", key: "section", width: 10 },
        { header: "Time Slot", key: "timeSlot", width: 44 },
        { header: "Enrolled", key: "enrolled", width: 14 },
        { header: "Vacancy", key: "vacancy", width: 14 },
        { header: "Credit Hour", key: "creditHour", width: 18 },
        { header: "Grade", key: "grade", width: 14 },
        { header: "Course Title", key: "courseTitle", width: 40 },
        { header: "Faculty", key: "faculty", width: 40 },
        { header: "Prerequisites", key: "prerequisites", width: 40 }
    ];

    // headings styles 
    worksheet.getRow(1).font = {
        name: "Arial",
        size: 12,
        bold: true,
    };
    worksheet.getRow(1).height = 24;
    worksheet.getRow(1).alignment = { vertical: "middle" };
    worksheet.getRow(1).eachCell(cell => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "fffcd34d" }};
        cell.border = { right: { style: "thin", color: {argb: "ff0c0a09" } } };
    });

    for (let i = 0; i < data.length; i++) {
        const course = data[i];
        const formattedTime = getFormattedTimeSlot(course.timeSlot);

        const row = worksheet.addRow({
            ...course,
            timeSlot: formattedTime,
            prerequisites: course.prerequisites
                .map((pre) => pre.courseId)
                .join(", "),
        });

        row.font = { name: "Arial", size: 12 };

        const preCell = row.getCell("prerequisites");
        preCell.font = { ...row.font, color: { argb: "fff1f1f1" }, bold: true };
        if (course.prerequisites.some((pre) => !pre.status)) {
            preCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffef4444" }};
        } else {
            preCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ff22c55e" } };
        }

        const fgColor = { argb: (i & 1) === 0 ? "fff8fafc" : "ffcbd5e1" };
        row.alignment = { vertical: "middle", horizontal: "left", shrinkToFit: true };
        row.height = 24;
        row.eachCell((cell, idx) => {
            if (idx != 10) {
                cell.fill = { type: "pattern", pattern:"solid", fgColor };
            }
            cell.border = { right: { style: "thin", color: { argb: "ff0c0a09" } } };
        });
    }
    
    const buf = await workbook.xlsx.writeBuffer();

    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    headers.set("Content-Disposition", `attachment; filename="offered-course-list.xlsx"`);

    return new NextResponse(buf, { headers });
}
