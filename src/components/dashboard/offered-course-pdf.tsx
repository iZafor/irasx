import { Document, Page, View, Text } from "@react-pdf/renderer";
import {
    TableHeader,
    TableRow,
    TableCellText,
    TableCellView,
    PreRequisite,
    Separator,
    tw
} from "../pdf";
import { OfferedCourse, PreRequisiteMap } from "@/lib/definition";

interface OfferedCoursePdfProps {
    checkedMap: { [key: string]: boolean };
    offeredCourses: OfferedCourse[];
    preRequisiteMap: PreRequisiteMap;
}

export default function OfferedCoursePdf(
    { checkedMap, offeredCourses, preRequisiteMap }: OfferedCoursePdfProps) {
    const selectedCourses = offeredCourses.filter(course => checkedMap[course.courseId]);

    return (
        <Document pageMode="fullScreen">
            <Page size="A2" style={tw("p-10")} wrap={false}>
                <View style={tw("font-semibold")}>
                    <Text>Offered Courses</Text>
                </View>
                <Separator className="h-1 w-full" />
                <TableHeader className="mt-4">
                    <TableCellText className="w-[5rem]" text="COURSE" />
                    <Separator />
                    <TableCellText className="w-[18rem]" text="TITLE" />
                    <Separator />
                    <TableCellText className="w-[5rem]" text="SECTION" />
                    <Separator />
                    <TableCellText className="w-[6rem]" text="ENROLLED" />
                    <Separator />
                    <TableCellText className="w-[5rem]" text="VACANCY" />
                    <Separator />
                    <TableCellText className="w-[12rem]" text="TIME SLOT" />
                    <Separator />
                    <TableCellText className="w-[18rem]" text="FACULTY" />
                    <Separator />
                    <TableCellText text="PRE-REQUISITES" />
                </TableHeader>
                {
                    selectedCourses.map((course, sIdx) =>
                        <TableRow key={`${course.courseId}-${sIdx}`} className={`top-[-${sIdx + 1}]`}>
                            <TableCellText className="w-[5rem]" text={course.courseId} />
                            <Separator />
                            <TableCellText className="w-[18rem]" text={course.courseName} />
                            <Separator />
                            <TableCellText className="w-[5rem]" text={course.section} />
                            <Separator />
                            <TableCellText className="w-[6rem]" text={course.enrolled} />
                            <Separator />
                            <TableCellText className="w-[5rem]" text={course.vacancy} />
                            <Separator />
                            <TableCellText className="w-[12rem]" text={course.timeSlot} />
                            <Separator />
                            <TableCellText className="w-[18rem]" text={course.facualtyName} />
                            <Separator />
                            <TableCellView className="m-2 mt-3 flex flex-row gap-4 flex-[1_1_1] flex-wrap justify-center">
                                {
                                    preRequisiteMap[course.courseId]
                                        ?.preRequisites.map((pre, pIdx) => (
                                            <PreRequisite
                                                key={`${course.courseId}-${pIdx}-${pre.courseId}`}
                                                text={pre.courseId}
                                                status={pre.status}
                                            />
                                        ))
                                }
                            </TableCellView>
                        </TableRow>
                    )
                }
            </Page>
        </Document>
    );
}