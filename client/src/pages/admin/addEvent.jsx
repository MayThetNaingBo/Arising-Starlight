import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddEvent() {
    const navigate = useNavigate(); // To redirect after adding an event
    const [event, setEvent] = useState({
        title: "",
        location: "",
        date: "",
        description: "",
        image: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch("http://localhost:5050/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(event),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to add event");
            }

            const result = await response.json();
            setMessage(result.message);
            navigate("/admin/events"); // Redirect to events list page
        } catch (error) {
            console.error("Error adding event:", error.message);
            setError("Failed to add event. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Add New Event</h3>
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
                        placeholder="Enter Event Title"
                        required
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
                        placeholder="Enter Event Location"
                        required
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
                        value={event.date}
                        onChange={handleChange}
                        required
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
                        value={event.description}
                        onChange={handleChange}
                        placeholder="Enter Event Description"
                        rows="4"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                        Image URL
                    </label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        className="form-control"
                        value={event.image}
                        onChange={handleChange}
                        placeholder="Enter Image URL"
                       
                    />
                </div>
                <br></br>
                <button type="submit" className="btn btn-warning mb-3 ">
                    Add 
                </button>
                <button
                    className="btn btn-danger mb-3 ms-3"
                    onClick={() => navigate("/admin/events")}
                >
                    Cancel
                </button>
                {message && <p className="mt-3 text-success">{message}</p>}
                {/* {error && <p className="mt-3 text-danger">{error}</p>} */}
            </form>
        </div>
    );
}
