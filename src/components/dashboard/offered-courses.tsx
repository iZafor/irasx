import {
    getOfferedCourses,
    getPreRequisiteCourses,
    getCourseCatalogue,
    getRequirementCatalogues
} from "@/lib/apis";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import OfferedCourseTable from "./offered-course-table";
import {
    OfferedCourse,
    CourseCatalogue,
    RequirementCatalogue,
    RequirementCatalogueMap
} from "@/lib/definition";
import TableSkeleton from "./table-skeleton";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import CatalogueTable from "./course-catalogue-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { transformIntoRequirementCatalogueMap } from "@/lib/utils";
import CatalogueCreditCount from "./catalogue-credit-count";

const allOfferedCourses: OfferedCourse[] = [];
const allFoundationCourseCatalogue: CourseCatalogue[] = [];
const allMinorCourseCatalogue: CourseCatalogue[] = [];
const allMajorCourseCatalogue: CourseCatalogue[] = [];

export default function OfferedCourses({ id, authToken }: { id: string; authToken: string }) {
    const [offeredCourses, setOfferedCourses] = useState(allOfferedCourses);
    const [foundationCourseCatalogue, setFoundationCourseCatalogue] = useState(allFoundationCourseCatalogue);
    const [majorCourseCatalogue, setMajorCourseCatalogue] = useState(allMajorCourseCatalogue);
    const [minorCourseCatalogue, setMinorCourseCatalogue] = useState(allMinorCourseCatalogue);
    const [preRequisiteMap, setPrerequisiteMap] = useState({});
    const [requirementCatalogues, setRequirementCatalogues] = useState<RequirementCatalogue[]>([]);
    const [requirementCatalogueMap, setRequirementCatalogueMap] = useState<RequirementCatalogueMap>({});
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

            if (catalogue === "all") {
                setOfferedCourses(allOfferedCourses.filter(course =>
                    search.length === 0 ||
                    course.courseId.toLowerCase().indexOf(search) != -1 ||
                    course.courseName.toLowerCase().indexOf(search) != -1 ||
                    course.facualtyName.toLowerCase().indexOf(search) != -1
                ));
            } else if (catalogue === "Foundation") {
                setFoundationCourseCatalogue(allFoundationCourseCatalogue.filter(course =>
                    search.length === 0 ||
                    course.courseId.toLowerCase().indexOf(search) != -1 ||
                    course.courseName.toLowerCase().indexOf(search) != -1
                ));
            } else if (catalogue === "Major") {
                setMajorCourseCatalogue(allMajorCourseCatalogue.filter(course =>
                    search.length === 0 ||
                    course.courseId.toLowerCase().indexOf(search) != -1 ||
                    course.courseName.toLowerCase().indexOf(search) != -1
                ));
            } else if (catalogue === "Minor") {
                setMinorCourseCatalogue(allMinorCourseCatalogue.filter(course =>
                    search.length === 0 ||
                    course.courseId.toLowerCase().indexOf(search) != -1 ||
                    course.courseName.toLowerCase().indexOf(search) != -1
                ));
            }
        }, 200);
    }

    useEffect(() => {
        if (!catalogue || !(["all", "Foundation", "Major", "Minor"].some(c => c === catalogue))) {
            navigateTo("all");
        }
    }, []);

    useEffect(() => {
        async function fetchAllData() {
            const [
                offCourses,
                fCatalogue,
                maCatalogue,
                miCatalogue,
                reqMap,
                reqCatalogue] = await Promise.all([
                    getOfferedCourses(id, authToken),
                    getCourseCatalogue(id, authToken, "Foundation"),
                    getCourseCatalogue(id, authToken, "Major"),
                    getCourseCatalogue(id, authToken, "Minor"),
                    getPreRequisiteCourses(id, authToken),
                    getRequirementCatalogues(id, authToken)
                ]);

            // Offered Courses
            setOfferedCourses(offCourses);
            allOfferedCourses.length = 0;
            allOfferedCourses.push(...offCourses);

            // Foundation Course Catalogue
            setFoundationCourseCatalogue(fCatalogue);
            allFoundationCourseCatalogue.length = 0;
            allFoundationCourseCatalogue.push(...fCatalogue);

            // Major Course Catalogue
            setMajorCourseCatalogue(maCatalogue);
            allMajorCourseCatalogue.length = 0;
            allMajorCourseCatalogue.push(...maCatalogue);

            // Minor Course Catalogue
            setMinorCourseCatalogue(miCatalogue);
            allMinorCourseCatalogue.length = 0;
            allMinorCourseCatalogue.push(...miCatalogue);

            // Pre-requisite Map
            setPrerequisiteMap(reqMap);

            // Requirement Catalogue
            setRequirementCatalogues(reqCatalogue);
            setRequirementCatalogueMap(transformIntoRequirementCatalogueMap(reqCatalogue));

            setIsLoading(false);
        }
        fetchAllData();
    }, []);

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
            <CatalogueCreditCount
                catalogue={catalogue || "none"}
                requirementCatalogueMap={requirementCatalogueMap}
            />
            {
                !isLoading ?
                    <>
                        {
                            catalogue === "all" ?
                                <OfferedCourseTable
                                    offeredCourses={offeredCourses}
                                    preRequisiteMap={preRequisiteMap}
                                />
                                :
                                (
                                    catalogue === "Foundation" ?
                                        <CatalogueTable
                                            catalogue={catalogue}
                                            courseCatalogue={foundationCourseCatalogue}
                                            preRequisiteMap={preRequisiteMap}
                                        />
                                        : (
                                            catalogue === "Major" ?
                                                <CatalogueTable
                                                    catalogue={catalogue}
                                                    courseCatalogue={majorCourseCatalogue}
                                                    preRequisiteMap={preRequisiteMap}
                                                />
                                                :
                                                <CatalogueTable
                                                    catalogue={catalogue}
                                                    courseCatalogue={minorCourseCatalogue}
                                                    preRequisiteMap={preRequisiteMap}
                                                />
                                        )
                                )
                        }
                    </>
                    :
                    <TableSkeleton />
            }
        </div>
    );
}