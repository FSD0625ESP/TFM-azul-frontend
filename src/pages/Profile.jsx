import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = createTheme();

  useEffect(() => {
    // Obtener usuario de localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirigir a login si no hay usuario
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirigir a home
    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/mainscreen");
  };

  const buttonStyle = {
    height: "48px",
    borderRadius: "9999px",
    backgroundColor: "#123B7E",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
    textTransform: "none",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
    "&:hover": {
      backgroundColor: "#0d2a5c",
    },
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: "#60BE1A" }}
        >
          <p className="text-white">Loading...</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div
        className="min-h-screen flex flex-col justify-between p-4"
        style={{ backgroundColor: "#60BE1A" }}
      >
        <div className="flex items-center justify-center flex-grow">
          <div className="card w-full max-w-md bg-white shadow-lg">
            <div className="card-body p-8">
              <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                Profile
              </h1>

              {user && (
                <div className="space-y-6">
                  {/* Name */}
                  <div className="border-b pb-4">
                    <p className="text-gray-500 text-sm mb-1">Name</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {user.name}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="border-b pb-4">
                    <p className="text-gray-500 text-sm mb-1">Email</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {user.email}
                    </p>
                  </div>

                  {/* ID */}
                  <div className="border-b pb-4">
                    <p className="text-gray-500 text-sm mb-1">ID</p>
                    <p className="text-xs font-mono text-gray-600 break-all">
                      {user.id}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 mt-8">
                    <button
                      onClick={handleLogout}
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
                        marginBottom: "12px",
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                      onMouseLeave={(e) => (e.target.style.opacity = "1")}
                    >
                      Logout
                    </button>

                    {user.user_type === "rider" && (
                      <button
                        onClick={handleGoBack}
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
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-white text-xs">
          &copy; All rights reserved
        </p>
      </div>
    </ThemeProvider>
  );
};

export default Profile;
