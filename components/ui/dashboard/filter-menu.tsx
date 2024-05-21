import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";

export default function FilterMenu() {
    return (
        <Sheet>
            <SheetTrigger><Filter /></SheetTrigger>
            <SheetContent>
            </SheetContent>
        </Sheet>
    );
}
