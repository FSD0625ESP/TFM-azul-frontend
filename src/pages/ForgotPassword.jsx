import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      // TODO: Tu compañero implementará este endpoint
      // await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      // Simulación por ahora
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast.success("Recovery email sent! Check your inbox.");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error sending recovery email");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-dvh bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-emerald-500 text-5xl">
              mark_email_read
            </span>
          </div>

          {/* Success Message */}
          <h1 className="text-gray-900 text-3xl font-bold mb-4">
            Check your email
          </h1>
          <p className="text-gray-600 text-base mb-2">
            We've sent a password recovery link to:
          </p>
          <p className="text-emerald-600 text-base font-semibold mb-8">
            {email}
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </p>

          {/* Back to Login */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-4 rounded-lg bg-emerald-500 text-white text-base font-semibold border-none cursor-pointer hover:bg-emerald-600 transition-colors"
          >
            Back to login
          </button>

          {/* Resend Email */}
          <button
            onClick={() => setEmailSent(false)}
            className="mt-4 text-teal-700 text-sm font-normal underline cursor-pointer bg-none border-none hover:text-emerald-500 transition-colors"
          >
            Didn't receive the email? Try again
          </button>
        </div>
      </div>
    );
  }

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
          Forgot password?
        </h1>
        <p className="text-gray-600 text-base text-center mb-8">
          No worries, we'll send you reset instructions.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          {/* Email Input */}
          <div className="flex flex-col w-full">
            <label className="text-gray-900 text-base font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:border-emerald-500"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg bg-emerald-500 text-white text-base font-bold border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
          >
            {loading ? "Sending..." : "Send recovery email"}
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

export default ForgotPassword;
