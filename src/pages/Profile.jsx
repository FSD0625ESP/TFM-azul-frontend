import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  createLot,
  getShopLots,
  deleteLot,
  getShopByUserId,
} from "../services/lotService.js";
import Button from "../components/Button";
import FormAlert from "../components/FormAlert";
import { COLORS } from "../styles/commonStyles";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lots, setLots] = useState([]);
  const [showLotForm, setShowLotForm] = useState(false);
  const [lotName, setLotName] = useState("");
  const [lotDescription, setLotDescription] = useState("");
  const [pickupDeadline, setPickupDeadline] = useState(""); // Nuevo estado
  const [loadingLots, setLoadingLots] = useState(false);
  const [shopId, setShopId] = useState(null);
  const theme = createTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (user?.user_type === "shop") {
      if (user?.shopId) {
        setShopId(user.shopId);
        fetchLots(user.shopId);
      } else if (user?.id) {
        const findShop = async () => {
          try {
            const shop = await getShopByUserId(user.id);
            if (shop && shop._id) {
              setShopId(shop._id);
              fetchLots(shop._id);
            } else {
              console.warn("No se encontró shop para este usuario");
            }
          } catch (err) {
            console.error("Error buscando shop:", err);
          }
        };
        findShop();
      }
    }
  }, [user]);

  const fetchLots = async (id) => {
    try {
      setLoadingLots(true);
      const lotsData = await getShopLots(id);
      setLots(lotsData);
    } catch (err) {
      console.error("Error fetching lots:", err);
    } finally {
      setLoadingLots(false);
    }
  };

  const handleAddLot = async () => {
    if (!lotName.trim()) {
      alert("Por favor ingresa el nombre del lote");
      return;
    }

    if (!pickupDeadline) {
      alert("Por favor ingresa la hora límite de recogida");
      return;
    }

    if (!shopId) {
      alert("Error: No se pudo encontrar tu tienda. shopId es undefined");
      return;
    }

    try {
      const result = await createLot(
        shopId,
        lotName,
        lotDescription,
        pickupDeadline
      );
      setLotName("");
      setLotDescription("");
      setPickupDeadline("");
      setShowLotForm(false);
      await fetchLots(shopId);
    } catch (err) {
      console.error("Error al crear el lote:", err);
      alert("Error al crear el lote: " + JSON.stringify(err));
    }
  };

  const handleDeleteLot = async (lotId) => {
    try {
      await deleteLot(lotId);
      await fetchLots(shopId);
    } catch (err) {
      alert("Error al eliminar el lote: " + JSON.stringify(err));
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/mainscreen");
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
                  <div className="border-b pb-4">
                    <p className="text-gray-500 text-sm mb-1">Name</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {user.name}
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <p className="text-gray-500 text-sm mb-1">Email</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {user.email}
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <p className="text-gray-500 text-sm mb-1">ID</p>
                    <p className="text-xs font-mono text-gray-600 break-all">
                      {user.id}
                    </p>
                  </div>

                  {user.user_type === "shop" && (
                    <div className="border-b pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-500 text-sm">Lots</p>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                          {lots.length} lots
                        </span>
                      </div>

                      {loadingLots ? (
                        <p className="text-gray-600">Loading lots...</p>
                      ) : lots.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {lots.map((lot) => (
                            <div
                              key={lot._id}
                              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                            >
                              <div className="flex-1">
                                <span className="text-gray-700 font-medium">
                                  {lot.name}
                                </span>
                                <p className="text-gray-600 text-sm">
                                  {lot.description}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  Pickup by:{" "}
                                  {new Date(
                                    lot.pickupDeadline
                                  ).toLocaleString()}
                                </p>
                              </div>
                              <Button
                                variant="danger"
                                onClick={() => handleDeleteLot(lot._id)}
<<<<<<< HEAD
                                style={{
                                  padding: "4px 12px",
                                  backgroundColor: "#dc2626",
                                  color: "white",
                                  borderRadius: "6px",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  marginLeft: "8px",
                                  flexShrink: 0,
                                }}
=======
                                fullWidth={false}
                                style={{ marginBottom: 0 }}
>>>>>>> e439d30 (feat: implement reusable Button and FormAlert components, update styles and integrate into Profile and ShopDetailsForm)
                              >
                                Delete
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mb-3">
                          No lots added yet
                        </p>
                      )}

                      {showLotForm ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={lotName}
                            onChange={(e) => setLotName(e.target.value)}
                            placeholder="Enter lot name (e.g., Pizza Margarita)"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "6px",
                              border: "1px solid #e5e7eb",
                              fontSize: "14px",
                              color: "#1f2937",
                            }}
                          />
                          <textarea
                            value={lotDescription}
                            onChange={(e) => setLotDescription(e.target.value)}
                            placeholder="Enter lot description"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "6px",
                              border: "1px solid #e5e7eb",
                              fontSize: "14px",
                              color: "#1f2937",
                              minHeight: "80px",
                              fontFamily: "inherit",
                            }}
                          />
                          <input
                            type="datetime-local"
                            value={pickupDeadline}
                            onChange={(e) => setPickupDeadline(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "6px",
                              border: "1px solid #e5e7eb",
                              fontSize: "14px",
                              color: "#1f2937",
                            }}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddLot}
                              style={{
                                flex: 1,
                                padding: "8px",
                                backgroundColor: "#123B7E",
                                color: "white",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setShowLotForm(false);
                                setLotName("");
                                setLotDescription("");
                                setPickupDeadline("");
                              }}
                              style={{
                                flex: 1,
                                padding: "8px",
                                backgroundColor: "#9ca3af",
                                color: "white",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
<<<<<<< HEAD
                        <button
                          onClick={() => setShowLotForm(true)}
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
                        >
=======
                        <Button onClick={() => setShowLotForm(true)}>
>>>>>>> e439d30 (feat: implement reusable Button and FormAlert components, update styles and integrate into Profile and ShopDetailsForm)
                          Add Lot
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 mt-8">
<<<<<<< HEAD
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
                      >
                        Go Back
                      </button>
=======
                    <Button onClick={handleLogout}>Logout</Button>

                    {user.user_type === "rider" && (
                      <Button onClick={handleGoBack}>Go Back</Button>
>>>>>>> e439d30 (feat: implement reusable Button and FormAlert components, update styles and integrate into Profile and ShopDetailsForm)
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
