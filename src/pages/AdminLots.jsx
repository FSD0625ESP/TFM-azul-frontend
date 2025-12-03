import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminLots = () => {
  const navigate = useNavigate();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, reserved, available

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/lots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLots(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lots:", error);
      toast.error("Error loading lots");
      setLoading(false);
    }
  };

  const filteredLots = lots.filter((lot) => {
    if (filter === "reserved") return lot.reserved;
    if (filter === "available") return !lot.reserved;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">View Lots</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === "available"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setFilter("reserved")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === "reserved"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Reserved
            </button>
          </div>
        </div>
      </header>

      {/* Lots List */}
      <main className="p-6 max-w-7xl mx-auto">
        {filteredLots.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">
              inventory_2
            </span>
            <p className="text-gray-500 text-sm">No lots found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredLots.map((lot) => {
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
                  className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    {lot.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={lot.image}
                          alt={lot.name}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {lot.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {lot.shop?.name || "Unknown Store"} •{" "}
                            {lot.shop?.type || "Store"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              lot.reserved && lot.pickedUp
                                ? "bg-emerald-100 text-emerald-700"
                                : lot.reserved
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {lot.reserved && lot.pickedUp
                              ? "Picked Up"
                              : lot.reserved
                              ? "Reserved"
                              : "Available"}
                          </div>
                        </div>
                      </div>

                      {lot.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {lot.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">
                            schedule
                          </span>
                          <span>
                            {pickupDate} at {pickupTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">
                            location_on
                          </span>
                          <span>{lot.shop?.address || "N/A"}</span>
                        </div>
                      </div>

                      {/* Reserved By */}
                      {lot.reserved && lot.rider && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600 text-base">
                              person
                            </span>
                            <span className="text-sm text-gray-700">
                              Reserved by: <strong>{lot.rider.name}</strong> (
                              {lot.rider.email})
                            </span>
                            {lot.rider.phone && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600">
                                  {lot.rider.phone}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLots;
