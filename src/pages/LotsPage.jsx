import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddFoodLotModal from "../components/AddFoodLotModal";
import EditFoodLotModal from "../components/EditFoodLotModal";
import ChatBox from "../components/ChatBox";
import { LotCard } from "../components/LotCard";
import { StoreBottomNav } from "../components/BottomNav";
import { useLots } from "../hooks/useLots";

const LotsPage = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [openChatOrderId, setOpenChatOrderId] = useState(null);

  const storeId = store?._id || store?.id;
  const { lots, loading, refresh, handleDelete } = useLots({
    storeId,
    autoRefresh: false,
  });

  useEffect(() => {
    const storeData = localStorage.getItem("store");
    if (storeData) {
      setStore(JSON.parse(storeData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8f7]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f7]">
      <main className="flex-1 p-4 flex flex-col pb-20 pt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Food Lots</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 border-none text-sm font-bold text-white cursor-pointer shadow-lg hover:bg-emerald-600 transition-colors h-10"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="leading-none">Add Lot</span>
          </button>
        </div>

        {/* Lots List */}
        {lots.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <span className="material-symbols-outlined text-5xl mb-4 block text-gray-300">
              inbox
            </span>
            <p className="text-base">No food lots yet</p>
            <p className="text-sm mt-2">
              Click "Add Lot" to create your first lot
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {lots.map((lot) => (
              <LotCard
                key={lot._id}
                lot={lot}
                userType="store"
                onEdit={(lot) => {
                  setSelectedLot(lot);
                  setIsEditModalOpen(true);
                }}
                onDelete={handleDelete}
                onChat={(lotId) => setOpenChatOrderId(lotId)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <StoreBottomNav />

      {/* Modals */}
      <AddFoodLotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        storeId={storeId}
        onSuccess={() => {
          setIsAddModalOpen(false);
          refresh();
        }}
      />

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
          refresh();
        }}
      />

      {/* Chat */}
      {openChatOrderId && store && (
        <div className="fixed bottom-0 right-0 w-80 h-96 bg-black text-white border shadow-lg rounded-lg p-4 flex flex-col z-50">
          <ChatBox
            orderId={openChatOrderId}
            userType="store"
            userId={store._id}
          />
          <button
            onClick={() => setOpenChatOrderId(null)}
            className="absolute top-1 right-1 text-white bg-gray-800 px-2 rounded hover:bg-gray-700 text-xs"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default LotsPage;
