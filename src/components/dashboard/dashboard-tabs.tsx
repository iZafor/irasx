import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardTabs() {
    return (
        <Tabs defaultValue="grades" className="w-[55rem]">
            <TabsList className="mb-4">
                <TabsTrigger value="grades">Grades</TabsTrigger>
                <TabsTrigger value="courses">Offered Courses</TabsTrigger>
            </TabsList>
        </Tabs>
    );
}