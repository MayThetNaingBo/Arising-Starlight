// Notifications.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const url =
          role === "admin"
            ? `${import.meta.env.VITE_API_URL}/api/notifications/admin`
            : `${import.meta.env.VITE_API_URL}/api/notifications/member/${userId}`;

        const res = await fetch(url);
        const data = await res.json();

        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [role, userId]);

  return (
    <div
  key={notification._id}
  className="card mb-3 shadow-sm"
  style={{
    cursor: "pointer",
    borderLeft: notification.isRead
      ? "5px solid #ccc"
      : "5px solid #f7b500",
  }}
  onClick={() => {
    if (notification.type === "REGISTRATION_REQUEST") {
      navigate("/admin/events");
    }
  }}
></div>
  );
}