import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddFoodLotModal from "../components/AddFoodLotModal";

const StoreProfile = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storeData = localStorage.getItem("store");
    if (storeData) {
      setStore(JSON.parse(storeData));
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("store");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!store) {
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
              src={store.photo || "https://via.placeholder.com/96"}
              alt="Store logo"
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
            {store.name}
          </h2>
          <p style={{ fontSize: "14px", color: "#4b5563" }}>{store.type}</p>
        </div>

        {/* Store Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Location */}
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
                location_on
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
                Address
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#111714",
                }}
              >
                {store.address}
              </p>
            </div>
          </div>

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
                {store.email}
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
                {store.phone ? `+${store.phone}` : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Add Food Lots Button */}
        <div style={{ marginBottom: "32px" }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              borderRadius: "12px",
              backgroundColor: "#1dc962",
              padding: "16px 24px",
              border: "none",
              fontSize: "16px",
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#15a351")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1dc962")}
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>Add Food Lots</span>
          </button>
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
        {/* Lots */}
        <a
          href="/lots"
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
          <span className="material-symbols-outlined">list_alt</span>
          <span>Lots</span>
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

      {/* Add Food Lot Modal */}
      <AddFoodLotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storeId={store?._id || store?.id}
        onSuccess={() => {
          // Optional: refresh store data if needed
        }}
      />
    </div>
  );
};

export default StoreProfile;
