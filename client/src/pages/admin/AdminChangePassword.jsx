import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../index.css";

const AdminChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const adminEmail = sessionStorage.getItem("adminEmail");

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle password update
    const handleUpdatePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5050/api/admin/change-password`,
                {
                    email: adminEmail,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }
            );
            setMessage(response.data.message);
            setTimeout(() => navigate("/admin/profile"), 2000); // Redirect after success
        } catch (error) {
            setMessage(
                error.response?.data?.error || "Failed to update password."
            );
        }
    };

    return (
        <div className="profile-container">
            <h2>Change Password</h2>

            <div className="admin-form-group">
                <label>Current Password</label>
                <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="admin-form-group">
                <label>New Password</label>
                <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="admin-form-group">
                <label>Confirm New Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-actions">
                <button onClick={handleUpdatePassword} className="sign-in-btn">
                    Update Password
                </button>
            </div>

            {message && <p className="success-message">{message}</p>}
        </div>
    );
};

export default AdminChangePassword;
