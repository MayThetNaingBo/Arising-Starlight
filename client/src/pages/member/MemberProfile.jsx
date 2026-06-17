import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-calendar/dist/Calendar.css"; // Calendar styles

export default function MemberProfile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        school: "",
    });

    const [showCalendar, setShowCalendar] = useState(false); // Calendar toggle
    const [date, setDate] = useState(new Date());

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve member ID from local storage
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Unauthorized! Please log in first.");
            navigate("/login");
            return;
        }

        // Fetch member profile from backend
        axios
            .get(`http://localhost:5050/api/members/${userId}`)
            .then((res) => {
                setProfile({
                    name: res.data.name,
                    email: res.data.email,
                    school: res.data.school,
                });
            })
            .catch((err) => {
                console.error("Error fetching profile details:", err);
                alert("Failed to fetch profile details!");
            });
    }, [navigate]);

    // Handle Password Change
    const handleChangePassword = async () => {
        try {
            const response = await axios.put(
                "http://localhost:5050/api/member/change-password",
                {
                    email: profile.email, // Fetch email dynamically
                    currentPassword,
                    newPassword,
                }
            );

            alert(response.data.message); // Success message
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            alert(
                error.response?.data?.message || "Failed to change password."
            );
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Member Profile</h1>

            {/* Buttons for Events and Calendar */}
            <div className="text-center mb-4">
                <button
                    className="btn btn-warning mx-2"
                    onClick={() => navigate("/member/individual/events")}
                >
                    My Events
                </button>

                <button
                    className="btn btn-warning mx-2"
                    onClick={() => setShowCalendar(!showCalendar)}
                >
                    My Calendar
                </button>
            </div>

            {/* Calendar */}
            {showCalendar && (
                <div className="calendar-container mb-4">
                    <Calendar onChange={setDate} value={date} />
                    <p className="mt-2">Selected Date: {date.toDateString()}</p>
                </div>
            )}

            {/* Profile Details */}
            <div className="profile-info">
                <h4>Name</h4>
                <p>{profile.name}</p>
            </div>
            <div className="profile-info">
                <h4>Email</h4>
                <p>{profile.email}</p>
            </div>
            <div className="profile-info">
                <h4>School</h4>
                <p>{profile.school}</p>
            </div>
<br></br>
            {/* Change Password Section */}

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
                className="btn btn-warning mb-3"
                onClick={handleChangePassword}
            >
                Change Password
            </button>
        </div>
    );
}
