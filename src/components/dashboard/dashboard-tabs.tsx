import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Grades from "./grades";
import OfferedCourses from "./offered-courses";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { StoredAuthData } from "@/lib/definition";

export default function DashboardTabs({ authData }: { authData: StoredAuthData }) {
    const id = authData.id;
    const authToken = authData.data.data?.[0]?.["access_token"] || "";

    const [params] = useSearchParams();
    const query = params.get("tab");
    const location = useLocation();
    const navigate = useNavigate();

    function navigateTo(tab: string, catalogue?: string) {
        const newParams = new URLSearchParams(params);
        newParams.set("tab", tab);
        if (catalogue) {
            newParams.set("catalogue", "All");
        }
        const newPath = `${location.pathname}?${newParams.toString()}`;
        navigate(newPath);
    }

    useEffect(() => {
        if (!query) {
            navigateTo("grades");
        }
    }, []);

    return (
        <>
            <Tabs defaultValue={query || "grades"}>
                <TabsList className="mb-4 max-xs:w-full max-xs:justify-evenly">
                    <TabsTrigger value="grades" onClick={() => navigateTo("grades")}>Grades</TabsTrigger>
                    <TabsTrigger value="courses" onClick={() => navigateTo("courses")}>Offered Courses</TabsTrigger>
                </TabsList>
            </Tabs>
            {
                query === "courses" ?
                    <OfferedCourses id={id} authToken={authToken} />
                    :
                    <Grades id={id} authToken={authToken} />
            }
        </>
    );
}