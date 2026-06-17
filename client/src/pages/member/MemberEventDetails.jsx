import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../admin/EventDetails.css";

export default function MemberEventDetails() {
    const { id } = useParams(); 
    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(""); // Use state to store dynamic user ID

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId"); // Use localStorage here
        console.log("Retrieved User ID:", storedUserId); // Debug log
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.error("User ID not found in localStorage.");
        }
        

        fetch(`http://localhost:5050/api/events/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setEvent(data);

                // Check if already registered
                if (
                    data.members.includes(storedUserId) || 
                    data.registrationRequests.includes(storedUserId)
                ) {
                    setIsRegistered(true);
                } else {
                    setIsRegistered(false);
                }
            })
            .catch((err) => console.error("Error fetching event:", err));
    }, [id]);

    const registerForEvent = async () => {
        if (!userId) {
            alert("User ID is missing. Please log in again.");
            return;
        }
    
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5050/api/events/${id}/register-request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                }
            );
    
            const data = await response.json();
            console.log("Response:", data); // Debug response
    
            if (response.ok) {
                alert("Registration request sent successfully!");
                setIsRegistered(true);
            } else {
                alert(data.error || "Failed to send registration request.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred. Please try again.");
        }
        setLoading(false);
    };
    

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
                        onClick={registerForEvent}
                        disabled={loading || isRegistered}
                    >
                        {isRegistered
                            ? "Already Registered"
                            : loading
                            ? "Registering..."
                            : "Register"}
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
