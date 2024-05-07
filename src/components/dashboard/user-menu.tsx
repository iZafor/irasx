import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { STORED_AUTH_DATA_KEY } from "@/lib/definition";
import { getStoredAuthData } from "@/lib/utils";
import { User } from "lucide-react";

export default function UserMenu() {
    const navigate = useNavigate();
    const authData = getStoredAuthData();

    function handleLogout() {
        localStorage.removeItem(STORED_AUTH_DATA_KEY);
        navigate("/", { replace: true });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-0">
                <Avatar className="mr-2">
                    <AvatarImage src={`https://iras.iub.edu.bd:8079/photo/${authData.id}.jpg`} />
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

