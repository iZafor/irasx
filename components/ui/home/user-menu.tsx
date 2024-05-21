"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { STORED_AUTH_DATA_KEY } from "@/lib/definition";
import { User } from "lucide-react";
import { getStoredAuthData } from "@/lib/utils";

export default function UserMenu() {
    const authData = getStoredAuthData();
    const studentId = authData.studentId;
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem(STORED_AUTH_DATA_KEY);
        router.push("/");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Avatar className="mr-2">
                    <AvatarImage src={`https://iras.iub.edu.bd:8079/photo/${studentId}.jpg`} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

