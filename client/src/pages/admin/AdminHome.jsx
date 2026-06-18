import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap for styling
import { Modal, Button } from "react-bootstrap"; // Import Modal from react-bootstrap
import "./AdminNavAuth.css";

const Record = ({ record, showDeleteModal }) => {
    return (
        <tr>
            <td>{record.name}</td>
            <td>{record.school}</td>
            <td>{record.email}</td>
            <td>
                <button
                    className="btn btn-link text-primary"
                    onClick={() =>
                        (window.location.href = `/admin/edit/${record._id}`)
                    }
                >
                    Edit
                </button>
                |
                <button
                    className="btn btn-link text-danger"
                    onClick={() => showDeleteModal(record._id)}
                >
                    Remove
                </button>
            </td>
        </tr>
    );
};

export default function AdminHome() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
  const fetchMembers = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/members`);
      const data = await res.json();

      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMembers();
}, []);
    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Show delete confirmation modal
    const showDeleteModal = (id) => {
        setMemberToDelete(id);
        setShowModal(true);
    };

    // Confirm delete function
    const confirmDelete = async () => {
        try {
            // Call the delete API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/members/${memberToDelete}`, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }
    
            // Update the member list
            const updatedMembers = members.filter(
                (member) => member._id !== memberToDelete
            );
            setMembers(updatedMembers); // Update React state
            setShowModal(false); // Close modal after deleting
        } catch (err) {
            console.error("Error deleting member:", err);
            alert("Failed to delete the member. Please try again.");
        }
    };
    

    // Filtered members for search
    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>CCA Member List ( Admin View )</h3>
                <button
                    className="btn btn-warning"
                    onClick={() => (window.location.href = "/admin/add")}
                >
                    Add New Member
                </button>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search members by title"
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMembers.map((member) => (
                        <Record
                            key={member._id}
                            record={member}
                            showDeleteModal={showDeleteModal}
                        />
                    ))}
                </tbody>
            </table>

           {loading ? (
  <div className="text-center mt-3">
    <p>Loading members...</p>
  </div>
) : filteredMembers.length === 0 ? (
  <div className="text-center mt-3">
    <p>No members found matching your search criteria.</p>
  </div>
) : null}
            {/* Delete Confirmation Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                className="custom-modal"
            >
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title className="custom-modal-title">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
                    Are you sure you want to remove this member? This action
                    cannot be undone.
                </Modal.Body>
                <Modal.Footer className="custom-modal-footer">
                    <Button
                        variant="danger"
                        onClick={() => setShowModal(false)}
                        className="custom-cancel-button"
                    >
                        NO
                    </Button>
                    <Button
                        variant="variant"
                        onClick={confirmDelete}
                        className="custom-delete-button"
                    >
                        YES
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
