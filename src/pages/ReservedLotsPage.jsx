// src/pages/ReservedLotsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ChatBox from "../components/ChatBox";
import { WSContext } from "../context/WebSocketContext";
import { BottomNav } from "../components/BottomNav";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ReservedLotsPage = () => {
  const navigate = useNavigate();
  const { chats, joinRoom, sendMessage, unread } = useContext(WSContext);

  const [user, setUser] = useState(null);
  const [reservedLots, setReservedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChatOrderId, setOpenChatOrderId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [swipeStartY, setSwipeStartY] = useState(null);
  const [deliveryStates, setDeliveryStates] = useState({}); // { lotId: "pending"|"loading"|"success"|"error" }
  const [distanceStates, setDistanceStates] = useState({}); // { lotId: { allowed: true/false, distance: number } }

  // Get current rider from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Refrescar cuando la página vuelve a tener foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Fetch reserved lots
  useEffect(() => {
    const fetchReservedLots = async () => {
      try {
        if (!user) return;

        setLoading(true);
        const res = await axios.get(`${API_URL}/lots`);
        const lots = res.data || [];

        const userId = user.id || user._id;
        const reserved = lots.filter((lot) => {
          if (!lot.reserved) return false;
          const lotRiderId =
            typeof lot.rider === "object" ? lot.rider?._id : lot.rider;
          return String(lotRiderId) === String(userId);
        });

        setReservedLots(reserved);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reserved lots:", err);
        toast.error("Error loading reserved lots");
        setLoading(false);
      }
    };

    if (user) fetchReservedLots();
  }, [user, refreshTrigger]);

  // cada vez que cambia reservedLots, comprobar distancia para los que están pickedUp && !delivered
  useEffect(() => {
    const checkAll = async () => {
      for (const lot of reservedLots) {
        if (lot.pickedUp && !lot.delivered) {
          // comprobamos distancia (no bloqueante)
          checkDistanceForLot(lot._id, false);
        } else {
          // limpiar estado si no aplica
          setDistanceStates((prev) => {
            const copy = { ...prev };
            delete copy[lot._id];
            return copy;
          });
        }
      }
    };

    checkAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservedLots]);

  // UTIL: obtener la ubicación con reintentos
  const getPositionWithRetries = async (maxAttempts = 3, options = {}) => {
    let attempts = 0;
    let position = null;
    while (attempts < maxAttempts && !position) {
      try {
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            (err) => reject(err),
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 0,
              ...options,
            },
          );
        });
      } catch (err) {
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, 800));
        }
      }
    }
    return position;
  };

  // FUNCION: checkDistanceForLot -> consulta backend /lots/:id/check-distance
  const checkDistanceForLot = async (lotId, showToasts = true) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (showToasts) toast.error("You are not authenticated");
        return;
      }

      const position = await getPositionWithRetries(2);
      if (!position) {
        if (showToasts)
          toast.error(
            "Location could not be obtained. Please enable GPS and allow permissions..",
          );
        // marcar como desconocido (no permitido)
        setDistanceStates((prev) => ({ ...prev, [lotId]: { allowed: false } }));
        return;
      }

      const { latitude, longitude } = position.coords;

      const res = await axios.post(
        `${API_URL}/lots/${lotId}/check-distance`,
        { riderLat: latitude, riderLng: longitude },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { allowed, distance } = res.data;
      setDistanceStates((prev) => ({
        ...prev,
        [lotId]: { allowed, distance },
      }));

      if (!allowed && showToasts) {
        toast.info(
          `You are ${(distance * 1000).toFixed(0)}m from the nearest point.`,
        );
      }
    } catch (err) {
      console.error("checkDistanceForLot error:", err);
      if (showToasts) {
        toast.error("Error checking distance");
      }
      setDistanceStates((prev) => ({ ...prev, [lotId]: { allowed: false } }));
    }
  };

  // Función para desreservar un lote
  const handleUnreserveLot = async (lotId) => {
    if (!confirm("Are you sure you want to unreserve this lot?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated");
        return;
      }

      await axios.post(
        `${API_URL}/lots/${lotId}/unreserve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Lot unreserved successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Error unreserving lot:", err);
      toast.error(
        "Error unreserving lot: " +
          (err?.response?.data?.message || err.message),
      );
    }
  };

  // Función para entregar el lote (comprueba la distancia de nuevo antes de llamar a deliver)
  const handleDeliverLot = async (lotId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated");
        return;
      }

      // Primero revalidar distancia localmente
      await checkDistanceForLot(lotId, true);
      const ds = distanceStates[lotId];
      // after checkDistanceForLot the state might not be updated immediately,
      // so fetch current value from distanceStates + fallback: request backend if unknown
      const current =
        (distanceStates[lotId] && distanceStates[lotId].allowed) || false;

      setDeliveryStates((prev) => ({ ...prev, [lotId]: "loading" }));
      toast.info("Obtaining your location and registering delivery...");

      // obtener posición y mandar al endpoint /deliver
      const position = await getPositionWithRetries(3, {
        enableHighAccuracy: true,
        timeout: 15000,
      });
      if (!position) {
        toast.error(
          "Location could not be obtained. Please verify permissions and GPS.",
        );
        setDeliveryStates((prev) => ({ ...prev, [lotId]: "error" }));
        return;
      }

      const { latitude, longitude } = position.coords;

      // También podemos revalidar en backend (deliver ya valida)
      const res = await axios.post(
        `${API_URL}/lots/${lotId}/deliver`,
        { riderLat: latitude, riderLng: longitude },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Lot delivered successfully!");
      setDeliveryStates((prev) => ({ ...prev, [lotId]: "success" }));

      setTimeout(() => {
        setRefreshTrigger((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error delivering lot:", err);
      let errorMsg = "Error delivering the lot";

      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }

      toast.error(errorMsg);
      setDeliveryStates((prev) => ({ ...prev, [lotId]: "error" }));
    }
  };

  // Manejo de swipe up
  const handleTouchStart = (e, lotId) => {
    const lot = reservedLots.find((l) => l._id === lotId);
    if (lot?.pickedUp && !lot?.delivered) {
      setSwipeStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e, lotId) => {
    if (swipeStartY === null) return;

    const endY = e.changedTouches[0].clientY;
    const swipeDistance = swipeStartY - endY;

    if (swipeDistance >= 50) {
      handleDeliverLot(lotId);
    }

    setSwipeStartY(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8f7] dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f7] dark:bg-gray-900 pb-20">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center gap-4 p-4 max-w-7xl mx-auto">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white m-0">
            Reserved Lots
          </h1>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-6 lg:px-8 pt-4 max-w-7xl mx-auto w-full">
        {reservedLots.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-100 dark:border-gray-700 mt-4">
            <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 block mb-2">
              inventory_2
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No reserved lots yet
            </p>
          </div>
        )}

        <div className="grid-responsive">
          {reservedLots.map((lot) => {
            const pickupTime = new Date(lot.pickupDeadline).toLocaleTimeString(
              "es-ES",
              { hour: "2-digit", minute: "2-digit" },
            );
            const pickupDate = new Date(lot.pickupDeadline).toLocaleDateString(
              "es-ES",
            );
            const storeName = lot.shop?.name || "Unknown Store";
            const storeType = lot.shop?.type || "Store";
            const isPickedUp = lot.pickedUp;
            const isDelivered = lot.delivered;
            const deliveryState = deliveryStates[lot._id] || "pending";
            const distanceInfo = distanceStates[lot._id]; // { allowed, distance }

            return (
              <div
                key={lot._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow card-hover"
                onTouchStart={(e) => handleTouchStart(e, lot._id)}
                onTouchEnd={(e) => handleTouchEnd(e, lot._id)}
              >
                {isDelivered && (
                  <div className="mb-2 inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold">
                    ✓ Delivered
                  </div>
                )}
                {isPickedUp && !isDelivered && (
                  <div className="mb-2 inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full px-3 py-1 text-xs font-semibold">
                    Swipe up to deliver
                  </div>
                )}

                {lot.image && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={lot.image}
                      alt={lot.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base m-0">
                      {lot.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 m-0 mt-1">
                      {storeName} • {storeType}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full px-3 py-1 text-xs font-semibold">
                      {pickupTime}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 m-0 mb-2">
                  Pickup: {pickupDate}
                </p>

                {lot.description && (
                  <p className="text-sm text-gray-600 m-0 mb-3 leading-relaxed">
                    {lot.description}
                  </p>
                )}

                <div className="flex justify-between items-center gap-2 mt-3">
                  <button
                    onClick={() => handleUnreserveLot(lot._id)}
                    className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center disabled:opacity-50"
                    title="Cancel reservation"
                    disabled={isPickedUp}
                  >
                    <span className="material-symbols-outlined text-sm">
                      close
                    </span>
                  </button>

                  <button
                    onClick={() => setOpenChatOrderId(lot._id)}
                    className="relative flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      chat
                    </span>
                    <span>Chat</span>
                    {unread?.[lot._id] > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 rounded-full">
                        {unread[lot._id]}
                      </span>
                    )}
                  </button>

                  {/* Deliver Button: SOLO si pickedUp && !delivered */}
                  {isPickedUp && !isDelivered && (
                    <>
                      {distanceInfo && distanceInfo.allowed ? (
                        // si el backend dijo allowed true -> mostramos botón activo
                        <button
                          onClick={() => handleDeliverLot(lot._id)}
                          className={`flex items-center justify-center gap-2 px-3 py-2 text-xs rounded transition-colors ${
                            deliveryState === "loading"
                              ? "bg-yellow-500 text-white"
                              : deliveryState === "success"
                                ? "bg-green-500 text-white"
                                : deliveryState === "error"
                                  ? "bg-red-500 text-white"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                          disabled={deliveryState === "loading"}
                        >
                          {deliveryState === "loading" ? (
                            <>
                              <span className="material-symbols-outlined text-sm animate-spin">
                                sync
                              </span>
                              <span>Delivering...</span>
                            </>
                          ) : deliveryState === "success" ? (
                            <>
                              <span className="material-symbols-outlined text-sm">
                                check_circle
                              </span>
                              <span>Delivered</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">
                                local_shipping
                              </span>
                              Get within 50 meters of the point
                              <span>Deliver</span>
                            </>
                          )}
                        </button>
                      ) : (
                        // si no está permitido o no conocemos estado -> mostramos aviso y boton reintentar
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-red-600">
                            {distanceInfo && distanceInfo.distance !== undefined
                              ? `A ${(distanceInfo.distance * 1000).toFixed(
                                  0,
                                )} m — Get within 50 meters of the point.`
                              : "Come to the location to be able to deliver."}
                          </div>
                          <button
                            onClick={() => checkDistanceForLot(lot._id, true)}
                            className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {openChatOrderId && user && (
        <div className="fixed bottom-20 md:bottom-4 right-4 w-full md:w-96 max-w-md h-96 bg-black text-white border shadow-lg rounded-lg p-4 flex flex-col z-50">
          <ChatBox
            orderId={openChatOrderId}
            userType={user.role || "rider"}
            userId={user._id}
          />
          <button
            onClick={() => setOpenChatOrderId(null)}
            className="absolute top-1 right-1 text-white bg-gray-800 px-2 rounded hover:bg-gray-700 text-xs"
          >
            Close
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ReservedLotsPage;
