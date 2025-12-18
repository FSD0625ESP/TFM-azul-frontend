import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { buildApiUrl } from "../utils/apiConfig";
import { ROUTES, USER_TYPES } from "../utils/constants";
import { saveAuthToStorage } from "../utils/authHelpers";

const Login = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Intenta hacer login como usuario (rider)
   * @returns {Promise<boolean>} true si el login fue exitoso
   */
  const tryLoginAsUser = async () => {
    try {
      const response = await axios.post(buildApiUrl("/users/login"), {
        email,
        password,
      });

      const { token, user } = response.data;
      saveAuthToStorage(token, user, USER_TYPES.RIDER);
      console.log("User logged in:", user);
      // Forzar recarga completa para que useAuth detecte la autenticación
      window.location.href = ROUTES.MAIN_SCREEN;
      return true;
    } catch (error) {
      console.error("User login failed:", error);
      return false;
    }
  };

  /**
   * Intenta hacer login como tienda
   * @returns {Promise<boolean>} true si el login fue exitoso
   */
  const tryLoginAsStore = async () => {
    try {
      const response = await axios.post(buildApiUrl("/stores/login"), {
        email,
        password,
      });

      const { token, store } = response.data;
      saveAuthToStorage(token, store, USER_TYPES.STORE);
      console.log("Store logged in:", store);
      // Forzar recarga completa para que useAuth detecte la autenticación
      window.location.href = ROUTES.STORE_PROFILE;
      return true;
    } catch (error) {
      console.error("Store login failed:", error);
      return false;
    }
  };

  /**
   * Maneja el proceso de login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validar campos
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Intentar login como usuario primero
      const userLoginSuccess = await tryLoginAsUser();

      // Si falla, intentar como tienda
      if (!userLoginSuccess) {
        const storeLoginSuccess = await tryLoginAsStore();

        // Si ambos fallan, mostrar error
        if (!storeLoginSuccess) {
          setError("Invalid email or password. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navega a la página de recuperación de contraseña
   */
  const handleForgotPassword = () => {
    navigate(ROUTES.FORGOT_PASSWORD);
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center justify-center overflow-auto p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="h-16 w-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-emerald-950 text-4xl">
            local_shipping
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-gray-900 text-4xl font-bold leading-tight text-center pb-8 m-0">
          Welcome back
        </h1>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-900 text-sm m-0">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          {/* Email */}
          <div className="flex w-full flex-wrap items-end gap-4 pb-3">
            <label className="flex flex-col w-full">
              <p className="text-gray-900 text-base font-medium leading-relaxed pb-2">
                Email
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:border-emerald-500"
              />
            </label>
          </div>

          {/* Password */}
          <div className="flex w-full flex-wrap items-end gap-4 pt-3">
            <label className="flex flex-col w-full">
              <p className="text-gray-900 text-base font-medium leading-relaxed pb-2">
                Password
              </p>
              <div className="flex w-full items-stretch rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 px-4 py-4 rounded-l-lg border border-gray-200 border-r-0 bg-white text-gray-900 text-base focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex border border-l-0 border-gray-200 bg-white items-center justify-center pr-4 rounded-r-lg border-r cursor-pointer text-teal-700 hover:text-emerald-500 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>
          </div>

          {/* Forgot Password */}
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-teal-700 text-sm font-normal leading-relaxed pb-3 pt-1 px-0 underline cursor-pointer bg-none border-none hover:text-emerald-500 transition-colors"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex w-full pt-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex min-w-max w-full items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-emerald-500 text-emerald-950 text-base font-bold leading-relaxed tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors border-none"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {loading ? "Signing in..." : "Sign in"}
              </span>
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="pt-8 text-center">
          <p className="text-teal-700 text-sm font-normal m-0">
            Don't have an account?{" "}
            <button
              onClick={() => navigate(ROUTES.REGISTER)}
              className="font-bold text-emerald-500 bg-none border-none cursor-pointer no-underline text-sm hover:underline transition-all"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
