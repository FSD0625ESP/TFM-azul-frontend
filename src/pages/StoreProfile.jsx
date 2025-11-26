import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

const StoreProfile = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const handleShowQR = () => setShowQR(true);
  const handleCloseQR = () => setShowQR(false);

  useEffect(() => {
    const storeData = localStorage.getItem("store");
    if (storeData) {
      setStore(JSON.parse(storeData));
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("store");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!store) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Modal QR */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center relative min-w-[300px]">
            <button
              onClick={handleCloseQR}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">QR de la tienda</h3>
            <QRCodeSVG value={store?._id || store?.id || ""} size={200} />
            <p className="mt-4 text-xs text-gray-500 break-all">
              {store?._id || store?.id}
            </p>
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col pb-20 pt-4">
        {/* Profile Image and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img
              src={store.photo || "https://via.placeholder.com/96"}
              alt="Store logo"
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
            />
            <button className="absolute bottom-0 right-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 text-white border-none cursor-pointer shadow-md hover:bg-emerald-600">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {store.name}
          </h2>
          <p className="text-sm text-gray-600">{store.type}</p>
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2 border-none text-sm font-bold text-white cursor-pointer shadow-lg hover:bg-blue-600 transition-colors h-10 mt-4"
            title="Generate Store QR Code"
            onClick={handleShowQR}
          >
            <span className="material-symbols-outlined">qr_code_2</span>
            <span className="leading-none">QR</span>
          </button>
        </div>

        {/* Store Details */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Location */}
          <div className="flex gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center h-10 w-10 min-w-[40px] rounded-lg bg-gray-100">
              <span className="material-symbols-outlined text-gray-500">
                location_on
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Address</p>
              <p className="text-base font-medium text-gray-900">
                {store.address}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center h-10 w-10 min-w-[40px] rounded-lg bg-gray-100">
              <span className="material-symbols-outlined text-gray-500">
                mail
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="text-base font-medium text-gray-900">
                {store.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center h-10 w-10 min-w-[40px] rounded-lg bg-gray-100">
              <span className="material-symbols-outlined text-gray-500">
                phone
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Phone</p>
              <p className="text-base font-medium text-gray-900">
                {store.phone ? store.phone : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-transparent border-none text-base font-medium text-red-600 cursor-pointer hover:text-red-700 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 flex justify-around border-t border-gray-200 bg-white/80 backdrop-blur-sm p-2 gap-2">
        {/* Lots */}
        <a
          href="/lots"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg p-2 no-underline text-gray-400 text-xs hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span>Lots</span>
        </a>

        {/* Profile (Active) */}
        <a
          href="#"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg bg-emerald-50 p-2 no-underline text-emerald-500 text-xs font-bold"
        >
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
};

export default StoreProfile;
