import DashboardTabs from "./components/dashboard/dashboard-tabs";
import UserMenu from "./components/dashboard/user-menu";
import { ModeToggle } from "./components/mode-toggle";

export default function Dashboard() {
    return (
        <>
            <div className="w-full h-[3rem] flex items-center justify-end pr-7 mt-4">
                <UserMenu />
                <ModeToggle />
            </div>
            <div className="mt-4 w-full 2xl:px-[10rem] xl:px-[6rem] px-[2rem]">
                <DashboardTabs />
            </div>
        </>
    );
}