import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal for delete confirmation
import "./AdminNavAuth.css";

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/events`)
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch((err) => console.error("Error fetching events:", err));
    }, []);

    const handleCardClick = (id) => {
        navigate(`/admin/event/${id}`); // Navigate to the detailed page
    };

    const handleDelete = async () => {
        if (!eventToDelete) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventToDelete}`, {
                method: "DELETE",
            });
            setEvents(events.filter((event) => event._id !== eventToDelete));
            setShowModal(false); // Close modal after deleting
            alert("Event deleted successfully");
        } catch (err) {
            console.error("Error deleting event:", err);
            alert("Failed to delete event. Please try again.");
        }
    };

    const handleUpdate = (id) => {
        navigate(`/admin/edit/event/${id}`); // Navigate to the update page
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>CCA Event List ( Admin View ) </h3>
                <button
                    className="btn btn-warning"
                    onClick={() => navigate("/admin/add/event")}
                >
                    Add New Event
                </button>
            </div>

            {/* Search Filter */}
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
                    >
                        <div onClick={() => handleCardClick(event._id)}>
                            <div className="event-info">
                                <h3 className="event-title">{event.title}</h3>
                            </div>
                            <img
                                src={event.image}
                                className="event-image"
                                alt={event.title}
                                onError={(e) =>
                                    (e.target.src = "/assets/NoImage.jpg")
                                }
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
                        <div className="event-actions">
                            <button
                                className="btn btn-warning"
                                onClick={() => handleUpdate(event._id)}
                            >
                                Update
                            </button>
                            <button
                                className="btn btn-danger ms-2"
                                onClick={() => {
                                    setEventToDelete(event._id);
                                    setShowModal(true);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Events Message */}
            {filteredEvents.length === 0 && (
                <div className="text-center mt-4">
                    <p>No events found matching your search criteria.</p>
                </div>
            )}

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                className="custom-modal"
            >
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title className="custom-modal-title">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
                    Are you sure you want to delete this event? This action
                    cannot be undone.
                </Modal.Body>
                <Modal.Footer className="custom-modal-footer">
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                        className="custom-cancel-button"
                    >
                        No
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        className="custom-delete-button"
                    >
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
