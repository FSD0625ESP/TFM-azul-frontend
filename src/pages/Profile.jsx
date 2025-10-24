import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  createLot,
  getShopLots,
  deleteLot,
  getShopByUserId,
} from "../services/lotService.js";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lots, setLots] = useState([]);
  const [showLotForm, setShowLotForm] = useState(false);
  const [lotName, setLotName] = useState("");
  const [lotDescription, setLotDescription] = useState("");
  const [loadingLots, setLoadingLots] = useState(false);
  const [shopId, setShopId] = useState(null);
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

  // Cargar lotes si es shop
  useEffect(() => {
    if (user?.user_type === "shop") {
      if (user?.shopId) {
        console.log("Shop ID encontrado en usuario:", user.shopId);
        setShopId(user.shopId);
        fetchLots(user.shopId);
      } else if (user?.id) {
        // Si no hay shopId, buscarlo por userId
        console.log("No hay shopId, buscando por userId:", user.id);
        const findShop = async () => {
          try {
            const shop = await getShopByUserId(user.id);
            if (shop && shop._id) {
              console.log("Shop encontrada por userId:", shop._id);
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
      console.log("Obteniendo lotes para shop:", id);
      setLoadingLots(true);
      const lotsData = await getShopLots(id);
      console.log("Lotes obtenidos:", lotsData);
      setLots(lotsData);
    } catch (err) {
      console.error("Error fetching lots:", err);
    } finally {
      setLoadingLots(false);
    }
  };

  const handleAddLot = async () => {
    console.log(
      "Agregando lote. shopId:",
      shopId,
      "lotName:",
      lotName,
      "lotDescription:",
      lotDescription
    );

    if (!lotName.trim()) {
      alert("Por favor ingresa el nombre del lote");
      return;
    }

    if (!shopId) {
      alert("Error: No se pudo encontrar tu tienda. shopId es undefined");
      console.error("shopId es null/undefined");
      return;
    }

    try {
      console.log(
        "Creando lote con shopId:",
        shopId,
        "nombre:",
        lotName,
        "descripción:",
        lotDescription
      );
      const result = await createLot(shopId, lotName, lotDescription);
      console.log("Lote creado:", result);
      setLotName("");
      setLotDescription("");
      setShowLotForm(false);
      await fetchLots(shopId);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al crear el lote: " + JSON.stringify(err));
    }
  };

  const handleDeleteLot = async (lotId) => {
    console.log("Eliminando lote:", lotId);
    try {
      const result = await deleteLot(lotId);
      console.log("Lote eliminado:", result);
      await fetchLots(shopId);
    } catch (err) {
      alert("Error al eliminar el lote: " + JSON.stringify(err));
      console.error(err);
    }
  };

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

                  {/* Lots section - Solo para Shops */}
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
                              </div>
                              <button
                                onClick={() => handleDeleteLot(lot._id)}
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
                                onMouseEnter={(e) =>
                                  (e.target.style.opacity = "0.85")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.opacity = "1")
                                }
                              >
                                Delete
                              </button>
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
                              onMouseEnter={(e) =>
                                (e.target.style.opacity = "0.85")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.opacity = "1")
                              }
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setShowLotForm(false);
                                setLotName("");
                                setLotDescription("");
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
                              onMouseEnter={(e) =>
                                (e.target.style.opacity = "0.85")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.opacity = "1")
                              }
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
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
                          onMouseEnter={(e) =>
                            (e.target.style.opacity = "0.85")
                          }
                          onMouseLeave={(e) => (e.target.style.opacity = "1")}
                        >
                          Add Lot
                        </button>
                      )}
                    </div>
                  )}

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
