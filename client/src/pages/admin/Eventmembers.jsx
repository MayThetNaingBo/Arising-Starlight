import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EventMembers() {
    const { id } = useParams(); // Event ID from URL
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [eventTitle, setEventTitle] = useState(""); // To store event title

    useEffect(() => {
        // Fetch event details
        fetch(`http://localhost:5050/api/events/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setEventTitle(data.title); // Set event title
    
                // Fetch members using 'populate'
                fetch(`http://localhost:5050/api/events/${id}/members`)
                    .then((res) => res.json())
                    .then((members) => setMembers(members)) // Set members
                    .catch((err) =>
                        console.error("Error fetching event members:", err)
                    );
            })
            .catch((err) =>
                console.error("Error fetching event details:", err)
            );
    }, [id]);
    
    const handleApprove = async (memberId) => {
        try {
            const response = await fetch(
                `http://localhost:5050/api/events/${id}/approve-request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: memberId }),
                }
            );
    
            if (response.ok) {
                alert("Member approved and added!");
                // Refresh members list immediately
                fetch(`http://localhost:5050/api/events/${id}/members`)
                    .then((res) => res.json())
                    .then((data) => setMembers(data))
                    .catch((err) =>
                        console.error("Error fetching updated members:", err)
                    );
            } else {
                alert("Failed to approve member.");
            }
        } catch (err) {
            console.error("Error approving member:", err);
            alert("Server error. Try again.");
        }
    };
    
    // Remove a member from the event
    const handleRemoveMember = async (memberId) => {
        const confirmRemove = window.confirm(
            "Are you sure you want to remove this member?"
        );
        if (!confirmRemove) return;

        try {
            const response = await fetch(
                `http://localhost:5050/api/events/${id}/remove-member/${memberId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Member removed successfully!");
                // Update the members list after removal
                setMembers((prev) =>
                    prev.filter((member) => member._id !== memberId)
                );
            } else {
                alert(data.error || "Failed to remove member.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h3>
                Members List <span>{` { ${eventTitle} } `}</span>
            </h3>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>School</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.length > 0 ? (
                        members.map((member) => (
                            <tr key={member._id}>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.school}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleRemoveMember(member._id)
                                        }
                                        className="btn btn-danger"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No members added to this event yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br />
            <button
                className="btn btn-warning"
                onClick={() => navigate(`/admin/event/${id}/select-members`)}
            >
                Add New Members
            </button>
            <br></br>
            <br></br>
            <button
                className="btn btn-warning "
                onClick={() => navigate(`/admin/event/${id}/requests`)}
            >
                View Registration Requests
            </button>
        </div>
    );
}
