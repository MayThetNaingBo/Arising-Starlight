import { Outlet } from "react-router-dom";
import AdminNavBar from "./AdminNav";

export default function AdminLayout() {
    return (
        <>
            <AdminNavBar />
            <Outlet />
        </>
    );
}
