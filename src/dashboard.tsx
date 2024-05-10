import DashboardTabs from "./components/dashboard/dashboard-tabs";
import UserMenu from "./components/dashboard/user-menu";
import { ModeToggle } from "./components/mode-toggle";
import { useLoaderData } from "react-router-dom";
import { StoredAuthData } from "./lib/definition";

export default function Dashboard() {
    const authData = useLoaderData() as StoredAuthData;

    return (
        <>
            <div className="w-full h-[3rem] flex items-center justify-end pr-7 mt-4">
                <UserMenu authData={authData} />
                <ModeToggle />
            </div>
            <div className="mt-4 w-full 2xl:px-[10rem] xl:px-[6rem] px-[2rem]">
                <DashboardTabs authData={authData} />
            </div>
        </>
    );
}