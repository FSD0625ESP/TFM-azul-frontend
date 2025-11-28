import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// Chat handled from ReservedLotsPage; do not auto-open chat here

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const StoreLotsPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const storeId =
    params.storeId ||
    location?.state?.storeId ||
    sessionStorage.getItem("selectedStoreId");

  const [store, setStore] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Chat is managed from ReservedLotsPage; do not auto-open here

  // Obtener usuario
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Abrir chat si hay storeId
  useEffect(() => {
    if (storeId) {
      sessionStorage.setItem("selectedStoreId", storeId);
    }
  }, [storeId]);

  // Fetch lots y store info
  useEffect(() => {
    const fetchLots = async () => {
      try {
        const lotsResponse = await axios.get(`${API_URL}/lots`);
        const storeLots = lotsResponse.data.filter(
          (lot) => String(lot.shop?._id || lot.shop) === String(storeId)
        );
        console.debug(
          "[StoreLotsPage] fetched storeLots:",
          storeLots.map((l) => ({
            id: l._id,
            reserved: l.reserved,
            pickedUp: l.pickedUp,
          }))
        ); // debug
        // Determinar si el usuario actual es el owner de la tienda
        const storedStore = localStorage.getItem("store");
        const isOwner = storedStore
          ? String(
              JSON.parse(storedStore)?._id || JSON.parse(storedStore)?.id
            ) === String(storeId)
          : false;

        // Si es owner mostrar todos los lotes (incluyendo reservados) para que
        // la tienda pueda ver el estado `pickedUp`. Si no, mostrar solo los no reservados.
        const visibleLots = isOwner
          ? storeLots
          : storeLots.filter((lot) => !lot.reserved);

        setLots(visibleLots);

        if (storeLots.length > 0 && typeof storeLots[0].shop === "object") {
          setStore(storeLots[0].shop);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching lots:", err);
        toast.error("Error loading lots");
        setLoading(false);
      }
    };

    if (storeId) fetchLots();
    else {
      toast.error("Tienda no seleccionada");
      navigate(-1);
    }
  }, [storeId]);

  // Polling ligero: refrescar lista cada 5s para reflejar cambios (p.ej. pickedUp)
  useEffect(() => {
    if (!storeId) return undefined;

    const interval = setInterval(async () => {
      try {
        const lotsResponse = await axios.get(`${API_URL}/lots`);
        const storeLots = lotsResponse.data.filter(
          (lot) => String(lot.shop?._id || lot.shop) === String(storeId)
        );
        console.debug(
          "[StoreLotsPage] polling fetched storeLots:",
          storeLots.map((l) => ({
            id: l._id,
            reserved: l.reserved,
            pickedUp: l.pickedUp,
          }))
        ); // debug

        const storedStore = localStorage.getItem("store");
        const isOwner = storedStore
          ? String(
              JSON.parse(storedStore)?._id || JSON.parse(storedStore)?.id
            ) === String(storeId)
          : false;

        const visibleLots = isOwner
          ? storeLots
          : storeLots.filter((lot) => !lot.reserved);
        setLots(visibleLots);
      } catch (err) {
        // silencioso: no molestar al usuario con errores de polling
        console.error("Polling error fetching lots:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [storeId]);

  // Reservar lote y abrir chat
  const handleReserve = async (lotId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Necesitas iniciar sesión para reservar");
        return;
      }

      const resp = await axios.post(
        `${API_URL}/lots/${lotId}/reserve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (resp?.data?.lot) {
        const updatedLot = resp.data.lot;
        if (updatedLot.reserved) {
          setLots((prev) => prev.filter((l) => l._id !== updatedLot._id));
        } else {
          setLots((prev) =>
            prev.map((l) => (l._id === updatedLot._id ? updatedLot : l))
          );
        }

        toast.success("Lote reservado correctamente");
        // No abrir chat automáticamente al reservar. El chat se usa desde
        // la sección "Reserved Lots".
      } else {
        toast.error("No se pudo reservar el lote");
      }
    } catch (err) {
      console.error("Error reservando lote:", err);
      toast.error(
        "Error reservando lote: " +
          (err?.response?.data?.message || err.message)
      );
    }
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
    <div className="min-h-screen bg-[#f6f8f7] pb-8">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">
              {store?.name || "Store"}
            </h1>
            <p className="text-xs text-gray-500">{store?.address}</p>
          </div>
        </div>
      </header>

      {/* Store Info */}
      {store && (
        <div className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600">
                store
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-sm">{store.name}</h2>
              <p className="text-xs text-gray-600">{store.type}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">phone</span>
                {store.phone || "No phone available"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lots List */}
      <div className="px-4 mt-4">
        {lots.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">
              inventory_2
            </span>
            <p className="text-gray-500 text-sm">No food lots available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lots.map((lot) => {
              const pickupTime = new Date(
                lot.pickupDeadline
              ).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const pickupDate = new Date(
                lot.pickupDeadline
              ).toLocaleDateString("es-ES");

              return (
                <div
                  key={lot._id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
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

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base">
                        {lot.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{pickupDate}</p>
                      <div className="flex gap-2 mt-2">
                        {!!lot.reserved && !!lot.pickedUp ? (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                            Recogido
                          </span>
                        ) : !!lot.reserved ? (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                            Reservado
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold">
                        {pickupTime}
                      </div>
                    </div>
                  </div>

                  {lot.description && (
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {lot.description}
                    </p>
                  )}

                  <button
                    onClick={() => handleReserve(lot._id)}
                    className="w-full py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                  >
                    <span className="material-symbols-outlined text-sm mr-2">
                      bookmark_add
                    </span>
                    Reservar lote
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat handled from ReservedLotsPage; no auto-popup here */}
    </div>
  );
};

export default StoreLotsPage;
