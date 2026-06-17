import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMember() {
    const { id } = useParams(); // Get member ID from URL
    const navigate = useNavigate(); // For redirecting
    const [member, setMember] = useState({
        name: "",
        school: "",
        email: "",
    });

    const [message, setMessage] = useState("");

    // Fetch member details by ID
    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5050/api/members/${id}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch member data.");
                }
                const data = await response.json();
                setMember(data); // Set fetched data to state
            } catch (err) {
                console.error("Error fetching member:", err);
                setMessage("Failed to load member data.");
            }
        };

        fetchMember(); // Call the function
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Update only name and school, excluding email
            const response = await fetch(
                `http://localhost:5050/api/members/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: member.name,
                        school: member.school,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update member");
            }

            const result = await response.json();
            setMessage(result.message);
            navigate("/admin/home"); // Redirect to admin home
        } catch (error) {
            console.error("Error updating member:", error);
            setMessage("Failed to update member. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Update Member Details</h3>
            <br></br>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={member.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="school" className="form-label">
                        School
                    </label>
                    <select
                        id="school"
                        name="school"
                        className="form-control"
                        value={member.school}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Member's School</option>
                        <option value="Applied Science">Applied Science</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Humanities and Social Sciences">
                            Humanities and Social Sciences
                        </option>
                        <option value="Informatics and IT">
                            Informatics and IT
                        </option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        TP Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={member.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-warning mt-3">
                    Update 
                </button>
                {message && <p className="mt-3 text-success">{message}</p>}
                <button
                    className="btn btn-danger mt-3 ms-3"
                    onClick={() => navigate("/admin/home")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
