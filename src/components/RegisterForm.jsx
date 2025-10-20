import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";
import { registerUser } from "../services/authService";
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
} from "../utils/validation";
import { REGISTER_INPUTS } from "../constants/inputConfigs";
import { textFieldSx, buttonSx } from "../styles/commonStyles";

const RegisterForm = () => {
  const navigate = useNavigate();
  const theme = createTheme();

  const [formData, setFormData] = useState({
    name: "",
    surnames: "",
    email: "",
    password: "",
    repeatPassword: "",
    phoneNumber: "",
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

  // Validar todos los campos del registro
  const validateForm = () => {
    const newErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const surnamesError = validateName(formData.surnames);
    if (surnamesError) newErrors.surnames = "Surnames are required";

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const passwordMatchError = validatePasswordMatch(
      formData.password,
      formData.repeatPassword
    );
    if (passwordMatchError) newErrors.repeatPassword = passwordMatchError;

    const phoneError = validatePhone(formData.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar datos al backend y registrar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name: `${formData.name} ${formData.surnames}`,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });

      setSuccessMessage(
        response.message || "Registration successful! Redirecting..."
      );

      // Guardar el userId en sessionStorage si es shop (para vincularlo después)
      if (response.user && response.user.id) {
        sessionStorage.setItem("userId", response.user.id);
      }

      // Limpiar el formulario después del registro exitoso
      setFormData({
        name: "",
        surnames: "",
        email: "",
        password: "",
        repeatPassword: "",
        phoneNumber: "",
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        const userType = sessionStorage.getItem("userType");
        // Si es shop, ir a agregar detalles de la tienda
        if (userType === "shop") {
          navigate("/shop-details");
        } else {
          // Si es rider, ir directamente a login
          sessionStorage.removeItem("userType");
          navigate("/login");
        }
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  // Configuración de inputs
  const inputsConfig = REGISTER_INPUTS;

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
                Register
              </h1>
              <p className="text-sm text-center text-white mb-6">
                Fill in the details to join SoulBites
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
                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...buttonSx, width: "100%", marginBottom: "12px" }}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Register"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleGoBack}
                  disabled={loading}
                  style={{ ...buttonSx, width: "100%" }}
                >
                  Go Back
                </button>
              </form>
            </div>
          </div>
        </div>
        <p className="text-center text-white text-xs">
          &copy; All rights reserved
        </p>
      </div>
    </ThemeProvider>
  );
};

export default RegisterForm;
