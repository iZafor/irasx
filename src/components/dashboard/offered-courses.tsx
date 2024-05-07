import { getOfferedCourses, getPreRequisiteCourses } from "@/lib/apis";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import OfferedCourseTable from "./offered-course-table";
import { OfferedCourse } from "@/lib/definition";
import TableSkeleton from "./table-skeleton";

const allOfferedCourses: OfferedCourse[] = [];

export default function OfferedCourses({ id, authToken }: { id: string; authToken: string }) {
    const [offeredCourses, setOfferedCourses] = useState(allOfferedCourses);
    const [preRequisiteMap, setPrerequisiteMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    function handleSearch(ev: React.ChangeEvent<HTMLInputElement>) {
        setTimeout(() => {
            const search = ev.target.value.toLowerCase();
            const filteredCourses = allOfferedCourses.filter(course =>
                search.length === 0 ||
                course.courseId.toLowerCase().indexOf(search) != -1 ||
                course.courseName.toLowerCase().indexOf(search) != -1 ||
                course.facualtyName.toLowerCase().indexOf(search) != -1
            );
            setOfferedCourses(filteredCourses);
        }, 200);
    }

    useEffect(() => {
        async function fetchOfferedCourses() {
            const [courses, reqMap] = await Promise.all(
                [getOfferedCourses(id, authToken),
                getPreRequisiteCourses(id, authToken)]
            );
            setOfferedCourses(courses);
            allOfferedCourses.length = 0;
            allOfferedCourses.push(...courses);
            setPrerequisiteMap(reqMap);
            setIsLoading(false);
        }
        fetchOfferedCourses();
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
                            <OfferedCourseTable offeredCourses={offeredCourses} preRequisiteMap={preRequisiteMap} />
                        </div>
                    </ScrollArea>
                    :
                    <TableSkeleton />
            }
        </div>
    );
}