import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AddFoodLotModal from "../components/AddFoodLotModal";
import EditFoodLotModal from "../components/EditFoodLotModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const LotsPage = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
      toast.success("Lot deleted successfully");
    } catch (err) {
      console.error("Error deleting lot:", err);
      toast.error("Error deleting lot");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8f7]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f7]">
      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col pb-20 pt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Food Lots</h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                // QR functionality will be implemented in the future
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2 border-none text-sm font-bold text-white cursor-pointer shadow-lg hover:bg-blue-600 transition-colors h-10"
              title="Generate Store QR Code"
            >
              <span className="material-symbols-outlined">qr_code_2</span>
              <span className="leading-none">QR</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 border-none text-sm font-bold text-white cursor-pointer shadow-lg hover:bg-emerald-600 transition-colors h-10"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span className="leading-none">Add</span>
            </button>
          </div>
        </div>

        {lots.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <span className="material-symbols-outlined text-5xl mb-4 block text-gray-300">
              inbox
            </span>
            <p className="text-base">No food lots yet</p>
            <p className="text-sm mt-2">Go to Profile and add your first lot</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {lots.map((lot) => (
              <div key={lot._id} className="bg-white rounded-lg p-4 shadow-sm">
                {/* Lot Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 m-0 mb-1">
                      {lot.name}
                    </h3>
                    <p className="text-xs text-gray-400 m-0">
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedLot(lot);
                        setIsEditModalOpen(true);
                      }}
                      className="bg-transparent border-none text-xl cursor-pointer text-emerald-500 flex items-center justify-center hover:text-emerald-600"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteLot(lot._id)}
                      className="bg-transparent border-none text-red-600 cursor-pointer text-xl flex items-center justify-center hover:text-red-700"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>

                {/* Lot Description */}
                {lot.description && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {lot.description}
                  </p>
                )}

                {/* Pickup Deadline */}
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <span className="material-symbols-outlined text-base">
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
      <nav className="fixed bottom-0 w-full flex justify-around border-t border-gray-300 bg-white/80 backdrop-blur p-2 gap-2">
        {/* Lots (Active) */}
        <a
          href="/lots"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg bg-emerald-500/10 p-2 no-underline text-emerald-500 text-xs font-bold hover:bg-emerald-500/20"
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span>Lots</span>
        </a>

        {/* Profile */}
        <a
          href="/store-profile"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg p-2 no-underline text-gray-400 text-xs hover:text-gray-600 transition-colors"
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

      {/* Add Food Lot Modal */}
      <AddFoodLotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        storeId={store?._id || store?.id}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchLots();
        }}
      />
    </div>
  );
};

export default LotsPage;
