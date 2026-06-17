import React, { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";

export default function SelectMembers() {
    const { id } = useParams(); // Event ID from the URL
    const [members, setMembers] = useState([]);
    const [addedMembers, setAddedMembers] = useState(new Set()); // Track added members
    const navigate = useNavigate(); // Initialize navigate
    // Fetch all members and event members
    useEffect(() => {
        // Fetch all members
        fetch("${import.meta.env.VITE_API_URL}/api/members")
            .then((res) => res.json())
            .then((data) => setMembers(data))
            .catch((err) => console.error("Error fetching members:", err));

        // Fetch event members
        fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}/members`)
            .then((res) => res.json())
            .then((data) => {
                const addedIds = new Set(data.map((member) => member._id)); // Store added member IDs
                setAddedMembers(addedIds);
            })
            .catch((err) =>
                console.error("Error fetching event members:", err)
            );
    }, [id]);

    // Add member to the event
    const handleAddMember = async (memberId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/events/${id}/add-member`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ memberId }),
                }
            );

            if (response.ok) {
                alert("Member added successfully!");
                setAddedMembers((prev) => new Set(prev).add(memberId)); // Update added members
            } else {
                const data = await response.json();
                alert(data.error || "Failed to add member.");
            }
        } catch (err) {
            console.error("Error adding member:", err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Select Members for Event</h3>
            <br></br>
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
                    {members.map((member) => (
                        <tr key={member._id}>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.school}</td>
                            <td>
                                {addedMembers.has(member._id) ? (
                                    <button
                                        className="btn btn-secondary"
                                        disabled
                                    >
                                        Added
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            handleAddMember(member._id)
                                        }
                                        className="btn btn-warning"
                                    >
                                        Add
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
<br></br>
            <button
                className="btn btn-warning"
                onClick={() => navigate(`/admin/event/${id}/members`)}
            >
                Back to Added Members
            </button>
        </div>
    );
}
