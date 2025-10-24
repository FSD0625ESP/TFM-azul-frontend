import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditFoodLotModal from "../components/EditFoodLotModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const LotsPage = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  useEffect(() => {
    const storeData = localStorage.getItem("store");
    if (storeData) {
      setStore(JSON.parse(storeData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (store) {
      fetchLots();
    }
  }, [store]);

  const fetchLots = async () => {
    try {
      const response = await axios.get(`${API_URL}/lots`);
      console.log("Todos los lotes:", response.data);
      console.log("Store actual:", store);

      // Filter lots for this store
      const storeId = store?._id || store?.id;
      const storeLots = response.data.filter((lot) => {
        const lotShopId = lot.shop?._id || lot.shop?.id;
        console.log(
          `Comparando lot.shop: ${lotShopId} con store._id: ${storeId}`
        );
        return lotShopId === storeId;
      });

      console.log("Lotes filtrados:", storeLots);
      setLots(storeLots);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching lots:", err);
      setLoading(false);
    }
  };

  const handleDeleteLot = async (lotId) => {
    if (!confirm("Are you sure you want to delete this lot?")) return;

    try {
      await axios.delete(`${API_URL}/lots/${lotId}`);
      setLots(lots.filter((lot) => lot._id !== lotId));
    } catch (err) {
      console.error("Error deleting lot:", err);
      alert("Error deleting lot");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f6f8f7",
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f6f8f7",
        fontFamily: "'Work Sans', sans-serif",
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
        {/* Header */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#111714",
            marginBottom: "24px",
          }}
        >
          Food Lots
        </h1>

        {lots.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 16px",
              color: "#6b7280",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "48px",
                marginBottom: "16px",
                display: "block",
                color: "#d1d5db",
              }}
            >
              inbox
            </span>
            <p style={{ fontSize: "16px" }}>No food lots yet</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Go to Profile and add your first lot
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {lots.map((lot) => (
              <div
                key={lot._id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Lot Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#111714",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {lot.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        margin: 0,
                      }}
                    >
                      Created:{" "}
                      {new Date(lot.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => {
                        setSelectedLot(lot);
                        setIsEditModalOpen(true);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "#1dc962",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteLot(lot._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>

                {/* Lot Description */}
                {lot.description && (
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#4b5563",
                      margin: "0 0 12px 0",
                      lineHeight: "1.5",
                    }}
                  >
                    {lot.description}
                  </p>
                )}

                {/* Pickup Deadline */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#111714",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px" }}
                  >
                    schedule
                  </span>
                  <span>
                    Pickup by:{" "}
                    {(() => {
                      const date = new Date(lot.pickupDeadline);
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );
                      return `${hours}:${minutes}`;
                    })()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "sticky",
          bottom: 0,
          display: "flex",
          justifyContent: "space-around",
          borderTop: "1px solid #dce5df",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
          padding: "8px",
          gap: "8px",
        }}
      >
        {/* Lots (Active) */}
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
            backgroundColor: "rgba(29, 201, 98, 0.1)",
            padding: "8px",
            textDecoration: "none",
            color: "#1dc962",
            fontSize: "12px",
            fontWeight: "bold",
            fontFamily: "'Work Sans', sans-serif",
          }}
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span>Lots</span>
        </a>

        {/* Profile */}
        <a
          href="/store-profile"
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
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </a>
      </nav>

      {/* Edit Food Lot Modal */}
      <EditFoodLotModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLot(null);
        }}
        lot={selectedLot}
        onSuccess={() => {
          setIsEditModalOpen(false);
          setSelectedLot(null);
          fetchLots();
        }}
      />
    </div>
  );
};

export default LotsPage;
