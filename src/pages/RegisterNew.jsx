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

  // Store selected coordinates
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  // Handle address selection
  const handleSelectAddress = (feature) => {
    setAddress(feature.place_name);
    setSelectedCoordinates({
      lat: feature.center[1],
      lng: feature.center[0],
    });
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
          coordinates: selectedCoordinates,
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

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
            <span className="material-symbols-outlined text-emerald-500 text-4xl">
              volunteer_activism
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-0 mb-2">
            Create your account
          </h1>
          <p className="text-base text-gray-600 mt-2 mb-0">
            Select your account type to continue.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex h-12 items-center justify-center rounded-xl bg-gray-200 p-1.5 mb-6 gap-1.5">
          {["rider", "shop"].map((role) => (
            <label
              key={role}
              onClick={() => setUserType(role)}
              className={`flex-1 flex items-center justify-center h-full rounded-lg px-2 text-sm font-medium cursor-pointer transition-all ${
                userType === role
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-500"
              }`}
            >
              <span>{role === "rider" ? "Rider" : "Store"}</span>
              <input
                type="radio"
                name="role-selector"
                value={role}
                checked={userType === role}
                onChange={() => setUserType(role)}
                className="hidden"
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
          />
        )}

        {/* Terms */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 m-0">
            By creating an account, you accept our{" "}
            <a
              href="#"
              className="text-emerald-500 no-underline font-medium hover:underline"
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-emerald-500 no-underline font-medium hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 m-0">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-bold text-emerald-500 bg-none border-none cursor-pointer no-underline text-sm hover:underline"
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
