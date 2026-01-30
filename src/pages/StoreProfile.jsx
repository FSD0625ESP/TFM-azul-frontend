import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { InfoCard } from "../components/InfoCard";
import { StoreBottomNav } from "../components/BottomNav";
import { ROUTES } from "../utils/constants";
import { clearAuthStorage } from "../utils/authHelpers";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import {
  uploadProfilePhoto,
  updateStoredEntity,
  getStoredEntity,
} from "../utils/profileHelpers";

const StoreProfile = () => {
  const navigate = useNavigate();
  const { theme, updateTheme } = useTheme();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const handleOpenQR = () => setShowQR(true);
  const handleCloseQR = () => setShowQR(false);

  // Cargar datos de la tienda al montar
  useEffect(() => {
    const storeData = getStoredEntity("store");
    if (storeData) {
      setStore(storeData);
    } else {
      navigate(ROUTES.LOGIN);
    }
    setLoading(false);
  }, [navigate]);

  /**
   * Maneja el cambio de tema
   */
  const handleThemeToggle = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

    try {
      await axios.patch(
        `${API_URL}/stores/theme`,
        { theme: newTheme },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      updateTheme(newTheme);
      toast.success(
        `Tema cambiado a ${newTheme === "dark" ? "oscuro" : "claro"}`,
      );
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Error al cambiar el tema");
    }
  };

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    clearAuthStorage();
    navigate(ROUTES.HOME);
  };

  /**
   * Maneja la actualización de ubicación en el mapa
   */
  const handleUpdateLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    setUpdatingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:4000/api";
        const token = localStorage.getItem("token");

        try {
          // Crear o actualizar la marca de la tienda
          await axios.post(
            `${API_URL}/createMark`,
            {
              user: store?.id || store?._id,
              lat: latitude.toString(),
              long: longitude.toString(),
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          toast.success("Ubicación actualizada en el mapa");
        } catch (error) {
          console.error("Error updating location:", error);
          toast.error("Error al actualizar la ubicación");
        } finally {
          setUpdatingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("No se pudo obtener tu ubicación");
        setUpdatingLocation(false);
      },
    );
  };

  /**
   * Maneja el cambio de foto de perfil
   */
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const storeId = store?.id || store?._id;

      const updatedStore = await uploadProfilePhoto(
        storeId,
        "stores",
        file,
        token,
      );

      // Actualizar estado y localStorage
      setStore(updatedStore);
      updateStoredEntity("store", updatedStore);

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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modal QR */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col items-center relative min-w-[300px]">
            <button
              onClick={handleCloseQR}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 dark:text-white">
              QR de la tienda
            </h3>
            <QRCodeSVG value={store?._id || store?.id || ""} size={200} />
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 break-all">
              {store?._id || store?.id}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col pb-20 pt-4">
        {/* Profile Image and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <ProfileAvatar
              photoUrl={store.photo}
              name={store.name}
              uploading={uploading}
              onPhotoChange={handlePhotoChange}
              icon="storefront"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {store.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {store.type}
          </p>
          <button
            onClick={handleOpenQR}
            className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
          >
            Show QR
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Click on logo to {store.photo ? "change" : "add"}
          </p>
        </div>

        {/* Store Details */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Location */}
          <InfoCard icon="location_on" label="Address" value={store.address} />

          {/* Email */}
          <InfoCard
            icon="mail"
            label="Email"
            value={store.email}
            actionButton={
              <button
                onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
                className="flex items-center gap-1 bg-transparent border-none text-xs font-medium text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors px-2 whitespace-nowrap"
                title="Change Password"
              >
                <span className="material-symbols-outlined text-base">
                  lock_reset
                </span>
              </button>
            }
          />

          {/* Phone */}
          <InfoCard
            icon="phone"
            label="Phone"
            value={store.phone ? store.phone : "Not specified"}
          />

          {/* Theme Toggle */}
          <InfoCard
            icon={theme === "dark" ? "dark_mode" : "light_mode"}
            label="Theme"
            value={theme === "dark" ? "Dark Mode" : "Light Mode"}
            actionButton={
              <button
                onClick={handleThemeToggle}
                className="flex items-center gap-1 bg-transparent border-none text-xs font-medium text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors px-2 whitespace-nowrap"
                title="Toggle Theme"
              >
                <span className="material-symbols-outlined text-base">
                  {theme === "dark" ? "light_mode" : "dark_mode"}
                </span>
              </button>
            }
          />

          {/* Map Location */}
          <InfoCard
            icon="pin_drop"
            label="Ubicación en el mapa"
            value="Actualiza tu ubicación para que los usuarios te encuentren"
            actionButton={
              <button
                onClick={handleUpdateLocation}
                disabled={updatingLocation}
                className="flex items-center gap-1 bg-transparent border-none text-xs font-medium text-emerald-600 cursor-pointer hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-2 whitespace-nowrap"
                title="Update Location"
              >
                {updatingLocation ? (
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-base">
                    my_location
                  </span>
                )}
              </button>
            }
          />
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
      <StoreBottomNav />
    </div>
  );
};

export default StoreProfile;
