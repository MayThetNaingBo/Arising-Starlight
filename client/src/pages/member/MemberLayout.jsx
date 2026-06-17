import { Outlet } from "react-router-dom";
import MemberNavBar from "./MemberNavBar";

export default function MemberLayout() {
    return (
        <>
            <MemberNavBar />
            <Outlet />
        </>
    );
}
