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
      className="fixed inset-0 bg-black/50 flex items-end z-50"
      onClick={onClose}
    >
      <div
        className="w-full bg-[#f6f8f7] rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 flex items-center justify-center"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold text-gray-900 flex-1 text-center">
            Edit Food Lot
          </h2>
          <div className="w-6"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4 text-red-900 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Lot Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Lot Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g: Monday Bakery Pack"
              className="w-full px-3 py-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the content, possible allergens, pickup time, etc."
              className="w-full px-3 py-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 min-h-[120px] resize-vertical"
            />
          </div>

          {/* Pickup Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
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
              className="w-full px-3 py-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg border-none bg-emerald-500 text-white text-base font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-4 hover:bg-emerald-600 transition-colors"
          >
            {loading ? "Updating..." : "Update Lot"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFoodLotModal;
