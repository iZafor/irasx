import { getOfferedCourses, getPreRequisiteCourses, getCourseCatalogue } from "@/lib/apis";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import OfferedCourseTable from "./offered-course-table";
import { OfferedCourse, CourseCatalogue } from "@/lib/definition";
import TableSkeleton from "./table-skeleton";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import CatalogueTable from "./course-catalogue-table";
import { useNavigate, useSearchParams } from "react-router-dom";

const allOfferedCourses: OfferedCourse[] = [];
const allCourseCatalogue: CourseCatalogue[] = [];

export default function OfferedCourses({ id, authToken }: { id: string; authToken: string }) {
    const [offeredCourses, setOfferedCourses] = useState(allOfferedCourses);
    const [courseCatalogue, setCourseCatalogue] = useState(allCourseCatalogue);
    const [preRequisiteMap, setPrerequisiteMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const catalogue = params.get("catalogue");

    function navigateTo(catalogue: string) {
        navigate(`/dashboard/?tab=courses&catalogue=${catalogue}`);
    }

    function handleSearch(ev: React.ChangeEvent<HTMLInputElement>) {
        setTimeout(() => {
            const search = ev.target.value.toLowerCase();
            const filteredCourses = catalogue === "all" ? allOfferedCourses.filter(course =>
                search.length === 0 ||
                course.courseId.toLowerCase().indexOf(search) != -1 ||
                course.courseName.toLowerCase().indexOf(search) != -1 ||
                course.facualtyName.toLowerCase().indexOf(search) != -1
            ) : allCourseCatalogue.filter(course =>
                search.length === 0 ||
                course.courseId.toLowerCase().indexOf(search) != -1 ||
                course.courseName.toLowerCase().indexOf(search) != -1
            );

            if (catalogue === "all") {
                setOfferedCourses(filteredCourses);
            } else {
                setCourseCatalogue(filteredCourses);
            }
        }, 200);
    }

    useEffect(() => {
        if (!catalogue || !(["all", "Foundation", "Major", "Minor"].some(c => c === catalogue))) {
            navigateTo("all");
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);

        async function fetchOfferedCourses() {
            const courses = await getOfferedCourses(id, authToken);
            setOfferedCourses(courses);
            allOfferedCourses.length = 0;
            allOfferedCourses.push(...courses);
            setIsLoading(false);
        }

        async function fetchCatalogue() {
            const courses = await getCourseCatalogue(id, authToken, catalogue || "");
            setCourseCatalogue(courses);
            allCourseCatalogue.length = 0;
            allCourseCatalogue.push(...courses);
            setIsLoading(false);
        }

        if (catalogue === "all") {
            fetchOfferedCourses();
        } else {
            fetchCatalogue();
        }
    }, [id, authToken, catalogue]);

    useEffect(() => {
        async function fetchPreRequisites() {
            const pre = await getPreRequisiteCourses(id, authToken);
            setPrerequisiteMap(pre);
        }
        fetchPreRequisites();
    }, [id, authToken]);

    return (
        <div className="rounded-md border">
            <div className="flex p-4 pb-0 mb-4 justify-between">
                <Tabs defaultValue={catalogue || "all"}>
                    <TabsList>
                        <TabsTrigger value="all" onClick={() => navigateTo("all")}>All</TabsTrigger>
                        <TabsTrigger value="Foundation" onClick={() => navigateTo("Foundation")}>Foundation</TabsTrigger>
                        <TabsTrigger value="Major" onClick={() => navigateTo("Major")}>Major</TabsTrigger>
                        <TabsTrigger value="Minor" onClick={() => navigateTo("Minor")}>Minor</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Input className="w-30" placeholder="Search here..." onChange={handleSearch} />
            </div>
            {
                !isLoading ?
                    <ScrollArea className="h-[30rem]">
                        <div className="p-4">
                            {
                                catalogue === "all" ?
                                    <OfferedCourseTable
                                        offeredCourses={offeredCourses}
                                        preRequisiteMap={preRequisiteMap}
                                    />
                                    :
                                    <CatalogueTable
                                        courseCatalogue={courseCatalogue}
                                        preRequisiteMap={preRequisiteMap}
                                    />
                            }
                        </div>
                    </ScrollArea>
                    :
                    <TableSkeleton />
            }
        </div>
    );
}