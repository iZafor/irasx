import DashboardTabs from "./components/dashboard/dashboard-tabs";
import UserMenu from "./components/dashboard/user-menu";
import { ModeToggle } from "./components/mode-toggle";

export default function Dashboard() {
    return (
        <>
            <div className="w-full h-[3rem] flex items-center justify-end pr-4 mt-4">
                <UserMenu />
                <ModeToggle />
            </div>
            <div className="mt-4 w-full px-[10rem]">
                <DashboardTabs />
            </div>
        </>
    );
}