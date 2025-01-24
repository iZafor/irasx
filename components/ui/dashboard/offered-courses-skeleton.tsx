import { Skeleton } from "@/components/ui/skeleton";

export default function OfferedCoursesSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, idx) => (
                <Skeleton key={"ofc-" + idx} className="h-10" />
            ))}
        </div>
    );
}
