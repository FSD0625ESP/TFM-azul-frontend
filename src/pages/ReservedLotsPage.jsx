import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ChatBox from "../components/ChatBox"; // tu ChatBox
import { useContext } from "react";
import { WSContext } from "../context/WebSocketContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ReservedLotsPage = () => {
  const navigate = useNavigate();
  const { chats, joinRoom, sendMessage } = useContext(WSContext);

  const [user, setUser] = useState(null);
  const [reservedLots, setReservedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChatOrderId, setOpenChatOrderId] = useState(null); // orderId del chat abierto

  // Get current rider from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch reserved lots
  useEffect(() => {
    const fetchReservedLots = async () => {
      try {
        if (!user) return;

        const userId = user.id || user._id;
        const res = await axios.get(`${API_URL}/lots`);
        const lots = res.data || [];

        const reserved = lots.filter(
          (lot) => lot.reserved && String(lot.rider) === String(userId)
        );

        setReservedLots(reserved);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reserved lots:", err);
        toast.error("Error loading reserved lots");
        setLoading(false);
      }
    };

    if (user) fetchReservedLots();
  }, [user]);

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

          return (
            <div
              key={lot._id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
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

              {/* Reserved Status */}
              <div className="flex justify-between items-center">
                <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">
                    check_circle
                  </span>
                  <p className="text-xs text-emerald-700 font-medium m-0">
                    Reserved
                  </p>
                </div>

                {/* Chat Button */}
                <button
                  onClick={() => setOpenChatOrderId(lot._id)}
                  className="px-3 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600"
                >
                  Chat with Store
                </button>
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
