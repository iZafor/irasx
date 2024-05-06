import { getOfferedCourses } from "@/lib/apis";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import OfferedCourseTable from "./offered-course-table";
import { OfferedCourse } from "@/lib/definition";

const allOfferedCourses: OfferedCourse[] = [];

export default function OfferedCourses({ id, authToken }: { id: string; authToken: string }) {
    const [offeredCourses, setOfferedCourses] = useState(allOfferedCourses);

    function handleSearch(ev: React.ChangeEvent<HTMLInputElement>) {
        const search = ev.target.value.toLowerCase();
        const filteredCourses = allOfferedCourses.filter(course =>
            search.length === 0 ||
            course.courseId.toLowerCase().indexOf(search) != -1 ||
            course.courseName.toLowerCase().indexOf(search) != -1 ||
            course.facualtyName.toLowerCase().indexOf(search) != -1
        );
        setOfferedCourses(filteredCourses);
    }

    useEffect(() => {
        async function fetchOfferedCourses() {
            try {
                const courses = await getOfferedCourses(id, authToken).then(res => res.json());
                setOfferedCourses(courses.data.eligibleOfferCourses);
                allOfferedCourses.length = 0;
                allOfferedCourses.push(...courses.data.eligibleOfferCourses);
            } catch (error) {
                console.error(error);
            }
        }
        fetchOfferedCourses();
    }, [id, authToken]);

    return (
        <div className="rounded-md border">
            <div className="flex p-4 pb-0 justify-end mb-4">
                <Input className="w-30" placeholder="Search here..." onChange={handleSearch} />
            </div>
            <ScrollArea className="h-[30rem]">
                <div className="p-4">
                    <OfferedCourseTable offeredCourses={offeredCourses} />
                </div>
            </ScrollArea>
        </div>
    );
}