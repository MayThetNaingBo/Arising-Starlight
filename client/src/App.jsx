import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/user/About";
import ContactUs from "./pages/user/ContactUs";
import Layout from "./pages/user/Layout";
import Public_Members from "./pages/user/Public_Members";
import Public_Events from "./pages/user/Public_Events";
import Authentication from "./pages/Auth";
import AdminAuth from "./pages/admin/AdminAuth";
import MemberAuth from "./pages/member/MemberAuth";
import MemberLayout from "./pages/member/MemberLayout";
import MemberHome from "./pages/member/MemberHome";
import MemberProfile from "./pages/member/MemberProfile";
import MemberEvents from "./pages/member/MemberEvents";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAbout from "./pages/admin/AdminAbout";
import FeedbackAdmin from "./pages/admin/AdminContactUs";
import EditMember from "./pages/admin/editMember";
import AdminAddMember from "./pages/admin/addMember";
import AddEvent from "./pages/admin/addEvent";
import EditEvent from "./pages/admin/editEvent";
import EventDetails from "./pages/admin/EventDetails";
import MemberEventDetails from "./pages/member/MemberEventDetails";
import AdminChangePassword from "./pages/admin/AdminChangePassword";
import CreatePassword from "./pages/member/CreatePassword";
import MemberIndividualEvents from "./pages/member/Events";
import SelectMembers from "./pages/admin/selectmembers";
import MemberContactUs from "./pages/member/MemberContactUs";

// New components for managing event members
import EventMembers from "./pages/admin/Eventmembers";

import RegistrationRequests from "./pages/admin/RegistrationRequests";

const routes = [
    {
        path: "/create-password",
        element: <CreatePassword />,
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/about", element: <About /> },
            { path: "/contactus", element: <ContactUs /> },
            { path: "/members", element: <Public_Members /> },
            { path: "/events", element: <Public_Events /> },
        ],
    },
    { path: "/authentication", element: <Authentication /> },
    { path: "/adminAuth", element: <AdminAuth /> },
    { path: "/memberAuth", element: <MemberAuth /> },
    {
        path: "/member",
        element: <MemberLayout />,
        children: [
            { path: "/member/home", element: <MemberHome /> },
            { path: "/member/profile", element: <MemberProfile /> },
            { path: "/member/events", element: <MemberEvents /> },
            { path: "/member/about", element: <About /> },
            { path: "/member/contactus", element: <MemberContactUs /> },
            { path: "/member/event/:id", element: <MemberEventDetails /> },
            { path: "/member/individual/events", element: <MemberIndividualEvents /> },
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { path: "/admin/home", element: <AdminHome /> },
            { path: "/admin/profile", element: <AdminProfile /> },
            { path: "/admin/events", element: <AdminEvents /> },
            { path: "/admin/about", element: <AdminAbout /> },
            { path: "/admin/contactus", element: <FeedbackAdmin /> },
            { path: "/admin/add", element: <AdminAddMember /> },
            { path: "/admin/edit/:id", element: <EditMember /> },
            { path: "/admin/add/event", element: <AddEvent /> },
            { path: "/admin/edit/event/:id", element: <EditEvent /> },
            { path: "/admin/event/:id", element: <EventDetails /> },
            { path: "/admin/change-password", element: <AdminChangePassword /> },

            // New routes for managing event members
            { path: "/admin/event/:id/members", element: <EventMembers /> }, // View members for the event
            { path: "/admin/event/:id/select-members", element:<SelectMembers />}, // Add members to the event
            { path: "/admin/event/:id/requests", element: <RegistrationRequests /> },

        ],
    },
];

const router = createBrowserRouter(routes);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
