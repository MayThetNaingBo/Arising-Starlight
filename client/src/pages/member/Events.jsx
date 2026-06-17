import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MemberIndividualEvents() {
    const [events, setEvents] = useState([]); // Store events
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve member ID from local storage
        const userId = localStorage.getItem("userId");

        // If no user ID, redirect to login
        if (!userId) {
            alert("Unauthorized! Please log in first.");
            navigate("/login");
            return;
        }

        // Fetch events for the logged-in member
        fetch(`${import.meta.env.VITE_API_URL}/api/members/${userId}/events`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch events");
                }
                return res.json();
            })
            .then((data) => {
                setEvents(data); // Store the fetched events
            })
            .catch((err) => {
                console.error("Error fetching events:", err);
                alert("Failed to fetch events.");
            });
    }, [navigate]);

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">My Events</h1>

            {events.length > 0 ? (
                <ul className="list-group">
                    {events.map((event) => (
                        <li key={event._id} className="list-group-item">
                            <h4>{event.title}</h4>
                            <p>
                                <strong>Date:</strong> {event.date}
                            </p>
                            <p>
                                <strong>Location:</strong> {event.location}
                            </p>
                            <p> <strong>Description:</strong> {event.description}</p>
                            
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center mt-4">No events available.</p>
            )}
        </div>
    );
}
