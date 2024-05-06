import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Grades from "./grades";
import { getStoredAuthData } from "@/lib/utils";
import OfferedCourses from "./offered-courses";

export default function DashboardTabs() {
    const storedAuthData = getStoredAuthData();
    const id = storedAuthData.id;
    const authToken = storedAuthData.data.data?.[0]?.["access_token"] || "";

    return (
        <Tabs defaultValue="grades" className="w-[70rem]">
            <TabsList className="mb-4">
                <TabsTrigger value="grades">Grades</TabsTrigger>
                <TabsTrigger value="courses">Offered Courses</TabsTrigger>
            </TabsList>
            <TabsContent value="grades">
                <Grades
                    id={id}
                    authToken={authToken}
                />
            </TabsContent>
            <TabsContent value="courses">
                <OfferedCourses
                    id={id}
                    authToken={authToken}
                />
            </TabsContent>
        </Tabs>
    );
}