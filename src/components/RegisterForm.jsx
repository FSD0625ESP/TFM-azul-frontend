import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { registerUser } from "../services/authService";

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

  // Validación de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validaciones del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.surnames.trim()) {
      newErrors.surnames = "Surnames are required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.repeatPassword) {
      newErrors.repeatPassword = "Please confirm your password";
    } else if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }

    if (formData.phoneNumber && isNaN(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        response.message || "✅ Registration successful! You can now log in."
      );

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
        handleGoBack();
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.message || "❌ Registration failed. Please try again."
      );
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  // Estilos reutilizables para los TextFields
  const textFieldSx = {
    marginBottom: "16px",
    "& .MuiOutlinedInput-root": {
      height: "48px",
      backgroundColor: "white",
      borderRadius: "9999px",
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
  };

  // Estilos para botones (mismas dimensiones que los inputs)
  const buttonSx = {
    height: "48px",
    borderRadius: "9999px",
    backgroundColor: "#123B7E",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
    textTransform: "none",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#0d2a5c",
    },
    "&:disabled": {
      opacity: 0.7,
      cursor: "not-allowed",
    },
  };

  // Configuración de inputs
  const inputsConfig = [
    {
      name: "name",
      type: "text",
      placeholder: "Name",
      icon: <PersonOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
    },
    {
      name: "surnames",
      type: "text",
      placeholder: "Surnames",
      icon: <PersonOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
    },
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      icon: <EmailOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      icon: <LockOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
    },
    {
      name: "repeatPassword",
      type: "password",
      placeholder: "Repeat Password",
      icon: <LockOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
    },
    {
      name: "phoneNumber",
      type: "tel",
      placeholder: "Phone Number",
      icon: <PhoneOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
    },
  ];

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
                Fill in the details and become a rider
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
