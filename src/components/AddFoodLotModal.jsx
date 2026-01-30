import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { buildApiUrl } from "../utils/apiConfig";

const AddFoodLotModal = ({ isOpen, onClose, storeId, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pickupDeadline, setPickupDeadline] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

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
        parseInt(inputMinutes),
      );

      const formData = new FormData();
      formData.append("shopId", storeId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("pickupDeadline", pickupDate.toISOString());

      if (image) {
        formData.append("image", image);
      }

      console.log("Enviando formData");

      const response = await axios.post(buildApiUrl("/lots/create"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Lot created:", response.data);
      setName("");
      setDescription("");
      setPickupDeadline("");
      setImage(null);
      setImagePreview("");
      toast.success("Food lot published successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error creating lot:", err);
      const errorMsg = err.response?.data?.message || "Error creating lot";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end z-50"
      onClick={onClose}
    >
      <div
        className="w-full bg-[#f6f8f7] dark:bg-gray-800 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 dark:text-gray-400 flex items-center justify-center"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex-1 text-center">
            Add Food Lot
          </h2>
          <div className="w-6"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 rounded-lg p-3 mb-4 text-red-900 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Lot Image (Optional)
            </label>
            <div className="flex flex-col items-center">
              <div className="relative w-full h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors mb-2">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Lot preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center border-none cursor-pointer hover:bg-red-600"
                    >
                      <span className="material-symbols-outlined text-sm">
                        close
                      </span>
                    </button>
                  </>
                ) : (
                  <label
                    htmlFor="lot-image"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-5xl mb-2">
                      add_photo_alternate
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Click to add an image
                    </span>
                  </label>
                )}
                <input
                  id="lot-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Lot Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Lot Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g: Monday Bakery Pack"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the content, possible allergens, pickup time, etc."
              className="w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500 min-h-[120px] resize-vertical"
            />
          </div>

          {/* Pickup Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
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
              className="w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg border-none bg-emerald-500 text-white text-base font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-4 hover:bg-emerald-600 transition-colors"
          >
            {loading ? "Publishing..." : "Publish Lot"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodLotModal;
