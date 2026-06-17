import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetails.css"; // Make sure this file is in your project

export default function EventDetails() {
    const { id } = useParams(); // Get the event ID from the URL
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    useEffect(() => {
        // Fetch event details by ID
        fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`)
            .then((res) => res.json())
            .then((data) => setEvent(data))
            .catch((err) => console.error("Error fetching event:", err));
    }, [id]);

    if (!event) {
        return <p>Loading event details...</p>;
    }

    return (
        <div className="container mt-4">
            <div className="event-details">
                <div className="event-left">
                    <h3 className="event-title">{event.title}</h3>
                    <img
                        src={event.image}
                        alt={event.title}
                        className="event-image"
                        onError={(e) => (e.target.src = "/assets/NoImage.jpg")}
                    />
                    <button
                        className="btn btn-warning view-members-btn"
                        onClick={() => navigate(`/admin/event/${id}/members`)}
                    >
                        View Members
                    </button>
                </div>
                <div className="event-right">
                    <p className="event-location">
                        <b>Location:</b> {event.location}
                    </p>
                    <p className="event-date">
                        <b>Date:</b> {event.date}
                    </p>
                    <p className="event-description">
                        <b>Description:</b> {event.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
