import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // TODO: Tu compañero implementará este endpoint
      // await axios.patch(
      //   `${API_URL}/auth/change-password`,
      //   { currentPassword, newPassword },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      // Simulación por ahora
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Password changed successfully!");
      navigate(-1); // Volver al perfil
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Error changing password. Please check your current password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Icon */}
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-emerald-500 text-4xl">
            lock_reset
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-gray-900 text-3xl font-bold text-center mb-3">
          Change Password
        </h1>
        <p className="text-gray-600 text-base text-center mb-8">
          Enter your current password and choose a new one.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {/* Current Password */}
          <div className="flex flex-col w-full">
            <label className="text-gray-900 text-base font-medium mb-2">
              Current Password
            </label>
            <div className="flex w-full items-stretch rounded-lg">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="flex-1 px-4 py-4 rounded-l-lg border border-gray-200 border-r-0 bg-white text-gray-900 text-base focus:outline-none focus:border-emerald-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="flex border border-l-0 border-gray-200 bg-white items-center justify-center pr-4 rounded-r-lg cursor-pointer text-teal-700 hover:text-emerald-500 transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showCurrentPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col w-full">
            <label className="text-gray-900 text-base font-medium mb-2">
              New Password
            </label>
            <div className="flex w-full items-stretch rounded-lg">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="flex-1 px-4 py-4 rounded-l-lg border border-gray-200 border-r-0 bg-white text-gray-900 text-base focus:outline-none focus:border-emerald-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="flex border border-l-0 border-gray-200 bg-white items-center justify-center pr-4 rounded-r-lg cursor-pointer text-teal-700 hover:text-emerald-500 transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showNewPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters
            </p>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col w-full">
            <label className="text-gray-900 text-base font-medium mb-2">
              Confirm New Password
            </label>
            <div className="flex w-full items-stretch rounded-lg">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="flex-1 px-4 py-4 rounded-l-lg border border-gray-200 border-r-0 bg-white text-gray-900 text-base focus:outline-none focus:border-emerald-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="flex border border-l-0 border-gray-200 bg-white items-center justify-center pr-4 rounded-r-lg cursor-pointer text-teal-700 hover:text-emerald-500 transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg bg-emerald-500 text-white text-base font-bold border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors mt-2"
          >
            {loading ? "Changing..." : "Change password"}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 text-gray-600 text-sm font-medium bg-none border-none cursor-pointer hover:text-gray-900 transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Back to profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
