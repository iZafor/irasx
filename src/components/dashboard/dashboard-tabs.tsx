import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Grades from "./grades";
import { getStoredAuthData } from "@/lib/utils";

export default function DashboardTabs() {
    const storedAuthData = getStoredAuthData();

    return (
        <Tabs defaultValue="grades" className="w-[55rem]">
            <TabsList className="mb-4">
                <TabsTrigger value="grades">Grades</TabsTrigger>
                <TabsTrigger value="courses">Offered Courses</TabsTrigger>
            </TabsList>
            <TabsContent value="grades">
                <Grades
                    id={storedAuthData.id}
                    authToken={storedAuthData.data.data?.[0]?.["access_token"] || ""}
                />
            </TabsContent>
        </Tabs>
    );
}