"use client";

import { ThemeToggle } from "../theme-toggle";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { STORED_AUTH_DATA_KEY } from "@/lib/definition";
import { LogOut } from "lucide-react";
import { Button } from "../button";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem(STORED_AUTH_DATA_KEY);
        router.push("/");
    }

    return (
        <header className="flex items-center justify-end gap-2 h-16 px-2 max-sm:px-[.6rem]">
            {pathname === "/dashboard" && (
                <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={handleLogout}
                >
                    <LogOut />
                </Button>
            )}
            <ThemeToggle />
        </header>
    );
}
