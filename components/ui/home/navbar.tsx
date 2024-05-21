"use client";

import { ThemeToggle } from "../theme-toggle";
import UserMenu from "./user-menu";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="flex items-center justify-end h-16 px-4">
            {pathname === "/dashboard" && <UserMenu />}
            <ThemeToggle />
        </header>
    );
}