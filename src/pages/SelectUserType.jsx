import React from "react";
import { useNavigate } from "react-router-dom";

const SelectUserType = () => {
  const navigate = useNavigate();

  const handleRider = () => {
    sessionStorage.setItem("userType", "rider");
    navigate("/register");
  };

  const handleShop = () => {
    sessionStorage.setItem("userType", "shop");
    navigate("/register");
  };

  const handleGoBack = () => {
    sessionStorage.removeItem("userType");
    navigate("/");
  };

  const buttonStyle = {
    height: "56px",
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
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-4"
      style={{ backgroundColor: "#60BE1A" }}
    >
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">
            Join SoulBites
          </h1>
          <p className="text-sm text-center text-white mb-12">
            Choose how you want to help
          </p>

          <button
            onClick={handleRider}
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            I want to be a Rider
          </button>

          <button
            onClick={handleShop}
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            I want to be a Shop
          </button>

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
        </div>
      </div>

      <p className="text-center text-white text-xs">
        &copy; All rights reserved
      </p>
    </div>
  );
};

export default SelectUserType;
