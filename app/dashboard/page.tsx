import OfferedCourses from "@/components/ui/dashboard/offered-courses";
import OfferedCoursesSkeleton from "@/components/ui/dashboard/offered-courses-skeleton";
import { Suspense } from "react";

export default function Dashboard() {
    return (
        <div className="w-full flex justify-center">
            {/* Offered Courses */}
            <div className="w-[45rem] md:w-[84%] max-md:w-[40rem] max-sm:w-[94%]">
                <Suspense fallback={<OfferedCoursesSkeleton />}>
                    <OfferedCourses />
                </Suspense>
            </div>
        </div>
    );
}
