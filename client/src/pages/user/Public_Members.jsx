import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap for styling

// Record Component (Reusable)
const Record = ({ record }) => {
    return (
        <tr>
            <td>{record.name}</td>
            <td>{record.school}</td>
            <td>{record.email}</td>
        </tr>
    );
};

export default function Home() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch members from API
        fetch("http://localhost:5050/api/members")
            .then((res) => res.json())
            .then((data) => setMembers(data))
            .catch((err) => console.error("Error fetching members:", err));
    }, []);

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtered members for search
    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h3>CCA Member List ( Public View ) </h3>
            <div className="search-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search events by title"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>School</th>
                        <th>TP Email</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMembers.map((member) => (
                        <Record key={member._id} record={member} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
