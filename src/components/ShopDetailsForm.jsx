import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { registerShop } from "../services/authService";

const ShopDetailsForm = () => {
  const navigate = useNavigate();
  const theme = createTheme();

  const [formData, setFormData] = useState({
    shopName: "",
    shopType: "",
    streetAddress: "",
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
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    }

    if (!formData.shopType.trim()) {
      newErrors.shopType = "Shop type is required";
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
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
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        setErrorMessage("Error: User ID not found. Please register again.");
        setLoading(false);
        return;
      }

      // Enviar datos de tienda al backend
      await registerShop(formData, userId);

      setSuccessMessage("Shop details saved! Proceeding to login...");

      // Limpiar sessionStorage
      setTimeout(() => {
        sessionStorage.removeItem("userType");
        sessionStorage.removeItem("userId");
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage("Error saving shop details. Please try again.");
      console.error("Shop details error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

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

  const inputsConfig = [
    {
      name: "shopName",
      type: "text",
      placeholder: "Shop Name",
      icon: <StorefrontIcon style={{ color: "black", fontSize: "20px" }} />,
    },
    {
      name: "shopType",
      type: "text",
      placeholder: "Type of Shop",
      icon: <CategoryIcon style={{ color: "black", fontSize: "20px" }} />,
    },
    {
      name: "streetAddress",
      type: "text",
      placeholder: "Street Address",
      icon: <LocationOnIcon style={{ color: "black", fontSize: "20px" }} />,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div
        className="min-h-screen flex flex-col justify-between p-4"
        style={{ backgroundColor: "#60BE1A" }}
      >
        <div className="flex items-center justify-center flex-grow">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-center mb-2 text-white">
              Shop Details
            </h1>
            <p className="text-sm text-center text-white mb-6">
              Complete your shop information
            </p>

            {successMessage && (
              <div className="alert alert-success mb-4 text-white bg-green-600 border-none rounded-2xl">
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-error mb-4 text-white bg-red-600 border-none rounded-2xl">
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
                style={{
                  height: "48px",
                  borderRadius: "9999px",
                  backgroundColor: "#123B7E",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  marginBottom: "12px",
                  marginTop: "24px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Continue"
                )}
              </button>

              <button
                type="button"
                onClick={handleGoBack}
                disabled={loading}
                style={{
                  height: "48px",
                  borderRadius: "9999px",
                  backgroundColor: "#123B7E",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                Go Back
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-white text-xs">
          &copy; All rights reserved
        </p>
      </div>
    </ThemeProvider>
  );
};

export default ShopDetailsForm;
