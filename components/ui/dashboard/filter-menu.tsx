import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronsUpDown, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { Course } from "@/lib/definition";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterMenuProps {
    courses: Course[];
    optionStates: { [key: string]: boolean };
    updateOptionState: (option: string, state: boolean) => void;
}

export default function FilterMenu({ courses, optionStates, updateOptionState }: FilterMenuProps) {
    const [courseCatalogues, setCourseCatalogues] = useState<string[]>([]);
    const [courseGroups, setCourseGroups] = useState<string[]>([]);
    const [courseCategories, setCourseCategories] = useState<string[]>([]);
    const [courseTypes, setCourseTypes] = useState<string[]>([]);

    useEffect(() => {
        const newCourseCatalogues: { [key: string]: number } = {};
        const newCourseGroups: { [key: string]: number } = {};
        const newCourseCategories: { [key: string]: number } = {};
        const newCourseTypes: { [key: string]: number } = {};
        courses.forEach(course => {
            newCourseCatalogues[course.catalogue] = 0;
            newCourseGroups[course.group] = 0;
            newCourseCategories[course.category] = 0;
            newCourseTypes[course.type] = 0;
        });
        setCourseCatalogues(Object.keys(newCourseCatalogues).filter(item => item.trim().length > 0));
        setCourseGroups(Object.keys(newCourseGroups).filter(item => item.trim().length > 0));
        setCourseCategories(Object.keys(newCourseCategories).filter(item => item.trim().length > 0));
        setCourseTypes(Object.keys(newCourseTypes).filter(item => item.trim().length > 0));
    }, [courses]);

    return (
        <Sheet>
            <SheetTrigger><Filter /></SheetTrigger>
            <SheetContent>
                <ScrollArea className="mt-4 w-full h-[calc(100vh-4rem)]">
                    <div className="flex flex-col gap-8">
                        <Button
                            variant="outline"
                            className="w-fit disabled:bg-muted"
                            disabled={Object.values(optionStates).every(state => !state)}
                            onClick={() => updateOptionState("Clear", false)}
                        >
                            Clear All
                        </Button>
                        <FilterCategory
                            title="Catalogue"
                            options={courseCatalogues}
                            optionStates={optionStates}
                            updateOptionState={updateOptionState}
                        />
                        <FilterCategory
                            title="Group"
                            options={courseGroups}
                            optionStates={optionStates}
                            updateOptionState={updateOptionState}
                        />
                        <FilterCategory
                            title="Category"
                            options={courseCategories}
                            optionStates={optionStates}
                            updateOptionState={updateOptionState}
                        />
                        <FilterCategory
                            title="Type"
                            options={courseTypes}
                            optionStates={optionStates}
                            updateOptionState={updateOptionState}
                        />
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

interface FilterCategoryProps {
    title: string;
    options: string[];
    optionStates: { [key: string]: boolean };
    updateOptionState: (option: string, state: boolean) => void;
}

function FilterCategory({ title, options, optionStates, updateOptionState }: FilterCategoryProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-base max-sm:text-sm font-semibold">
                    {title}
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <Separator className="mt-2" />
            <CollapsibleContent>
                <div className="flex flex-col gap-2 mt-4">
                    {
                        options.map((opt, idx) =>
                            <div key={title + idx} className="flex space-x-2 h-8">
                                <Checkbox
                                    id={opt}
                                    checked={optionStates[opt]}
                                    onCheckedChange={() => updateOptionState(opt, !optionStates[opt])}
                                />
                                <label
                                    htmlFor={opt}
                                    className="text-base max-sm:text-xs font-medium leading-none text-clip"
                                >
                                    {opt}
                                </label>
                            </div>
                        )
                    }
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}