import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch event data from API
        fetch("http://localhost:5050/api/events")
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch((err) => console.error("Error fetching events:", err));
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/member/event/${id}`); // Navigate to the detailed page
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>CCA Event List ( Public )</h3>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search events by title"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Event List */}
            <div className="event-list">
                {filteredEvents.map((event) => (
                    <div
                        className="event-card"
                        key={event._id}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleCardClick(event._id)}
                    >
                        <div>
                            <div className="event-info">
                                <h3 className="event-title">{event.title}</h3>
                            </div>
                            <img
                                src={event.image}
                                className="event-image"
                                alt={event.title}
                                onError={(e) => (e.target.src = "/assets/NoImage.jpg")}
                            />
                            <div className="event-info">
                                <p className="event-location">
                                    <b>Location:</b> {event.location}
                                </p>
                                <p className="event-date">
                                    <b>Date:</b> {event.date}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
