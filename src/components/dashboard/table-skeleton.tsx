import { Skeleton } from "@/components/ui/skeleton"
import { arrayOfSize } from "@/lib/utils";

export default function TableSkeleton() {
    return (
        <div className="p-4 h-[35rem] space-y-2">
            {
                arrayOfSize(13).map((_, idx) => (
                    <Skeleton key={idx} className="h-[2rem] rounded" />
                ))
            }
        </div>
    );
}