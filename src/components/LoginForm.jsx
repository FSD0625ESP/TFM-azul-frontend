import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";
import { loginUser } from "../services/authService";
import { validateEmail, validatePassword } from "../utils/validation";
import { LOGIN_INPUTS } from "../constants/inputConfigs";
import { textFieldSx, buttonSx } from "../styles/commonStyles";

const LoginForm = () => {
  const navigate = useNavigate();
  const theme = createTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Actualizar datos del formulario cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validar que email y password sean válidos
  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData.email, formData.password);

      setSuccessMessage(response.message || "Login successful! Redirecting...");

      // Limpiar el formulario después del login exitoso
      setFormData({
        email: "",
        password: "",
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // Aquí iría la lógica para recuperar contraseña
  };

  const handleSignUp = () => {
    navigate("/select-user-type");
  };

  // Configuración de inputs
  const inputsConfig = LOGIN_INPUTS;

  return (
    <ThemeProvider theme={theme}>
      <div
        className="min-h-screen flex flex-col justify-between p-4"
        style={{ backgroundColor: "#60BE1A" }}
      >
        <div className="flex items-center justify-center flex-grow">
          <div className="card w-full max-w-md bg-transparent shadow-none">
            <div className="card-body">
              <h1 className="text-4xl font-normal text-center mb-2 text-white">
                Hello!
              </h1>
              <p className="text-sm text-center text-white mb-6">
                Enter your email address and log in
              </p>

              {/* Mensaje de éxito */}
              {successMessage && (
                <div className="alert alert-success mb-4 text-white bg-green-600 border-none">
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Mensaje de error */}
              {errorMessage && (
                <div className="alert alert-error mb-4 text-white bg-red-600 border-none">
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {inputsConfig.map((config) => (
                  <div key={config.name}>
                    <TextField
                      type={config.type}
                      name={config.name}
                      value={formData[config.name]}
                      onChange={handleChange}
                      placeholder={config.placeholder}
                      variant="outlined"
                      fullWidth
                      sx={textFieldSx}
                      error={!!errors[config.name]}
                      helperText={errors[config.name]}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {config.icon}
                          </InputAdornment>
                        ),
                      }}
                      disabled={loading}
                      required
                    />
                  </div>
                ))}

                {/* Forgot Password Link */}
                <div className="text-right mb-4">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-white text-sm hover:underline transition"
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...buttonSx, width: "100%" }}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </button>

                {/* Go Back Button */}
                <button
                  type="button"
                  onClick={handleGoBack}
                  disabled={loading}
                  style={{ ...buttonSx, width: "100%" }}
                >
                  Go Back
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-white text-sm">
                  Don't have an account yet?{" "}
                  <button
                    onClick={handleSignUp}
                    className="text-white font-bold hover:underline transition"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-xs">
          &copy; All rights reserved
        </p>
      </div>
    </ThemeProvider>
  );
};

export default LoginForm;
