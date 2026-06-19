import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RegistrationRequests() {
  const { id } = useParams();
  const [eventTitle, setEventTitle] = useState("");
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/events/${id}/requests`
    );
    const data = await res.json();

    setEventTitle(data.eventTitle || "");
    setRequests(Array.isArray(data.requests) ? data.requests : []);
  };

  useEffect(() => {
    fetchRequests();
  }, [id]);

  const handleApprove = async (userId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}/approve-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    fetchRequests();
    window.dispatchEvent(new Event("notificationRead"));
  };

  const handleReject = async (userId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}/reject-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    fetchRequests();
    window.dispatchEvent(new Event("notificationRead"));
  };

  return (
    <div className="container mt-4">
      <h3>Registration Requests</h3>
      <h5 className="mt-2 mb-4">Event: {eventTitle}</h5>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>School</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No registration requests.
              </td>
            </tr>
          ) : (
            requests.map((request) => {
              const member = request.member;

              return (
                <tr key={request._id}>
                  <td>{member?.name}</td>
                  <td>{member?.email}</td>
                  <td>{member?.school}</td>
                  <td>
                    {request.status === "PENDING" && (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                    {request.status === "APPROVED" && (
                      <span className="badge bg-success">Approved</span>
                    )}
                    {request.status === "REJECTED" && (
                      <span className="badge bg-danger">Rejected</span>
                    )}
                  </td>
                  <td>
                    {request.status === "PENDING" ? (
                      <>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => handleApprove(member._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(member._id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : request.status === "APPROVED" ? (
                      <button className="btn btn-secondary" disabled>
                        Approved
                      </button>
                    ) : (
                      <button className="btn btn-secondary" disabled>
                        Rejected
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}