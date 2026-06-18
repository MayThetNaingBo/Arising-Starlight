import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminAddMember() {
  const navigate = useNavigate();

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    school: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/members/add`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setPopup({
        show: true,
        title: "Member Added",
        message: "The member has been added successfully.",
        type: "success",
      });

      setFormData({
        name: "",
        school: "",
        email: "",
      });
    } catch (error) {
      setPopup({
        show: true,
        title: "Failed",
        message:
          error.response?.data?.message || "Failed to add member.",
        type: "error",
      });
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
          <label>School</label>
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
            <option value="Informatics and IT">Informatics and IT</option>
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
          type="button"
          className="btn btn-danger mt-3 ms-3"
          onClick={() => navigate("/admin/home")}
        >
          Cancel
        </button>
      </form>

      {popup.show && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <h2>{popup.title}</h2>
            <p>{popup.message}</p>

            <button
              style={styles.popupButton}
              onClick={() => {
                const popupType = popup.type;

                setPopup({
                  show: false,
                  title: "",
                  message: "",
                  type: "success",
                });

                if (popupType === "success") {
                  navigate("/admin/home");
                }
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "16px",
    width: "380px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },

  popupButton: {
    marginTop: "20px",
    padding: "10px 28px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#f5b400",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
};