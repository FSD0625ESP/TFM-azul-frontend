import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL, buildApiUrl } from "../utils/apiConfig";
import { ROUTES, VALIDATION_MESSAGES, USER_TYPES } from "../utils/constants";
import { saveAuthToStorage } from "../utils/authHelpers";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password,
      });

      const { token, admin } = response.data;

      // Guardar en localStorage usando helper
      saveAuthToStorage(token, admin, USER_TYPES.ADMIN);
      console.log("Admin logged in", admin);

      toast.success("Welcome, Admin!");
      // Forzar recarga completa para que useAuth detecte la autenticación
      window.location.href = ROUTES.ADMIN_DASHBOARD;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo/Icon */}
        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-emerald-600 text-5xl">
            admin_panel_settings
          </span>
        </div>

        {/* Title */}
        <h1 className="text-gray-900 text-3xl font-bold text-center mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-600 text-base text-center mb-8">
          SoulBites Administration
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5 bg-white rounded-2xl p-8 shadow-2xl"
        >
          {/* Email */}
          <div className="flex flex-col w-full">
            <label className="text-gray-900 text-base font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@soulbites.com"
              className="px-4 py-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:border-emerald-500"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col w-full">
            <label className="text-gray-900 text-base font-medium mb-2">
              Password
            </label>
            <div className="flex w-full items-stretch rounded-lg">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="flex-1 px-4 py-4 rounded-l-lg border border-gray-200 border-r-0 bg-white text-gray-900 text-base focus:outline-none focus:border-emerald-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex border border-l-0 border-gray-200 bg-white items-center justify-center pr-4 rounded-r-lg cursor-pointer text-gray-600 hover:text-emerald-500 transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
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
            {loading ? "Logging in..." : "Login as Admin"}
          </button>

          {/* Back to Home */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 text-gray-600 text-sm font-medium bg-none border-none cursor-pointer hover:text-gray-900 transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Back to home
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
