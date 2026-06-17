import React, { useState } from "react";
import axios from "axios";
import "./MemAuth.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

export default function MemberAuth() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted!");
        console.log("Form Data:", formData);

        // Normalize email before sending
        const normalizedData = {
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
        };

        console.log("Sending Data to Backend:", normalizedData);

        try {
            // Make POST request to the backend
            const response = await axios.post(
                "http://localhost:5050/api/member/signin",
                normalizedData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response from Backend:", response.data);

            // Extract user ID and role from the response
            const { role, userId } = response.data;

            if (role === "member") {
                // Store user ID and role in session storage
                localStorage.setItem("userId", userId);
                localStorage.setItem("role", role);
                localStorage.setItem("loggedInEmail", normalizedData.email); // Optional

                navigate("/member/home");
            } else {
                setErrorMessage("Access denied. Member role required.");
            }
        } catch (error) {
            console.error(
                "Error in Sign-In:",
                error.response?.data || error.message
            );

            // Alert with two sentences
            alert("Sign-in Failed.\nInvalid Email or Password.");
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="member-auth-container"
            style={{ backgroundImage: `url('/assets/Auth.jpg')` }}
        >
            <div className="member-auth-box">
                <h2>Member Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="member-auth-form">
                        <label htmlFor="email">TP Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Student Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="password">Password</label>
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

                        {errorMessage && (
                            <p className="error-message">{errorMessage}</p>
                        )}

                        <button type="submit" className="sign-in-btn">
                            Sign In
                        </button>
                    </div>
                </form>
                <div className="member-auth-footer">
                    <a href="/members" className="view-public-link">
                        View As Public
                    </a>
                    <a href="/adminAuth" className="sign-in-admin-link">
                        Sign In As Admin
                    </a>
                </div>
            </div>
        </div>
    );
}
