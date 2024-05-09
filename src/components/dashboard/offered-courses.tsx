import {
    getOfferedCourses,
    getPreRequisiteCourses,
    getCourseCatalogue,
    getRequirementCatalogues
} from "@/lib/apis";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
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
import { transformIntoPreRequisiteMap, transformIntoRequirementCatalogueMap } from "@/lib/utils";
import CatalogueCreditCount from "./catalogue-credit-count";
import RequirementCatalogueTable from "./requirement-catalogue-table";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";


const AllOfferedCourses: OfferedCourse[] = [];
const AllFoundationCourseCatalogue: CourseCatalogue[] = [];
const AllMinorCourseCatalogue: CourseCatalogue[] = [];
const AllMajorCourseCatalogue: CourseCatalogue[] = [];

export default function OfferedCourses({ id, authToken }: { id: string; authToken: string }) {
    const [offeredCourses, setOfferedCourses] = useState(AllOfferedCourses);
    const [foundationCourseCatalogue, setFoundationCourseCatalogue] = useState(AllFoundationCourseCatalogue);
    const [majorCourseCatalogue, setMajorCourseCatalogue] = useState(AllMajorCourseCatalogue);
    const [minorCourseCatalogue, setMinorCourseCatalogue] = useState(AllMinorCourseCatalogue);
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

            if (catalogue === "All") {
                setOfferedCourses(AllOfferedCourses.filter(course =>
                    search.length === 0 ||
                    course.courseId.toLowerCase().indexOf(search) != -1 ||
                    course.courseName.toLowerCase().indexOf(search) != -1 ||
                    course.facualtyName.toLowerCase().indexOf(search) != -1
                ));
            } else if (catalogue === "Foundation") {
                setFoundationCourseCatalogue(AllFoundationCourseCatalogue.filter(course =>
                    search.length === 0 ||
                    course.courseId.toLowerCase().indexOf(search) != -1 ||
                    course.courseName.toLowerCase().indexOf(search) != -1
                ));
            } else if (catalogue === "Major") {
                setMajorCourseCatalogue(AllMajorCourseCatalogue.filter(course =>
                    search.length === 0 ||
                    course.courseId.toLowerCase().indexOf(search) != -1 ||
                    course.courseName.toLowerCase().indexOf(search) != -1
                ));
            } else if (catalogue === "Minor") {
                setMinorCourseCatalogue(AllMinorCourseCatalogue.filter(course =>
                    search.length === 0 ||
                    course.courseId.toLowerCase().indexOf(search) != -1 ||
                    course.courseName.toLowerCase().indexOf(search) != -1
                ));
            }
        }, 200);
    }

    useEffect(() => {
        if (!catalogue || !(["All", "Foundation", "Major", "Minor", "Requirements"].some(c => c === catalogue))) {
            navigateTo("All");
        }
    }, []);

    useEffect(() => {
        async function fetchAllData() {
            const [
                offCourses,
                fCatalogue,
                maCatalogue,
                miCatalogue,
                preReqCourses,
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
            AllOfferedCourses.length = 0;
            AllOfferedCourses.push(...offCourses);

            // Foundation Course Catalogue
            setFoundationCourseCatalogue(fCatalogue);
            AllFoundationCourseCatalogue.length = 0;
            AllFoundationCourseCatalogue.push(...fCatalogue);

            // Major Course Catalogue
            setMajorCourseCatalogue(maCatalogue);
            AllMajorCourseCatalogue.length = 0;
            AllMajorCourseCatalogue.push(...maCatalogue);

            // Minor Course Catalogue
            setMinorCourseCatalogue(miCatalogue);
            AllMinorCourseCatalogue.length = 0;
            AllMinorCourseCatalogue.push(...miCatalogue);

            // Pre-requisite Map
            setPrerequisiteMap(transformIntoPreRequisiteMap(preReqCourses, offCourses));

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
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="pl-0">{catalogue}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <Tabs defaultValue={catalogue || "All"}>
                                    <TabsList className="max-md:flex-col h-30">
                                        <TabsTrigger className="max-md:w-full" value="All" onClick={() => navigateTo("All")}>All</TabsTrigger>
                                        <TabsTrigger className="max-md:w-full" value="Foundation" onClick={() => navigateTo("Foundation")}>Foundation</TabsTrigger>
                                        <TabsTrigger className="max-md:w-full" value="Major" onClick={() => navigateTo("Major")}>Major</TabsTrigger>
                                        <TabsTrigger className="max-md:w-full" value="Minor" onClick={() => navigateTo("Minor")}>Minor</TabsTrigger>
                                        <TabsTrigger className="max-md:w-full" value="Requirements" onClick={() => navigateTo("Requirements")}>
                                            Requirements
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                {
                    catalogue !== "Requirements" &&
                    <Input className={`w-30 w-[10rem] max-xs:w-[7rem]`} placeholder="Search here..." onChange={handleSearch} />
                }
            </div>
            <CatalogueCreditCount
                catalogue={catalogue || "none"}
                requirementCatalogueMap={requirementCatalogueMap}
            />
            {
                !isLoading ?
                    <>
                        {
                            catalogue === "All" ?
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
                                                : catalogue === "Minor" ?
                                                    <CatalogueTable
                                                        catalogue={catalogue}
                                                        courseCatalogue={minorCourseCatalogue}
                                                        preRequisiteMap={preRequisiteMap}
                                                    />
                                                    :
                                                    <RequirementCatalogueTable catalogue={requirementCatalogues} />
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