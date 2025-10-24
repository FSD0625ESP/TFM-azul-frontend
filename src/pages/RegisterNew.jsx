import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapboxClient from "@mapbox/mapbox-sdk/services/geocoding";
import RiderForm from "../components/RiderForm";
import StoreForm from "../components/StoreForm";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const mapboxClient = MapboxClient({
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
});

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("rider");
  const [loading, setLoading] = useState(false);

  // Rider fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Store-specific fields
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Search addresses with Mapbox
  const searchAddress = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

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
      setSuggestions([]);
    }
  };

  // Handle address selection
  const handleSelectAddress = (feature) => {
    setAddress(feature.place_name);
    setSuggestions([]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (userType === "rider") {
      if (!firstName || !lastName || !email || !password || !repeatPassword) {
        alert("Please fill in all required fields");
        return;
      }
    } else if (userType === "shop") {
      if (
        !shopName ||
        !shopType ||
        !address ||
        !email ||
        !phone ||
        !password ||
        !repeatPassword
      ) {
        alert("Please fill in all required fields");
        return;
      }
    }

    if (password !== repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (userType === "rider") {
        const userResponse = await axios.post(`${API_URL}/users/register`, {
          name: `${firstName} ${lastName}`,
          email,
          password,
          phone: phone ? parseInt(phone) : null,
        });

        const user = userResponse.data.user;
        console.log("User registered:", user);
      } else if (userType === "shop") {
        const storeResponse = await axios.post(`${API_URL}/stores/register`, {
          name: shopName,
          address,
          type: shopType,
          email,
          password,
          phone: phone ? parseInt(phone) : null,
        });

        console.log("Store registered:", storeResponse.data);
      }

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        error.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    padding: "12px 12px 12px 44px",
    color: "#111714",
    fontSize: "16px",
    fontFamily: "'Work Sans', sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "#f6f8f7",
        fontFamily: "'Work Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <main style={{ width: "100%", maxWidth: "448px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              height: "64px",
              width: "64px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "rgba(29, 201, 98, 0.2)",
              marginBottom: "16px",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#1dc962", fontSize: "36px" }}
            >
              volunteer_activism
            </span>
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#111714",
              marginTop: 0,
              marginBottom: "8px",
            }}
          >
            Create your account
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#4b5563",
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            Select your account type to continue.
          </p>
        </div>

        {/* Role Selector */}
        <div
          style={{
            display: "flex",
            height: "48px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            backgroundColor: "#e5e7eb",
            padding: "6px",
            marginBottom: "24px",
            gap: "6px",
          }}
        >
          {["rider", "shop"].map((role) => (
            <label
              key={role}
              onClick={() => setUserType(role)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                borderRadius: "8px",
                paddingLeft: "8px",
                paddingRight: "8px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.3s",
                backgroundColor: userType === role ? "#ffffff" : "transparent",
                color: userType === role ? "#111714" : "#6b7280",
                boxShadow:
                  userType === role ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <span>{role === "rider" ? "Rider" : "Store"}</span>
              <input
                type="radio"
                name="role-selector"
                value={role}
                checked={userType === role}
                onChange={() => setUserType(role)}
                style={{ display: "none" }}
              />
            </label>
          ))}
        </div>

        {/* Forms */}
        {userType === "rider" && (
          <RiderForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            repeatPassword={repeatPassword}
            setRepeatPassword={setRepeatPassword}
            loading={loading}
            handleRegister={handleRegister}
            inputStyle={inputStyle}
          />
        )}

        {userType === "shop" && (
          <StoreForm
            shopName={shopName}
            setShopName={setShopName}
            shopType={shopType}
            setShopType={setShopType}
            address={address}
            setAddress={setAddress}
            searchAddress={searchAddress}
            suggestions={suggestions}
            handleSelectAddress={handleSelectAddress}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            repeatPassword={repeatPassword}
            setRepeatPassword={setRepeatPassword}
            loading={loading}
            handleRegister={handleRegister}
            inputStyle={inputStyle}
          />
        )}

        {/* Terms */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            By creating an account, you accept our{" "}
            <a
              href="#"
              style={{
                color: "#1dc962",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href="#"
              style={{
                color: "#1dc962",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Sign In Link */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                fontWeight: 700,
                color: "#1dc962",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
                fontSize: "14px",
              }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              Sign In
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
