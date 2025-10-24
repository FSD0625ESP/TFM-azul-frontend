import React from "react";

const StoreForm = ({
  shopName,
  setShopName,
  shopType,
  setShopType,
  address,
  setAddress,
  searchAddress,
  suggestions,
  handleSelectAddress,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  repeatPassword,
  setRepeatPassword,
  loading,
  handleRegister,
  inputStyle,
}) => {
  return (
    <form
      onSubmit={handleRegister}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {/* Store Name */}
      <div style={{ position: "relative" }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        >
          storefront
        </span>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Store name"
          style={inputStyle}
        />
      </div>

      {/* Store Type */}
      <div style={{ position: "relative" }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        >
          category
        </span>
        <input
          type="text"
          value={shopType}
          onChange={(e) => setShopType(e.target.value)}
          placeholder="Store type"
          style={inputStyle}
        />
      </div>

      {/* Address */}
      <div style={{ position: "relative" }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
            zIndex: "10",
          }}
        >
          location_on
        </span>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            searchAddress(e.target.value);
          }}
          placeholder="Address"
          style={inputStyle}
        />

        {/* Address suggestions dropdown */}
        {suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              right: "0",
              backgroundColor: "#ffffff",
              border: "1px solid #d1d5db",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: "20",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSelectAddress(suggestion)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom:
                    index < suggestions.length - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                  color: "#111714",
                  fontSize: "14px",
                  fontFamily: "'Work Sans', sans-serif",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f6f8f7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {suggestion.place_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email */}
      <div style={{ position: "relative" }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        >
          mail
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={inputStyle}
        />
      </div>

      {/* Phone */}
      <div style={{ position: "relative" }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        >
          phone
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          style={inputStyle}
        />
      </div>

      {/* Password */}
      <div style={{ position: "relative" }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        >
          lock
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={inputStyle}
        />
      </div>

      {/* Repeat Password */}
      <div style={{ position: "relative" }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        >
          lock
        </span>
        <input
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          placeholder="Repeat password"
          style={inputStyle}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: "24px",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#1dc962",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        {loading ? "Creating store..." : "Create store"}
      </button>

      {/* Sign In Link */}
      <p
        style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#6b7280",
          marginTop: "16px",
        }}
      >
        Already have an account?{" "}
        <a
          href="/login"
          style={{
            color: "#1dc962",
            textDecoration: "none",
            fontSize: "14px",
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        >
          Sign In
        </a>
      </p>
    </form>
  );
};

export default StoreForm;
