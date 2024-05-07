import { Result, GradesResponse, SemesterResult } from "@/lib/definition";
import { useState, useEffect } from "react";
import { transformIntoResult } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SemesterTable, CGPATable } from "./grade-tables";
import { Separator } from "@/components/ui/separator";
import { getGrades } from "@/lib/apis";
import TableSkeleton from "./table-skeleton";

const data: SemesterResult[] = [];

export default function Grades({ id, authToken }: { id: string; authToken: string }) {
    const [result, setResult] = useState<Result>({ keys: [] });
    const [isLoading, setIsLoading] = useState(true);

    function handleSearch(ev: React.ChangeEvent<HTMLInputElement>) {
        const search = ev.target.value;
        const filtered = data.filter(c => search.length == 0 ||
            c.courseId.toLowerCase().indexOf(search.toLowerCase()) != -1
            || c.courseName.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) != -1);
        setResult(transformIntoResult(filtered));
    }

    useEffect(() => {
        async function fetchGradeData() {
            try {
                const grades: GradesResponse = await getGrades(id, authToken);
                setResult(transformIntoResult(grades.data));
                data.length = 0;
                data.push(...grades.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchGradeData();
    }, [id, authToken]);

    return (
        <div className="rounded-md border">
            <div className="flex p-4 pb-0 justify-end mb-4">
                <Input className="w-30" placeholder="Search here..." onChange={handleSearch} />
            </div>
            {
                !isLoading ?
                    <ScrollArea className="h-[30rem]">
                        <div className="p-4">
                            {result.keys.map((key) =>
                                result[key].keys.map((year, idx) =>
                                    <span key={year + "+" + idx}>
                                        <SemesterTable key={`${key}-${year}`} res={result[key][year]} />
                                        <Separator key={`${year}-${key}`} className="my-2" />
                                    </span>
                                ))}
                            <CGPATable res={result} />
                        </div>
                    </ScrollArea>
                    :
                    <TableSkeleton />
            }
        </div>
    );
}