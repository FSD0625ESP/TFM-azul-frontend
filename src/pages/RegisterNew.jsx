import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapboxClient from "@mapbox/mapbox-sdk/services/geocoding";
import RiderForm from "../components/RiderForm";
import StoreForm from "../components/StoreForm";
import ModalDialog from "../components/ModalDialog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const mapboxClient = MapboxClient({
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
});

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("rider");
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
            <button
              onClick={() => setShowTermsModal(true)}
              className="text-emerald-500 no-underline font-medium hover:underline bg-none border-none cursor-pointer text-xs"
            >
              Terms and Conditions
            </button>{" "}
            and{" "}
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-emerald-500 no-underline font-medium hover:underline bg-none border-none cursor-pointer text-xs"
            >
              Privacy Policy
            </button>
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

      {/* Terms and Conditions Modal */}
      <ModalDialog
        isOpen={showTermsModal}
        title="Terms and Conditions"
        onClose={() => setShowTermsModal(false)}
      >
        <h3 className="font-bold text-emerald-600 mb-3">1. Purpose and Use</h3>
        <p className="mb-4">
          SoulBites is a community platform designed to connect stores, riders,
          and volunteers to rescue surplus food and distribute it to those in
          need within your city.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">
          2. User Responsibilities
        </h3>
        <p className="mb-4">
          Users agree to:
          <ul className="list-disc ml-5 mt-2">
            <li>Provide accurate and truthful information</li>
            <li>Use the platform only for legitimate food rescue purposes</li>
            <li>Respect other community members</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">3. Food Safety</h3>
        <p className="mb-4">
          Stores are responsible for ensuring food safety and compliance with
          local health regulations. SoulBites does not guarantee the quality or
          safety of any food shared on the platform.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">
          4. Limitation of Liability
        </h3>
        <p className="mb-4">
          SoulBites and its operators are not liable for any damages arising
          from the use of this platform, including food-related incidents or
          delivery issues.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">5. Modifications</h3>
        <p>
          We reserve the right to modify these terms at any time. Changes will
          be effective immediately upon posting.
        </p>
      </ModalDialog>

      {/* Privacy Policy Modal */}
      <ModalDialog
        isOpen={showPrivacyModal}
        title="Privacy Policy"
        onClose={() => setShowPrivacyModal(false)}
      >
        <h3 className="font-bold text-emerald-600 mb-3">
          1. Information We Collect
        </h3>
        <p className="mb-4">
          We collect information you provide directly, including:
          <ul className="list-disc ml-5 mt-2">
            <li>Name and contact information</li>
            <li>Email address and phone number</li>
            <li>Location and address data</li>
            <li>Account credentials</li>
          </ul>
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">
          2. How We Use Your Information
        </h3>
        <p className="mb-4">
          We use collected information to:
          <ul className="list-disc ml-5 mt-2">
            <li>Facilitate food rescue operations</li>
            <li>Connect users within your area</li>
            <li>Communicate important updates</li>
            <li>Improve our services</li>
          </ul>
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">3. Data Protection</h3>
        <p className="mb-4">
          We implement reasonable security measures to protect your personal
          information. However, no method of transmission over the internet is
          completely secure.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">4. Third Parties</h3>
        <p className="mb-4">
          We do not sell or share your personal information with third parties
          without your consent, except as required by law.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">5. Contact Us</h3>
        <p>
          If you have questions about this privacy policy, please contact us
          through the app's support feature.
        </p>
      </ModalDialog>
    </div>
  );
};

export default Register;
