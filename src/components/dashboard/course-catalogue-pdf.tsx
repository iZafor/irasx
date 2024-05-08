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
import { CourseCatalogue, PreRequisiteMap } from "@/lib/definition";

interface CourseCataloguePdfProps {
    catalogueTitle: string;
    courseCatalogue: CourseCatalogue[];
    preRequisiteMap: PreRequisiteMap;
}

export default function CourseCataloguePdf(
    { catalogueTitle, courseCatalogue, preRequisiteMap }: CourseCataloguePdfProps) {
    return (
        <Document pageMode="fullScreen">
            <Page size="A2" style={tw("p-10")} wrap={false}>
                <View style={tw("font-semibold")}>
                    <Text>{catalogueTitle} Courses Catalogue</Text>
                </View>
                <Separator className="h-1 w-full" />
                <TableHeader className="mt-4">
                    <TableCellText className="w-[5rem]" text="COURSE" />
                    <Separator />
                    <TableCellText className="w-[22rem]" text="TITLE" />
                    <Separator />
                    <TableCellText className="w-[10rem]" text="CREDIT HOUR" />
                    <Separator />
                    <TableCellText className="w-[18rem]" text="COURSE GROUP" />
                    <Separator />
                    <TableCellText text="PRE-REQUISITES" />
                </TableHeader>
                {
                    courseCatalogue.map((course, idx) => (
                        <TableRow key={`${course.courseId}-${idx}`} className={`top-[-${idx + 1}px]`}>
                            <TableCellText className="w-[5rem]" text={course.courseId} />
                            <Separator />
                            <TableCellText className="w-[22rem]" text={course.courseName} />
                            <Separator />
                            <TableCellText className="w-[10rem]" text={course.createHour} />
                            <Separator />
                            <TableCellText className="w-[18rem]" text={course.courseGroupName} />
                            <Separator />
                            <TableCellView className="m-2 mt-3 flex flex-row gap-4 flex-[1_1_1] flex-wrap justify-center">
                                {
                                    preRequisiteMap[course.courseId]
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
                    ))
                }
            </Page>
        </Document>
    );
}