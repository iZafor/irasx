import OfferedCourses from "@/components/ui/dashboard/offered-courses";
import OfferedCoursesSkeleton from "@/components/ui/dashboard/offered-courses-skeleton";
import RegisteredCourses from "@/components/ui/dashboard/registered-courses";
import StudentInfo from "@/components/ui/dashboard/student-info";
import { Suspense } from "react";

export default function Dashboard() {
    return (
        <div className="w-full flex justify-center">
            <div className="w-[45rem] md:w-[84%] max-md:w-[40rem] max-sm:w-[94%] space-y-4">
                {/* Student Info */}
                <StudentInfo />

                {/* Registered Courses */}
                <RegisteredCourses />

                {/* Offered Courses */}
                <Suspense fallback={<OfferedCoursesSkeleton />}>
                    <OfferedCourses />
                </Suspense>
            </div>
        </div>
    );
}
