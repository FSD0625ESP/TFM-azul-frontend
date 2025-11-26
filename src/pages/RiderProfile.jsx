import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const RiderProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleOpenScanner = () => setShowScanner(true);
  const handleCloseScanner = async () => {
    setShowScanner(false);
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        /* ignore */
      }
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    let html5Qr = null;
    if (showScanner) {
      const elementId = "qr-reader";
      html5Qr = new Html5Qrcode(elementId);
      scannerRef.current = html5Qr;

      const config = { fps: 10, qrbox: 250 };

      html5Qr
        .start(
          { facingMode: "environment" },
          config,
          async (decodedText, decodedResult) => {
            // decodedText expected to be storeId encoded in the QR
            try {
              // Stop scanner
              await html5Qr.stop();
            } catch (e) {
              console.error("Error stopping scanner:", e);
            }

            // Call backend to confirm pickup
            const token = localStorage.getItem("token");
            try {
              const base = "http://localhost:4000/api";
              const res = await axios.post(
                `${base}/lots/confirm-pickup/${encodeURIComponent(
                  decodedText
                )}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );

              alert(res.data?.message || "Recogida confirmada");
            } catch (err) {
              console.error(err);
              const msg =
                err?.response?.data?.message || "Error confirmando recogida";
              alert(msg);
            } finally {
              setShowScanner(false);
              try {
                html5Qr.clear();
              } catch (e) {}
              scannerRef.current = null;
            }
          }
        )
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
      const userId = user?.id || user?._id;

      const response = await axios.patch(
        `${API_URL}/users/${userId}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      // Actualizar estado y localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col pb-20 pt-4">
        {/* Profile Image and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4 group">
            {user.photo ? (
              <img
                src={user.photo}
                alt="User profile"
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-5xl">
                  person
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
                    {user.photo ? "Change" : "Add"}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
          <p className="text-sm text-gray-500">
            Click on photo to {user.photo ? "change" : "add"}
          </p>
        </div>

        {/* User Details */}
        <div className="flex flex-col gap-6 mb-8">
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
                {user.email}
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
                {user.phone ? user.phone : "Not specified"}
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
      <nav className="sticky bottom-0 flex justify-around border-t border-gray-200 bg-white/80 backdrop-blur-sm p-2 gap-2">
        {/* Map */}
        <a
          href="/mainscreen"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg p-2 no-underline text-gray-400 text-xs hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">map</span>
          <span>Map</span>
        </a>

        {/* Reserved Lots */}
        <a
          href="/reserved-lots"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg p-2 no-underline text-gray-400 text-xs hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">bookmark</span>
          <span>Reserved</span>
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

export default RiderProfile;
