import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminNavAuth.css";

export default function AdminNavBar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
  const fetchUnreadCount = async () => {
    try {
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/unread-count?role=${role}&userId=${userId}`
      );

      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
    }
  };

  fetchUnreadCount();

  window.addEventListener("notificationRead", fetchUnreadCount);

  return () => {
    window.removeEventListener("notificationRead", fetchUnreadCount);
  };
}, []);
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <nav className="admin-navbar">
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/admin/home" className="nav-link">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/about" className="nav-link">
            <i className="fas fa-info-circle"></i>
            <span>About</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/contactus" className="nav-link">
            <i className="fas fa-envelope"></i>
            <span>Feedback</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/events" className="nav-link">
            <i className="fas fa-calendar-alt"></i>
            <span>Events</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/profile" className="nav-link">
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </Link>
        </li>

        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link btn-logout">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>

      <div className="notifications-item">
        <Link to="/admin/notifications" className="nav-link notification-link">
          <i className="fas fa-bell"></i>

          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}