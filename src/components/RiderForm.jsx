import React from "react";

const RiderForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
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
      {/* First Name */}
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
          person
        </span>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          style={inputStyle}
        />
      </div>

      {/* Last Name */}
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
          badge
        </span>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
          style={inputStyle}
        />
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
        {loading ? "Creating account..." : "Create account"}
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

export default RiderForm;
