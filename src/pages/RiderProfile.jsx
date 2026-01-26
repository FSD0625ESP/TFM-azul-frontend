import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { InfoCard } from "../components/InfoCard";
import { BottomNav } from "../components/BottomNav";
import { ROUTES } from "../utils/constants";
import { clearAuthStorage } from "../utils/authHelpers";
import {
  uploadProfilePhoto,
  updateStoredEntity,
  getStoredEntity,
  confirmPickup,
} from "../utils/profileHelpers";

const RiderProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [uploading, setUploading] = useState(false);
  const scannerRef = useRef(null);

  // Cargar datos del usuario al montar
  useEffect(() => {
    const userData = getStoredEntity("user");
    if (userData) {
      setUser(userData);
    } else {
      navigate(ROUTES.HOME);
    }
    setLoading(false);
  }, [navigate]);

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    clearAuthStorage();
    navigate(ROUTES.HOME);
  };

  /**
   * Abre el escáner QR
   */
  const handleOpenScanner = () => setShowScanner(true);

  /**
   * Cierra el escáner QR y limpia recursos
   */
  const handleCloseScanner = async () => {
    setShowScanner(false);
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        console.error("Error stopping scanner:", e);
      }
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  /**
   * Maneja el escaneo QR y confirmación de recogida
   */
  useEffect(() => {
    let html5Qr = null;

    if (showScanner) {
      const elementId = "qr-reader";
      html5Qr = new Html5Qrcode(elementId);
      scannerRef.current = html5Qr;

      const config = { fps: 10, qrbox: 250 };

      html5Qr
        .start({ facingMode: "environment" }, config, async (decodedText) => {
          // Detener escáner
          try {
            await html5Qr.stop();
          } catch (e) {
            console.error("Error stopping scanner:", e);
          }

          // Confirmar recogida
          const token = localStorage.getItem("token");
          try {
            const response = await confirmPickup(decodedText, token);
            alert(response?.message || "Recogida confirmada");
          } catch (err) {
            console.error(err);
            const msg =
              err?.response?.data?.message || "Error confirmando recogida";
            alert(msg);
          } finally {
            setShowScanner(false);
            try {
              html5Qr.clear();
            } catch (e) {
              console.error("Error clearing scanner:", e);
            }
            scannerRef.current = null;
          }
        })
        .catch((err) => {
          console.error("QR start error:", err);
          alert("No se pudo iniciar la cámara. Comprueba permisos.");
          setShowScanner(false);
        });
    }

    return () => {
      if (html5Qr) {
        html5Qr.stop().catch(() => {});
        html5Qr.clear().catch(() => {});
      }
    };
  }, [showScanner]);

  /**
   * Maneja el cambio de foto de perfil
   */
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = user?.id || user?._id;

      const updatedUser = await uploadProfilePhoto(
        userId,
        "users",
        file,
        token,
      );

      // Actualizar estado y localStorage
      setUser(updatedUser);
      updateStoredEntity("user", updatedUser);

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

  if (!user) {
    return null;
  }

  // Configuración de navegación inferior
  const navItems = [
    { href: "/mainscreen", icon: "map", label: "Map" },
    { href: "/reserved-lots", icon: "bookmark", label: "Reserved" },
    { href: "#", icon: "person", label: "Profile" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col pb-20 pt-4">
        {/* Profile Image and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <ProfileAvatar
              photoUrl={user.photo}
              name={user.name}
              uploading={uploading}
              onPhotoChange={handlePhotoChange}
              icon="person"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
          <button
            onClick={handleOpenScanner}
            className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
          >
            Escanear QR
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Click on photo to {user.photo ? "change" : "add"}
          </p>
        </div>

        {/* User Details */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Email */}
          <InfoCard
            icon="mail"
            label="Email"
            value={user.email}
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
            value={user.phone ? user.phone : "Not specified"}
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

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-4 shadow-lg w-[90%] max-w-xl relative">
            <button
              onClick={handleCloseScanner}
              className="absolute top-2 right-2 text-gray-600 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">
              Escanea el QR de la tienda
            </h3>
            <div id="qr-reader" className="w-full h-[360px]" />
            <p className="text-xs text-gray-500 mt-2">
              Permite acceso a la cámara para escanear.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default RiderProfile;
