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

    function setParam(value: string) {
        const newParams = new URLSearchParams(params);
        newParams.set("tab", value);
        const newPath = `${location.pathname}?${newParams.toString()}`;
        navigate(newPath);
    }

    useEffect(() => {
        if (!query) {
            setParam("grades");
        }
    }, []);

    return (
        <>
            <Tabs defaultValue={query || "grades"} className="w-[70rem]">
                <TabsList className="mb-4">
                    <TabsTrigger value="grades" onClick={() => setParam("grades")}>Grades</TabsTrigger>
                    <TabsTrigger value="courses" onClick={() => setParam("courses")}>Offered Courses</TabsTrigger>
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