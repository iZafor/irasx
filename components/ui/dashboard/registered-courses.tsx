import { getRegisteredCourses } from "@/lib/apis";
import { formatRegisteredCoursesPerYear } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisteredCoursesTable from "./registered-courses-table";

export default async function RegisteredCourses() {
    const response = await getRegisteredCourses();
    const registeredCourses = formatRegisteredCoursesPerYear(response.data);

    return (
        <Card>
            <CardHeader>
                <CardTitle>REGISTERED COURSES</CardTitle>
            </CardHeader>
            <CardContent>
                <RegisteredCoursesTable registeredCourses={registeredCourses} />
            </CardContent>
        </Card>
    );
}
