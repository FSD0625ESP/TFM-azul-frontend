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
import MapboxClient from "@mapbox/mapbox-sdk/services/geocoding";
import { registerShop } from "../services/authService";

const mapboxClient = MapboxClient({
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
});

const ShopDetailsForm = () => {
  const navigate = useNavigate();
  const theme = createTheme();

  const [formData, setFormData] = useState({
    shopName: "",
    shopType: "",
    streetAddress: "",
    lat: "",
    long: "",
  });

  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

    // Autocompletado solo para streetAddress
    if (name === "streetAddress") {
      if (value.length > 3) searchAddress(value);
      else setSuggestions([]);
    }
  };

  // Buscar direcciones con Mapbox
  const searchAddress = async (query) => {
    try {
      const response = await mapboxClient
        .forwardGeocode({
          query,
          autocomplete: true,
          limit: 5,
        })
        .send();

      setSuggestions(response.body.features);
    } catch (err) {
      console.error("Mapbox error:", err);
    }
  };

  // Seleccionar sugerencia
  const handleSelectAddress = (feature) => {
    const lat = feature.center[1].toString();
    const long = feature.center[0].toString();

    console.log("Selected address:", feature.place_name, { lat, long });

    setFormData((prev) => ({
      ...prev,
      streetAddress: feature.place_name,
      lat,
      long,
    }));
    setSuggestions([]);
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.shopName.trim()) newErrors.shopName = "Shop name is required";
    if (!formData.shopType.trim()) newErrors.shopType = "Shop type is required";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!formData.lat || !formData.long)
      newErrors.streetAddress = "Please select a valid address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        setErrorMessage("User ID not found. Please register again.");
        setLoading(false);
        return;
      }

      // Llamada al backend
      await registerShop(formData, userId);

      setSuccessMessage("Shop and Mark registered successfully!");
      setTimeout(() => {
        sessionStorage.removeItem("userType");
        sessionStorage.removeItem("userId");
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Shop registration error:", err);
      setErrorMessage("Error saving shop details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate("/");

  const textFieldSx = {
    marginBottom: "16px",
    "& .MuiOutlinedInput-root": {
      height: "48px",
      backgroundColor: "white",
      borderRadius: "9999px",
      "& fieldset": { borderColor: "transparent" },
      "&:hover fieldset": { borderColor: "transparent" },
      "&.Mui-focused fieldset": { borderColor: "transparent" },
    },
    "& .MuiInputBase-input": { color: "black" },
  };

  const inputsConfig = [
    {
      name: "shopName",
      type: "text",
      placeholder: "Shop Name",
      icon: <StorefrontIcon />,
    },
    {
      name: "shopType",
      type: "text",
      placeholder: "Type of Shop",
      icon: <CategoryIcon />,
    },
    {
      name: "streetAddress",
      type: "text",
      placeholder: "Street Address",
      icon: <LocationOnIcon />,
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
              <div className="alert alert-success mb-4 text-white bg-green-600 rounded-2xl">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-error mb-4 text-white bg-red-600 rounded-2xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {inputsConfig.map((config) => (
                <div key={config.name} style={{ position: "relative" }}>
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
                  {/* Sugerencias Mapbox */}
                  {config.name === "streetAddress" &&
                    suggestions.length > 0 && (
                      <div className="bg-white border rounded p-2 max-h-40 overflow-y-auto absolute w-full z-10">
                        {suggestions.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => handleSelectAddress(s)}
                            className="p-1 cursor-pointer hover:bg-gray-200 text-black"
                          >
                            {s.place_name}
                          </div>
                        ))}
                      </div>
                    )}
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
                }}
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
                }}
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
