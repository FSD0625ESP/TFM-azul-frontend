import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RiderProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f6f8f7",
      }}
    >
      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "80px",
          paddingTop: "16px",
        }}
      >
        {/* Profile Image and Name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <img
              src={user.photo || "https://via.placeholder.com/96"}
              alt="User profile"
              style={{
                height: "96px",
                width: "96px",
                borderRadius: "50%",
                border: "4px solid white",
                objectFit: "cover",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <button
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "32px",
                width: "32px",
                borderRadius: "50%",
                backgroundColor: "#1dc962",
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                edit
              </span>
            </button>
          </div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#111714",
              marginBottom: "8px",
            }}
          >
            {user.name}
          </h2>
        </div>

        {/* User Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Email */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              borderRadius: "12px",
              backgroundColor: "white",
              padding: "16px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "40px",
                width: "40px",
                minWidth: "40px",
                borderRadius: "8px",
                backgroundColor: "#f3f4f6",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#6b7280" }}
              >
                mail
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  marginBottom: "4px",
                }}
              >
                Email
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#111714",
                }}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              borderRadius: "12px",
              backgroundColor: "white",
              padding: "16px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "40px",
                width: "40px",
                minWidth: "40px",
                borderRadius: "8px",
                backgroundColor: "#f3f4f6",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#6b7280" }}
              >
                phone
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  marginBottom: "4px",
                }}
              >
                Phone
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#111714",
                }}
              >
                {user.phone ? `+${user.phone}` : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "16px",
              fontWeight: "500",
              color: "#dc2626",
              cursor: "pointer",
              fontFamily: "'Work Sans', sans-serif",
            }}
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "sticky",
          bottom: "0",
          display: "flex",
          justifyContent: "space-around",
          borderTop: "1px solid #dce5df",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
          padding: "8px",
          gap: "8px",
        }}
      >
        {/* Map */}
        <a
          href="/mainscreen"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            flex: 1,
            borderRadius: "8px",
            padding: "8px",
            textDecoration: "none",
            color: "#9ca3af",
            fontSize: "12px",
            fontFamily: "'Work Sans', sans-serif",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#4b5563")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          <span className="material-symbols-outlined">map</span>
          <span>Map</span>
        </a>

        {/* Profile (Active) */}
        <a
          href="#"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            flex: 1,
            borderRadius: "8px",
            backgroundColor: "rgba(29, 201, 98, 0.1)",
            padding: "8px",
            textDecoration: "none",
            color: "#1dc962",
            fontSize: "12px",
            fontWeight: "bold",
            fontFamily: "'Work Sans', sans-serif",
          }}
        >
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
};

export default RiderProfile;
