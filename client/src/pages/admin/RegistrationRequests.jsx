import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RegistrationRequests() {
    const { id } = useParams();
    const navigate = useNavigate(); // Add navigate
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5050/api/events/${id}/requests`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Requests:", data);
                setRequests(Array.isArray(data) ? data : []); // Handle empty or invalid response
            })
            .catch((err) => console.error("Error fetching requests:", err));
    }, [id]);

    const handleApprove = async (memberId) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("You must be logged in as an admin to approve requests.");
                return;
            }

            console.log("Admin ID:", userId);
            console.log("Approving Member ID:", memberId);

            // Approve request and add member to the event
            const response = await fetch(
                `http://localhost:5050/api/events/${id}/approve-request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: memberId }), // Send memberId for processing
                }
            );

            const result = await response.json();
            console.log("Approval Response:", result);

            if (!response.ok) {
                throw new Error(result.error || "Failed to approve request.");
            }

            // Update UI after approval by removing the member from requests
            setRequests(requests.filter((req) => req._id !== memberId));
            alert("Member approved and added to the event!");

            // Navigate back to Members List to see the update
            navigate(`/admin/event/${id}/members`);
        } catch (err) {
            console.error("Error approving request:", err);
            alert("Failed to approve member. Please try again.");
        }
    };

    const handleReject = async (userId) => {
        try {
            const res = await fetch(
                `http://localhost:5050/api/events/${id}/reject-request`, // Changed from DELETE to POST
                {
                    method: "POST", // Fix HTTP method
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                }
            );

            if (!res.ok) throw new Error("Failed to reject request");

            setRequests(requests.filter((req) => req._id !== userId));
        } catch (err) {
            console.error("Error rejecting request:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Registration Requests</h3>
            <br></br>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>School</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length > 0 ? (
                        requests.map((req) => (
                            <tr key={req._id}>
                                <td>{req.name}</td>
                                <td>{req.email}</td>
                                <td>{req.school}</td>
                                <td>
                                    <button
                                        className="btn btn-warning mx-2"
                                        onClick={() => handleApprove(req._id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleReject(req._id)}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No registration requests.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
