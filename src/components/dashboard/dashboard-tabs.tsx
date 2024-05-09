import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Grades from "./grades";
import { getStoredAuthData } from "@/lib/utils";
import OfferedCourses from "./offered-courses";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function DashboardTabs() {
    const storedAuthData = getStoredAuthData();
    const id = storedAuthData.id;
    const authToken = storedAuthData.data.data?.[0]?.["access_token"] || "";

    const [params] = useSearchParams();
    const query = params.get("tab");
    const location = useLocation();
    const navigate = useNavigate();

    function navigateTo(tab: string, catalogue?: string) {
        const newParams = new URLSearchParams(params);
        newParams.set("tab", tab);
        if (catalogue) {
            newParams.set("catalogue", "all");
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
            <Tabs defaultValue={query || "grades"} className="">
                <TabsList className="mb-4">
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