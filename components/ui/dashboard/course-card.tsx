import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/lib/definition";

export default function CourseCard({ course }: { course: Course; }) {
    return (
        <Card className="w-full">
            <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl mb-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-300 dark:text-gray-400">
                            {course.courseId}
                        </div>
                        <h3 className="text-white text-xl font-bold">{course.courseTitle}</h3>
                        <div className="text-sm font-medium text-gray-300 dark:text-gray-400">
                            {course.section}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Slot</div>
                        <div>{course.timeSlot}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Vacancy</div>
                        <div>{course.vacancy}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Enrolled Students</div>
                        <div>{course.enrolled}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Faculty</div>
                        <div>{course.faculty}</div>
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Prerequisites</div>
                        <div className="flex max-md:flex-wrap gap-2">
                            {
                                course.prerequisites.map((pre, idx) =>
                                    <p
                                        key={pre.courseId + idx}
                                        className={`font-semibold ${pre.status ? "text-green-500" : "text-red-500"}`}
                                    >
                                        {pre.courseId}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Grade</div>
                        <div>{course.grade}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Credit Hours</div>
                        <div>{course.creditHour}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Group</div>
                        <div>{course.group}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Catalogue</div>
                        <div>{course.catalogue}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</div>
                        <div>{course.category}</div>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Type</div>
                    <div>{course.type}</div>
                </div>
            </CardContent>
        </Card>
    );
}