import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buttonStyleInline } from "../styles/commonStyles";

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
    navigate("/select-user-type");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
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
                <h1 className="text-5xl font-bold text-center mb-4 text-white">
                  SoulBites
                </h1>
                <p className="text-sm text-center text-white mb-12">
                  Our main objective is to provide users with an intuitive and
                  easy-to-use platform where they can help the most
                  disadvantaged without having to use their own financial
                  resources.
                </p>

                <button
                  onClick={handleRegister}
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
                    marginBottom: "12px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >
                  Register
                </button>

                <button
                  onClick={handleLogin}
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
                  onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >
                  Login
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
