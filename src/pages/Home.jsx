import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay usuario logeado en localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
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
    padding: "0 24px",
    "&:hover": {
      backgroundColor: "#0d2a5c",
    },
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-4"
      style={{ backgroundColor: "#60BE1A" }}
    >
      <div className="flex items-center justify-center flex-grow">
        <div className="card w-full max-w-md bg-transparent shadow-none">
          <div className="card-body text-center">
            {!user ? (
              <>
                <h1 className="text-4xl font-normal mb-6 text-white">
                  Welcome
                </h1>
                <p className="text-sm text-center text-white mb-12">
                  Please login or register to continue
                </p>

                <button
                  onClick={handleLogin}
                  style={{
                    ...buttonStyle,
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  Login
                </button>

                <button
                  onClick={handleRegister}
                  style={{ ...buttonStyle, width: "100%" }}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-normal mb-2 text-white">
                  Welcome!
                </h1>
                <p className="text-sm text-white mb-12">{user.name}</p>

                <button
                  onClick={handleProfile}
                  style={{
                    height: "48px",
                    borderRadius: "9999px",
                    backgroundColor: "white",
                    border: "2px solid white",
                    color: "#123B7E",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    width: "100%",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#60BE1A";
                    e.target.style.color = "white";
                    e.target.style.borderColor = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#123B7E";
                    e.target.style.borderColor = "white";
                  }}
                >
                  View Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-white text-xs">
        &copy; All rights reserved
      </p>
    </div>
  );
};

export default Home;
