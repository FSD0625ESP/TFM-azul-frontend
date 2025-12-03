import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ChatBox from "../components/ChatBox"; // tu ChatBox
import { useContext } from "react";
import { WSContext } from "../context/WebSocketContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ReservedLotsPage = () => {
  const navigate = useNavigate();
  const { chats, joinRoom, sendMessage, unread } = useContext(WSContext);

  const [user, setUser] = useState(null);
  const [reservedLots, setReservedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChatOrderId, setOpenChatOrderId] = useState(null); // orderId del chat abierto
  const [refreshTrigger, setRefreshTrigger] = useState(0); // para forzar refresh
  const [swipeStartY, setSwipeStartY] = useState(null); // para detectar swipe
  const [deliveryStates, setDeliveryStates] = useState({}); // { lotId: "pending"|"loading"|"success"|"error" }

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
        // La página vuelve a ser visible, refrescar
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Fetch reserved lots - se ejecuta cuando user cambia o refreshTrigger cambia
  useEffect(() => {
    const fetchReservedLots = async () => {
      try {
        if (!user) return;

        setLoading(true);
        const userId = user.id || user._id;
        const res = await axios.get(`${API_URL}/lots`);
        const lots = res.data || [];

        const reserved = lots.filter((lot) => {
          if (!lot.reserved) return false;

          // lot.rider puede ser un objeto (populated) o un string (id)
          const lotRiderId =
            typeof lot.rider === "object" ? lot.rider?._id : lot.rider;
          return String(lotRiderId) === String(userId);
        });

        console.log("Reserved lots:", reserved);
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

  // No necesitamos actualizar distancias continuamente - solo al entregar
  // Mantener el useEffect vacío para evitar errores de geolocalización

  // Función para desreservar un lote
  const handleUnreserveLot = async (lotId) => {
    if (!confirm("¿Estás seguro de que quieres desreservar este lote?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado");
        return;
      }

      await axios.post(
        `${API_URL}/lots/${lotId}/unreserve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Lote desreservado correctamente");
      // Refrescar la lista
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Error desreservando lote:", err);
      toast.error(
        "Error desreservando lote: " +
          (err?.response?.data?.message || err.message)
      );
    }
  };

  // Función para entregar el lote
  const handleDeliverLot = async (lotId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado");
        return;
      }

      setDeliveryStates((prev) => ({ ...prev, [lotId]: "loading" }));
      toast.info("Obteniendo tu ubicación...");

      // Obtener ubicación del rider con estrategia de reintentos y caché
      let position = null;
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts && !position) {
        try {
          position = await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error("Timeout expired"));
            }, 60000); // 60 segundos de timeout

            navigator.geolocation.getCurrentPosition(
              (pos) => {
                clearTimeout(timeoutId);
                resolve(pos);
              },
              (err) => {
                clearTimeout(timeoutId);
                reject(err);
              },
              {
                enableHighAccuracy: false, // Usar ubicación rápida (menos precisa)
                timeout: 50000, // Timeout más largo
                maximumAge: 30000, // Permitir ubicación en caché de hasta 30 segundos
              }
            );
          });
        } catch (err) {
          attempts++;
          console.log(
            `Intento ${attempts}/${maxAttempts} fallido:`,
            err.message
          );

          if (attempts < maxAttempts) {
            toast.info(`Reintentando... (${attempts}/${maxAttempts})`);
            await new Promise((r) => setTimeout(r, 2000)); // Esperar 2 segundos
          }
        }
      }

      if (!position) {
        toast.error(
          "❌ No se pudo obtener tu ubicación después de varios intentos.\n\n✅ Soluciones:\n1. Activa el GPS en tu dispositivo\n2. Da permisos de ubicación al navegador\n3. Abre el navegador en modo ubicación de precisión\n4. Intenta en un lugar abierto (sin techos)\n5. Recarga la página y vuelve a intentar"
        );
        setDeliveryStates((prev) => ({ ...prev, [lotId]: "error" }));
        return;
      }

      const { latitude, longitude } = position.coords;
      console.log(
        `📍 Ubicación obtenida: lat=${latitude}, lng=${longitude}, precisión=${position.coords.accuracy}m`
      );

      // Enviar solicitud de entrega
      const res = await axios.post(
        `${API_URL}/lots/${lotId}/deliver`,
        {
          riderLat: latitude,
          riderLng: longitude,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("¡Lote entregado correctamente!");
      setDeliveryStates((prev) => ({ ...prev, [lotId]: "success" }));

      // Refrescar después de 2 segundos
      setTimeout(() => {
        setRefreshTrigger((prev) => prev + 1);
      }, 2000);
    } catch (err) {
      console.error("Error entregando lote:", err);
      let errorMsg = "Error entregando el lote";

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
    const swipeDistance = swipeStartY - endY; // Positivo si es swipe up

    // Si swipe up >= 50px, intentar entregar
    if (swipeDistance >= 50) {
      handleDeliverLot(lotId);
    }

    setSwipeStartY(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8f7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f7] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-4 p-4">
          <h1 className="text-lg font-bold text-gray-900 m-0">Reserved Lots</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pt-4 space-y-3">
        {reservedLots.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-100 mt-4">
            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">
              inventory_2
            </span>
            <p className="text-gray-500 text-sm">No reserved lots yet</p>
          </div>
        )}

        {reservedLots.map((lot) => {
          const pickupTime = new Date(lot.pickupDeadline).toLocaleTimeString(
            "es-ES",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
          const pickupDate = new Date(lot.pickupDeadline).toLocaleDateString(
            "es-ES"
          );
          const storeName = lot.shop?.name || "Unknown Store";
          const storeType = lot.shop?.type || "Store";
          const isPickedUp = lot.pickedUp;
          const isDelivered = lot.delivered;
          const deliveryState = deliveryStates[lot._id] || "pending";

          return (
            <div
              key={lot._id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              onTouchStart={(e) => handleTouchStart(e, lot._id)}
              onTouchEnd={(e) => handleTouchEnd(e, lot._id)}
            >
              {/* Status Badge */}
              {isDelivered && (
                <div className="mb-2 inline-block bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-semibold">
                  ✓ Delivered
                </div>
              )}
              {isPickedUp && !isDelivered && (
                <div className="mb-2 inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold">
                  Swipe up to deliver
                </div>
              )}

              {/* Lot Image */}
              {lot.image && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img
                    src={lot.image}
                    alt={lot.name}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              {/* Lot Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base m-0">
                    {lot.name}
                  </h3>
                  <p className="text-xs text-gray-500 m-0 mt-1">
                    {storeName} • {storeType}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold">
                    {pickupTime}
                  </div>
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 m-0 mb-2">
                Pickup: {pickupDate}
              </p>

              {/* Description */}
              {lot.description && (
                <p className="text-sm text-gray-600 m-0 mb-3 leading-relaxed">
                  {lot.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-2 mt-3">
                {/* Cancel Button - Left */}
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

                {/* Chat Button - Right */}
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

                {/* Deliver Button - Show when picked up and not delivered */}
                {isPickedUp && !isDelivered && (
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
                        <span>Deliver</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* Chat Modal */}
      {openChatOrderId && user && (
        <div className="fixed bottom-0 right-0 w-80 h-96 bg-black text-white border shadow-lg rounded-lg p-4 flex flex-col z-50">
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
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-gray-200 bg-white/80 backdrop-blur-sm p-2 gap-2">
        <a
          href="/mainscreen"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg p-2 no-underline text-gray-400 text-xs hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">map</span>
          <span>Map</span>
        </a>

        <a
          href="#"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg bg-emerald-50 p-2 no-underline text-emerald-500 text-xs font-bold"
        >
          <span className="material-symbols-outlined">bookmark</span>
          <span>Reserved</span>
        </a>

        <a
          href="/rider-profile"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg p-2 no-underline text-gray-400 text-xs hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
};

export default ReservedLotsPage;
