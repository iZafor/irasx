import { RequirementCatalogue } from "@/lib/definition";
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";

interface RequirementCatalogueProps {
    catalogue: RequirementCatalogue[];
}

export default function RequirementCatalogueTable({ catalogue }: RequirementCatalogueProps) {
    return (
        <div className="max-md:overflow-x-scroll">
            <ScrollArea className="h-[32rem] max-md:w-[55rem] max-md:h-[26rem]">
                <div className="p-4 pl-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>GROUP</TableHead>
                                <TableHead>CATEGORY</TableHead>
                                <TableHead>TYPE</TableHead>
                                <TableHead>MIN REQ</TableHead>
                                <TableHead>DONE</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                catalogue.map((c, idx) =>
                                    <TableRow key={`${c.courseCatId}-${idx}`}>
                                        <TableCell>{c.courseGroupName}</TableCell>
                                        <TableCell>{c.courseCatGroupName}</TableCell>
                                        <TableCell>{c.courseTypeName}</TableCell>
                                        <TableCell>{c.minRequirment}</TableCell>
                                        <TableCell>{c.doneCredit}</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </div>
            </ScrollArea>
        </div>
    );
}