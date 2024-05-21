"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterMenu from "@/components/ui/dashboard/filter-menu";
import { Course, STORED_AUTH_DATA_KEY } from "@/lib/definition";
import { ChangeEvent, useEffect, useState } from "react";
import { getStoredAuthData, validateStoredAuthData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getCourses } from "@/lib/apis";
import CourseCardSkeleton from "@/components/ui/dashboard/course-card-skeleton";
import CourseList from "@/components/ui/dashboard/course-list";

const allCourses: Course[] = [];

export default function Dashboard() {
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    function handleSearch(ev: ChangeEvent<HTMLInputElement>) {
        const term = ev.target.value.toLowerCase();
        setTimeout(() => {
            setFilteredCourses(allCourses.filter(course =>
                course.courseId.toLowerCase().includes(term) ||
                course.courseTitle.toLowerCase().includes(term) ||
                course.faculty.toLowerCase().includes(term) ||
                course.group.toLowerCase().includes(term) ||
                course.category.toLowerCase().includes(term) ||
                course.catalogue.toLowerCase().includes(term)
            ));
        }, 100);
    }

    useEffect(() => {
        const authData = getStoredAuthData();
        if (!validateStoredAuthData(authData)) {
            router.push("/");
            return;
        }

        const logoutUser = setTimeout(() => {
            localStorage.removeItem(STORED_AUTH_DATA_KEY);
            router.push("/");
        }, Date.parse(authData.expiry) - Date.now());

        async function fetchData() {
            const courses = await getCourses(authData.studentId, authData.authToken);
            allCourses.length = 0;
            allCourses.push(...courses);
            setFilteredCourses(courses);
            setIsLoading(false);
        }

        fetchData();

        return () => {
            clearTimeout(logoutUser);
        };
    }, []);

    return (
        <div className="p-4 w-full h-[calc(100vh-4rem)] grid place-items-center">
            <div className="border rounded p-4 flex flex-col gap-4 w-[45rem] max-md:w-[40rem] max-sm:w-[98%]">
                <div className="w-full flex gap-4 items-center justify-between">
                    <div className="h-10 border rounded flex items-center focus-within:ring-1 focus-within:ring-ring px-4">
                        <Search />
                        <Input
                            type="text"
                            placeholder="Search here..."
                            className="text-base border-none focus-visible:ring-0"
                            autoComplete="off"
                            onChange={handleSearch}
                        />
                    </div>
                    <FilterMenu />
                </div>
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    {isLoading ? (
                        <div className="flex flex-col gap-4">
                            <CourseCardSkeleton />
                            <CourseCardSkeleton />
                        </div>
                    ) : (
                        <CourseList courses={filteredCourses} />
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
