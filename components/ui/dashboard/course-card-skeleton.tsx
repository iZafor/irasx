import { Skeleton } from "@/components/ui/skeleton";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CourseCardSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl mb-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md bg-background dark:bg-primary/10" />
                        <Skeleton className="h-8 w-40 rounded-md bg-background dark:bg-primary/10" />
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md bg-background dark:bg-primary/10" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24 max-xs:w-[5rem] rounded-md" />
                        <Skeleton className="h-6 w-32 max-xs:w-[7rem] rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}