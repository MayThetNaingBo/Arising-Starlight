import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Reusable table row component
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/members`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch members.");
                }

                const data = await response.json();

                setMembers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching members:", err);
                setError("Unable to load members. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMembers = members.filter((member) =>
        String(member.name ?? "")
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h3>CCA Member List (Public View)</h3>

            <div className="search-bar mb-3">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search members by name"
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
                    {isLoading ? (
                        <tr>
                            <td colSpan="3" className="text-center">
                                Please wait for the members to appear.
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="3" className="text-center text-danger">
                                {error}
                            </td>
                        </tr>
                    ) : filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                            <Record key={member._id} record={member} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No members found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}