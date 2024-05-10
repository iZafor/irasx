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
    checkedArray: boolean[];
    offeredCourses: OfferedCourse[];
    preRequisiteMap: PreRequisiteMap;
}

export default function OfferedCoursePdf(
    { checkedArray, offeredCourses, preRequisiteMap }: OfferedCoursePdfProps) {
    const selectedIndices: number[] = [];
    for (let i = 0; i < checkedArray.length; i++) {
        if (checkedArray[i]) {
            selectedIndices.push(i);
        }
    }

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
                    selectedIndices.map((idx, sIdx) =>
                        <TableRow key={`${idx}-${sIdx}`} className={`top-[-${sIdx + 1}]`}>
                            <TableCellText className="w-[5rem]" text={offeredCourses[idx].courseId} />
                            <Separator />
                            <TableCellText className="w-[18rem]" text={offeredCourses[idx].courseName} />
                            <Separator />
                            <TableCellText className="w-[5rem]" text={offeredCourses[idx].section} />
                            <Separator />
                            <TableCellText className="w-[6rem]" text={offeredCourses[idx].enrolled} />
                            <Separator />
                            <TableCellText className="w-[5rem]" text={offeredCourses[idx].vacancy} />
                            <Separator />
                            <TableCellText className="w-[12rem]" text={offeredCourses[idx].timeSlot} />
                            <Separator />
                            <TableCellText className="w-[18rem]" text={offeredCourses[idx].facualtyName} />
                            <Separator />
                            <TableCellView className="m-2 mt-3 flex flex-row gap-4 flex-[1_1_1] flex-wrap justify-center">
                                {
                                    preRequisiteMap[offeredCourses[idx].courseId]
                                        ?.preRequisites.map((pre, pIdx) => (
                                            <PreRequisite
                                                key={`${idx}-${pIdx}-${pre.courseId}`}
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