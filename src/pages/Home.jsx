import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "#f6f8f7",
        fontFamily: "'Work Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with Logo */}
      <header
        style={{
          width: "100%",
          padding: "32px 16px 16px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            className="material-symbols-outlined"
            style={{ color: "#1dc962", fontSize: "32px" }}
          >
            local_mall
          </span>
          <span style={{ fontWeight: 700, fontSize: "24px", color: "#1f2937" }}>
            FoodLink
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Hero Image */}
        <div
          style={{
            flex: 1,
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbXfY5FRctCKCChIHSrhhxlxcp3c0yJrze39pTDz1DsAjFMiw65oGgqkPumJ2OES0n1VYkBGCA9CsX61S6wfYO02xfbSXfBnBvzCof10tcUKVzRfbOqR03HWfm0YbAxmp_wKGW3fQLu5_yaW21qzH219rxkqlbu8YxV6HVlfiYWaLNKzwxCbbzTN-slRpHAu80HbDkRcErCTTDa_NIFoGKtdP2t0p_GNLZJmDqMwplaNezoSj-NWgIUJJRA2XxO8dQeCgnSW9Kes")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "300px",
          }}
        ></div>

        {/* Content Section */}
        <div
          style={{
            backgroundColor: "#f6f8f7",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            marginTop: "-32px",
            paddingTop: "32px",
            paddingBottom: "20px",
            flexShrink: 0,
          }}
        >
          {/* Headline */}
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#111714",
              textAlign: "center",
              paddingBottom: "12px",
              paddingLeft: "24px",
              paddingRight: "24px",
              margin: 0,
            }}
          >
            Connecting hearts, one plate at a time.
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#4b5563",
              textAlign: "center",
              paddingBottom: "24px",
              paddingTop: "4px",
              paddingLeft: "24px",
              paddingRight: "24px",
              margin: 0,
            }}
          >
            Join our community of stores, riders and volunteers to rescue
            delicious food and bring it to those who need it most in your city.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingLeft: "16px",
              paddingRight: "16px",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                maxWidth: "480px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <button
                onClick={() => navigate("/register")}
                style={{
                  backgroundColor: "#1dc962",
                  color: "#111714",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#16a64d")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#1dc962")
                }
              >
                Create an account
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  backgroundColor: "transparent",
                  color: "#1f2937",
                  border: "2px solid #1f2937",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Sign In
              </button>
            </div>
          </div>
          <div style={{ height: "20px" }}></div>
        </div>
      </main>
    </div>
  );
};

export default Home;
