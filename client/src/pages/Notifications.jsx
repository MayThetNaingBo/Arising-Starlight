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

 const handleNotificationClick = async (notification) => {
  try {
    // Admin notification: only navigate, do NOT mark as read here
    if (notification.type === "REGISTRATION_REQUEST" && notification.eventId) {
      navigate(`/admin/event/${notification.eventId}/requests`);
      return;
    }

    // Member notifications: mark as read when clicked
    if (
      notification.type === "REGISTRATION_APPROVED" ||
      notification.type === "REGISTRATION_REJECTED" ||
      notification.type === "EVENT_ASSIGNED"
    ) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/${notification._id}/read`,
        { method: "PUT" }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, isRead: true } : item
        )
      );

      window.dispatchEvent(new Event("notificationRead"));

      if (notification.eventId) {
        navigate(`/member/event/${notification.eventId}`);
      } else {
        navigate("/member/events");
      }
    }
  } catch (error) {
    console.error("Failed to handle notification click:", error);
  }
};

  return (
    <div className="container mt-4">
      <h3>Notifications</h3>

      {notifications.length === 0 ? (
        <p className="mt-4 text-center">No notifications yet.</p>
      ) : (
        <div className="mt-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="card mb-3 shadow-sm"
              style={{
                cursor: "pointer",
                borderLeft: notification.isRead
                  ? "5px solid #ccc"
                  : "5px solid #f7b500",
                opacity: notification.isRead ? 0.7 : 1,
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="card-body">
                <p className="mb-1">{notification.message}</p>
                <small className="text-muted">
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}