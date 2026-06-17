import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../Auth.css";

export default function CreatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isValidToken, setIsValidToken] = useState(false);
    const [searchParams] = useSearchParams();
    
    const navigate = useNavigate();

    const token = searchParams.get("token");
    const [showPassword, setShowPassword] = useState(false);

    // Validate token on page load
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5050/api/validate-token?token=${token}`
                );
                if (response.data.valid) {
                    setIsValidToken(true);
                } else {
                    
                    alert("Invalid or expired token. Please contact the admin.");
                }
            } catch (error) {
                
                alert("Invalid or expired token. Please contact the admin.");
            }
        };
        if (token) {
            validateToken();
        } else {
            
            alert("Invalid access. Please try again.");
        }
    }, [token]);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please check and try again.");
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:5050/api/create-password",
                {
                    token,
                    password,
                }
            );
    
            alert("Password set successfully! Redirecting to login...");
            setTimeout(() => navigate("/memberAuth"), 2000);
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || "Failed to set password.";
            alert(`Error: ${errorMsg}`);
        }
    };
    

    return (
        <div
            className="auth-container"
            style={{ backgroundImage: `url('/assets/Auth.jpg')` }}
        >
            <div className="admin-auth-box">
                <h2>Create Password</h2>
              
                {isValidToken ? (
                    <form onSubmit={handleSubmit}>
                        {/* Password Field */}
                        <div className="admin-form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter Your Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <span
                                    className="toggle-password1"
                                    onClick={togglePasswordVisibility}
                                    role="button"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="admin-form-group password-group">
                            <label htmlFor="confirm-password">
                                Confirm Password
                            </label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirm-password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                                <span
                                    className="toggle-password1"
                                    onClick={togglePasswordVisibility}
                                    role="button"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button type="submit" className="sign-in-btn">
                                Set Password
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-danger">
                        Token is invalid or expired. Please contact the admin
                        for further information.
                    </p>
                )}
            </div>
        </div>
    );
}
