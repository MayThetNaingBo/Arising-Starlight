import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminAddMember() {
    const [formData, setFormData] = useState({
        name: "",
        school: "",
        email: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://${import.meta.env.VITE_API_URL}/api/members/add",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Show success alert box
            alert(response.data.message);

            // Redirect after success
            setTimeout(() => navigate("/admin/home"), 2000);
        } catch (error) {
            // Show error alert box
            alert(
                error.response?.data?.message || "Failed to add member."
            );
        }
    };

    return (
        <div className="container mt-4">
            <h3>Add New Member</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter member name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label> School
                    </label>
                    <select
                        id="school"
                        name="school"
                        className="form-control"
                        value={formData.school}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Member School</option>
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
                <div className="form-group">
                    <label>TP Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Member TP email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-warning mt-3">
                    Add 
                </button>
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
