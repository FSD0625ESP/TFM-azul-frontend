import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User logged in:", user);
      navigate("/mainscreen");
    } catch (userError) {
      try {
        const storeResponse = await axios.post(`${API_URL}/stores/login`, {
          email,
          password,
        });

        const { token, store } = storeResponse.data;
        localStorage.setItem("token", token);
        localStorage.setItem("store", JSON.stringify(store));
        console.log("Store logged in:", store);
        navigate("/store-profile");
      } catch (storeError) {
        console.error("Login failed:", storeError);
        setError(
          storeError.response?.data?.message ||
            "Invalid email or password. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Password recovery feature coming soon!");
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  };

  const labelTextStyle = {
    color: "#111714",
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: 1.5,
    paddingBottom: "8px",
  };

  const inputStyle = {
    width: "100%",
    flex: 1,
    resize: "none",
    overflow: "hidden",
    borderRadius: "8px",
    color: "#111714",
    outline: "none",
    border: "1px solid #dce5df",
    backgroundColor: "#ffffff",
    height: "56px",
    padding: "15px",
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
        overflow: "auto",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "448px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            height: "64px",
            width: "64px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "16px",
            backgroundColor: "#1dc962",
            marginBottom: "24px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "#112117", fontSize: "32px" }}
          >
            local_shipping
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            color: "#111714",
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1.2,
            textAlign: "center",
            paddingBottom: "32px",
            margin: 0,
          }}
        >
          Welcome back
        </h1>

        {/* Error Message */}
        {error && (
          <div
            style={{
              width: "100%",
              marginBottom: "16px",
              padding: "16px",
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "8px",
            }}
          >
            <p style={{ color: "#991b1b", fontSize: "14px", margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleLogin}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Email */}
          <div
            style={{
              display: "flex",
              width: "100%",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: "16px",
              paddingBottom: "12px",
            }}
          >
            <label style={labelStyle}>
              <p style={labelTextStyle}>Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={inputStyle}
              />
            </label>
          </div>

          {/* Password */}
          <div
            style={{
              display: "flex",
              width: "100%",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: "16px",
              paddingTop: "12px",
            }}
          >
            <label style={labelStyle}>
              <p style={labelTextStyle}>Password</p>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  flex: 1,
                  alignItems: "stretch",
                  borderRadius: "8px",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    ...inputStyle,
                    borderRadius: "8px 0 0 8px",
                    borderRight: "none",
                    paddingRight: "8px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    color: "#648772",
                    display: "flex",
                    border: "1px solid #dce5df",
                    backgroundColor: "#ffffff",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingRight: "15px",
                    borderRadius: "0 8px 8px 0",
                    borderLeft: "none",
                    cursor: "pointer",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#1dc962")}
                  onMouseLeave={(e) => (e.target.style.color = "#648772")}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>
          </div>

          {/* Forgot Password */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                color: "#648772",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: 1.5,
                paddingBottom: "12px",
                paddingTop: "4px",
                paddingLeft: 0,
                paddingRight: 0,
                textDecoration: "underline",
                cursor: "pointer",
                background: "none",
                border: "none",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#1dc962")}
              onMouseLeave={(e) => (e.target.style.color = "#648772")}
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <div
            style={{
              display: "flex",
              width: "100%",
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: "12px",
              marginTop: "16px",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex",
                minWidth: "84px",
                width: "100%",
                cursor: loading ? "not-allowed" : "pointer",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: "8px",
                height: "48px",
                paddingLeft: "20px",
                paddingRight: "20px",
                flex: 1,
                backgroundColor: "#1dc962",
                color: "#112117",
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: 1.5,
                letterSpacing: "0.015em",
                transition: "background-color 0.3s",
                border: "none",
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={(e) =>
                !loading && (e.target.style.backgroundColor = "#16a64d")
              }
              onMouseLeave={(e) =>
                !loading && (e.target.style.backgroundColor = "#1dc962")
              }
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </span>
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div style={{ paddingTop: "32px", textAlign: "center" }}>
          <p
            style={{
              color: "#648772",
              fontSize: "14px",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
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
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
