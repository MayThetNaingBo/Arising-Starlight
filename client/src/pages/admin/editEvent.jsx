import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditEvent() {
    const { id } = useParams(); // Get the event ID from the URL
    const navigate = useNavigate(); // To redirect after update
    const [event, setEvent] = useState({
        title: "",
        location: "",
        date: "",
        description: "",
        image: "",
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch event details by ID
        fetch(`http://localhost:5050/api/events/${id}`)
            .then((res) => res.json())
            .then((data) => setEvent(data))
            .catch((err) => console.error("Error fetching event:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a copy of the event data
        const updatedEvent = { ...event };

        // Remove the image field if it's empty
        if (!updatedEvent.image) {
            delete updatedEvent.image; // Skip sending 'image' if empty
        }

        try {
            const response = await fetch(
                `http://localhost:5050/api/events/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedEvent), // Send the updated event
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update event");
            }

            const result = await response.json();
            alert(result.message); // Use alert instead of setMessage
            navigate("/admin/events"); // Redirect to events list page
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Failed to update event. Please try again."); // Use alert for errors
        }
    };

    return (
        <div className="container mt-4">
            <h3>Update Event Details</h3>
            <br></br>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={event.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="form-control"
                        value={event.location}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className="form-control"
                        value={event.date} // Ensure the value is in YYYY-MM-DD format
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        rows="4"
                        value={event.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                        Image URL
                    </label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        className="form-control"
                        value={event.image}
                        onChange={handleChange}
                    />
                </div>
                <br></br>
                <button type="submit" className="btn btn-warning mb-3">
                    Update
                </button>
                <button
                    className="btn btn-danger mb-3 ms-3"
                    onClick={() => navigate("/admin/events")}
                >
                    Cancel
                </button>
                {message && <p className="mt-3">{message}</p>}
            </form>
        </div>
    );
}
