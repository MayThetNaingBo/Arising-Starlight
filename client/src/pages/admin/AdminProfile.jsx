import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminProfile() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    // Eye toggle states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Get admin email from localStorage
    const adminEmail = localStorage.getItem("adminEmail"); // Admin email stored during login

    // Redirect to login if no admin email
    if (!adminEmail) {
        navigate("/adminAuth");
    }

    // Handle Change Password
    const handleChangePassword = async () => {
        // Basic validation for empty fields
        if (!currentPassword || !newPassword) {
            alert("Both current and new passwords are required.");
            return;
        }

        try {
            const response = await axios.put(
                "http://localhost:5050/api/admin/change-password",
                {
                    email: adminEmail, // Use email from localStorage
                    currentPassword,
                    newPassword,
                }
            );

            alert(response.data.message); // Success alert
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to change password.");
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Admin Profile</h1>

            {/* Display Admin Email */}
            <div className="profile-info mb-4">
                <h4>Email</h4>
                <p>{adminEmail || "No email found"}</p>
            </div>
            {/* Password Change Section */}
            <div className="password-section mt-4">
             
                <div className="form-group mb-3">
                    <label>Current Password</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={{ paddingRight: "30px" }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                            }
                        >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <div className="form-group mb-3">
                    <label>New Password</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ paddingRight: "30px" }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                            }}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <button
                    className="btn btn-warning"
                    onClick={handleChangePassword}
                >
                    Change Password
                </button>
            </div>
        </div>
    );
}
