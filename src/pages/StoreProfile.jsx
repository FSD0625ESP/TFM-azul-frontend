import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const StoreProfile = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleOpenQR = () => setShowQR(true);
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

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const token = localStorage.getItem("token");
      const storeId = store?.id || store?._id;

      const response = await axios.patch(
        `${API_URL}/stores/${storeId}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedStore = response.data.store;

      // Actualizar estado y localStorage
      setStore(updatedStore);
      localStorage.setItem("store", JSON.stringify(updatedStore));

      toast.success("Photo updated successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error(error.response?.data?.message || "Error uploading photo");
    } finally {
      setUploading(false);
    }
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
          <div className="relative mb-4 group">
            {store.photo ? (
              <img
                src={store.photo}
                alt="Store logo"
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-5xl">
                  storefront
                </span>
              </div>
            )}
            <label
              htmlFor="photo-upload"
              className="absolute inset-0 flex items-center justify-center h-24 w-24 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <span className="material-symbols-outlined text-white text-3xl animate-spin">
                  sync
                </span>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-white text-2xl">
                    photo_camera
                  </span>
                  <span className="text-white text-xs mt-1">
                    {store.photo ? "Change" : "Add"}
                  </span>
                </div>
              )}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              disabled={uploading}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {store.name}
          </h2>
          <p className="text-sm text-gray-600">{store.type}</p>
          <button
            onClick={handleOpenQR}
            className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
          >
            Show QR
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Click on logo to {store.photo ? "change" : "add"}
          </p>
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
            <button
              onClick={() => navigate("/change-password")}
              className="flex items-center gap-1 bg-transparent border-none text-xs font-medium text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors px-2 whitespace-nowrap"
              title="Change Password"
            >
              <span className="material-symbols-outlined text-base">
                lock_reset
              </span>
            </button>
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
