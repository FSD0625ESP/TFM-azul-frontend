import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EditFoodLotModal = ({ isOpen, onClose, lot, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pickupDeadline, setPickupDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lot) {
      setName(lot.name);
      setDescription(lot.description || "");

      // Extraer la hora del pickupDeadline
      const date = new Date(lot.pickupDeadline);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      setPickupDeadline(`${hours}:${minutes}`);
    }
  }, [lot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !pickupDeadline) {
      setError("Name and pickup deadline are required");
      return;
    }

    // Validar que la hora no haya pasado
    const now = new Date();
    const [inputHours, inputMinutes] = pickupDeadline.split(":");
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const inputTotalMinutes =
      parseInt(inputHours) * 60 + parseInt(inputMinutes);
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    if (inputTotalMinutes <= currentTotalMinutes) {
      setError("Pickup time must be in the future");
      return;
    }

    setLoading(true);

    try {
      // Crear fecha completa con hoy + hora seleccionada
      const today = new Date();
      const pickupDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(inputHours),
        parseInt(inputMinutes)
      );

      const response = await axios.put(`${API_URL}/lots/${lot._id}`, {
        name,
        description,
        pickupDeadline: pickupDate.toISOString(),
      });

      console.log("Lot updated:", response.data);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error updating lot:", err);
      setError(err.response?.data?.message || "Error updating lot");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !lot) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#f6f8f7",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          padding: "24px 16px 32px",
          maxHeight: "90vh",
          overflowY: "auto",
          fontFamily: "'Work Sans', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#111714",
              flex: 1,
              textAlign: "center",
            }}
          >
            Edit Food Lot
          </h2>
          <div style={{ width: "24px" }}></div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              color: "#991b1b",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Lot Name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#111714",
                marginBottom: "8px",
              }}
            >
              Lot Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g: Monday Bakery Pack"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #dce5df",
                backgroundColor: "#ffffff",
                fontSize: "14px",
                fontFamily: "'Work Sans', sans-serif",
                boxSizing: "border-box",
                color: "#111714",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#111714",
                marginBottom: "8px",
              }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the content, possible allergens, pickup time, etc."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #dce5df",
                backgroundColor: "#ffffff",
                fontSize: "14px",
                fontFamily: "'Work Sans', sans-serif",
                boxSizing: "border-box",
                minHeight: "120px",
                resize: "vertical",
                color: "#111714",
              }}
            />
          </div>

          {/* Pickup Deadline */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#111714",
                marginBottom: "8px",
              }}
            >
              Pickup Deadline
            </label>
            <input
              type="time"
              value={pickupDeadline}
              onChange={(e) => setPickupDeadline(e.target.value)}
              min={(() => {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, "0");
                const minutes = String(now.getMinutes()).padStart(2, "0");
                return `${hours}:${minutes}`;
              })()}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #dce5df",
                backgroundColor: "#ffffff",
                fontSize: "14px",
                fontFamily: "'Work Sans', sans-serif",
                boxSizing: "border-box",
                color: "#111714",
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1dc962",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontFamily: "'Work Sans', sans-serif",
              marginTop: "16px",
            }}
          >
            {loading ? "Updating..." : "Update Lot"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFoodLotModal;
