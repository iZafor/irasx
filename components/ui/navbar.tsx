"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/actions";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="flex items-center justify-end gap-2 h-16 px-2 max-sm:px-[.6rem]">
            {pathname === "/dashboard" && (
                <form action={logoutUser}>
                    <Button type="submit" size="icon" variant="outline">
                        <LogOut />
                    </Button>
                </form>
            )}
            <ThemeToggle />
        </header>
    );
}
