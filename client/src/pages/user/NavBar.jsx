import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./box.css";

export default function NavBar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
        console.log("Dropdown visible:", dropdownVisible);
    };
    return (
        <nav className="member-navbar">
            {/* Centered menu items */}
            <ul className="nav-menu">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/about" className="nav-link">
                        <i className="fas fa-info-circle"></i>
                        <span>About</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/contactus" className="nav-link">
                        <i className="fas fa-envelope"></i>
                        <span>Contact Us</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/events" className="nav-link">
                        <i className="fas fa-calendar-alt"></i>
                        <span>Events</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/authentication" className="nav-link">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </Link>
                </li>
               
            </ul>
        </nav>
    );
}

