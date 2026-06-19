import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MemberNavBar.css";
import Notifications from "../Notifications";

export default function MemberNavBar() {
    const navigate = useNavigate(); // For navigation after logout

    // Handle logout function
    const handleLogout = () => {
        sessionStorage.clear(); // Clear session storage
        navigate("/"); // Redirect to login page
    };

    return (
        <nav className="member-navbar">
            {/* Centered menu items */}
            <ul className="nav-menu">
                <li className="nav-item">
                    <Link to="/member/home" className="nav-link">
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/member/about" className="nav-link">
                        <i className="fas fa-info-circle"></i>
                        <span>About</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/member/contactus" className="nav-link">
                        <i className="fas fa-envelope"></i>
                        <span>Contact Us</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/member/events" className="nav-link">
                        <i className="fas fa-calendar-alt"></i>
                        <span>Events</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/member/profile" className="nav-link">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </Link>
                </li>
                <li className="nav-item">
                    {/* Logout button */}
                    <button onClick={handleLogout} className="nav-link logout-btn">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </li>
            </ul>

            {/* Notifications icon */}
            <div className="notifications-item">
               <Link to="/notifications" className="nav-link">
                    <i className="fas fa-bell"></i>
                </Link>
            </div>
        </nav>
    );
}
