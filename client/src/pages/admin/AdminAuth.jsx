import React, { useState } from "react";
import axios from "axios";
import "./AdminNavAuth.css"; // Ensure the CSS file is styled for AdminAuth
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminSignIn = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the credentials to the backend for authentication
            const response = await axios.post(
                "http://localhost:5050/api/admin/signin",
                formData
            );

            const { role } = response.data;

            // Redirect based on the role
            if (role === "admin") {
                localStorage.setItem("userId", response.data.userId); // Save user ID
                localStorage.setItem("role", role); // Save role
                localStorage.setItem("adminEmail", formData.email); // Save email

                // Navigate to admin home
                navigate("/admin/home");
            } else {
                // Show alert for role mismatch
                alert("Access denied. Admin role required.");
            }
        } catch (error) {
            // Show alert for login failure
            alert(
                error.response?.data?.error ||
                    "Login failed. Please check your credentials and try again."
            );
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="admin-auth-container"
            style={{ backgroundImage: `url('/assets/Auth.jpg')` }}
        >
            <div className="admin-auth-box">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="admin-auth-form">
                        <label htmlFor="email">Admin Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Admin Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="password">Admin Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={togglePasswordVisibility}
                                role="button"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button type="submit" className="sign-in-btn">
                            Sign In
                        </button>
                    </div>
                </form>
                <div className="admin-auth-footer">
                    <a href="/" className="sign-in-admin-link">
                        Forgot Password ?
                    </a>
                    <a href="/memberAuth" className="sign-in-admin-link">
                        Sign In As Member
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminSignIn;
