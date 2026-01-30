import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { buildApiUrl } from "../utils/apiConfig";
import { ROUTES, VALIDATION_MESSAGES } from "../utils/constants";
import { passwordsMatch } from "../utils/validation";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Protección: Solo accesible con token del email
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset link");
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!password || !confirmPassword) {
      toast.error(VALIDATION_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Validar que las contraseñas coincidan
    if (!passwordsMatch(password, confirmPassword)) {
      toast.error(VALIDATION_MESSAGES.PASSWORDS_MISMATCH);
      return;
    }

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(buildApiUrl("/auth/reset-password"), {
        token,
        password,
      });

      toast.success(response.data.message || "Password reset successfully!");
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Error resetting password. The link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Icon */}
        <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-emerald-500 dark:text-emerald-400 text-4xl">
            vpn_key
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-gray-900 dark:text-white text-3xl font-bold text-center mb-3">
          Set new password
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base text-center mb-8">
          Your new password must be different from previously used passwords.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {/* New Password */}
          <div className="flex flex-col w-full">
            <label className="text-gray-900 text-base font-medium mb-2">
              New Password
            </label>
            <div className="flex w-full items-stretch rounded-lg">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="flex-1 px-4 py-4 rounded-l-lg border border-gray-200 border-r-0 bg-white text-gray-900 text-base focus:outline-none focus:border-emerald-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex border border-l-0 border-gray-200 bg-white items-center justify-center pr-4 rounded-r-lg cursor-pointer text-teal-700 hover:text-emerald-500 transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col w-full">
            <label className="text-gray-900 text-base font-medium mb-2">
              Confirm Password
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
            {loading ? "Resetting..." : "Reset password"}
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 text-gray-600 text-sm font-medium bg-none border-none cursor-pointer hover:text-gray-900 transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
