"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MAPBOX_CONFIG from "../config/mapboxConfig";
import deliveryIcon from "../assets/delivery.png";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function MainScreen() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState([]);
  const [lotCounts, setLotCounts] = useState({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  // Handler para crear una mark en la ubicación actual con type_mark = 'homeles'
  const handleCreateHomelesMark = async () => {
    try {
      // Determine user id: backend responses sometimes use `id` and sometimes `_id`
      const userId = user?.id || user?._id || null;
      if (!user || !userId) {
        toast.error("Usuario no autenticado");
        return;
      }

      if (typeof navigator === "undefined" || !navigator.geolocation) {
        toast.error("Geolocalización no disponible en este navegador.");
        return;
      }

      // Try to get a fresh position with a longer timeout and better error handling.
      const getPosition = () =>
        new Promise((resolve, reject) => {
          try {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos),
              (err) => reject(err),
              { enableHighAccuracy: true, timeout: 30000 }
            );
          } catch (err) {
            reject(err);
          }
        });

      let position = null;
      try {
        position = await getPosition();
      } catch (err) {
        console.warn("Geolocation getCurrentPosition failed:", err);
        // err may be a GeolocationPositionError with code 1 (PERMISSION_DENIED),
        // 2 (POSITION_UNAVAILABLE) or 3 (TIMEOUT)
        if (err && err.code === 1) {
          toast.error(
            "Permiso de ubicación denegado. Activa los permisos de ubicación para la app y vuelve a intentarlo."
          );
          return;
        }

        if (err && err.code === 3) {
          // Timeout: try to fallback to the last known marker position if available
          try {
            const last = mapRef.current && mapRef.current.userMarker;
            if (last && typeof last.getLngLat === "function") {
              const ll = last.getLngLat();
              position = { coords: { latitude: ll.lat, longitude: ll.lng } };
              console.info("Using last known marker position as fallback.");
            } else {
              toast.error(
                "No se pudo obtener la ubicación (timeout) y no hay posición previa. Asegúrate de que el GPS está activado y vuelve a intentarlo."
              );
              return;
            }
          } catch (fallbackErr) {
            console.error("Fallback to marker failed:", fallbackErr);
            toast.error(
              "No se pudo obtener la ubicación. Comprueba el GPS y los permisos e inténtalo de nuevo."
            );
            return;
          }
        } else {
          // Other geolocation errors
          toast.error(
            "Error al obtener la ubicación: " + (err.message || "Unknown error")
          );
          return;
        }
      }

      const { latitude, longitude } = position.coords;

      // Llamada al backend para crear la mark con type_mark 'homeless' (coincide con el enum del modelo)
      const payload = {
        lat: latitude,
        long: longitude,
        type_mark: "homeless",
      };

      const response = await axios.post(
        `${API_BASE_URL}/createMark/createMark/${userId}`,
        payload
      );

      if (response && response.data && response.data.mark) {
        const createdMark = response.data.mark;

        // Añadir marcador visual al mapa inmediatamente
        try {
          new mapboxgl.Marker({ color: "#ef4444" }) // rojo para distinguir
            .setLngLat([
              parseFloat(createdMark.long),
              parseFloat(createdMark.lat),
            ])
            .addTo(mapRef.current);
        } catch (err) {
          console.warn("Error añadiendo marker al mapa:", err);
        }

        // Actualizar estado local para que quede persistente en la vista
        setMarks((prev) => [...prev, createdMark]);

        toast.success("Marca creada en tu ubicación.");
      } else {
        toast.error("No se pudo crear la marca. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error creando marca en ubicación:", err);
      toast.error("Error creando la marca: " + (err.message || err));
    }
  };

  // Obtener usuario de localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Traer marks desde la base de datos
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/marks`);
        setMarks(response.data); // array de marks
      } catch (err) {
        console.error("Error fetching marks:", err);
      }
    };

    fetchMarks();
  }, []);

  // Traer lots y computar conteo por tienda
  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/lots`);
        const lots = res.data || [];

        const counts = {};
        lots.forEach((lot) => {
          // lot.shop puede venir como objeto poblado o como id
          const shopId =
            lot.shop && lot.shop._id ? String(lot.shop._id) : String(lot.shop);
          counts[shopId] = (counts[shopId] || 0) + 1;
        });

        setLotCounts(counts);
      } catch (err) {
        console.error("Error fetching lots:", err);
      }
    };

    fetchLots();
  }, []);

  // Inicializar mapa solo una vez
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    // Create the map with a sensible fallback center/zoom (Barcelona by default)
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_CONFIG.defaultStyle,
      center: MAPBOX_CONFIG.defaultCenter,
      zoom: MAPBOX_CONFIG.defaultZoom,
      attributionControl: false,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // When the map loads, try to get the device location and move the map there
    mapRef.current.on("load", () => {
      setMapLoaded(true);

      // If geolocation is available, start watching position so the rider marker
      // updates as the device moves. We use watchPosition instead of getCurrentPosition.
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        const onPosition = (position) => {
          const { latitude, longitude } = position.coords;

          // Fly to the device location on the first fix
          try {
            if (!mapRef.current._hasInitialFly) {
              mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
              mapRef.current._hasInitialFly = true;
            }

            // Create or update rider marker
            try {
              if (mapRef.current.userMarker) {
                // move existing marker
                mapRef.current.userMarker.setLngLat([longitude, latitude]);
              } else {
                const el = document.createElement("div");
                el.className = "rider-marker";
                // Use the delivery.png asset from src/assets as the rider icon
                el.innerHTML = `<img src="${deliveryIcon}" class="rider-img" alt="rider" />`;

                const userMarker = new mapboxgl.Marker({
                  element: el,
                  anchor: "center",
                })
                  .setLngLat([longitude, latitude])
                  .addTo(mapRef.current);

                mapRef.current.userMarker = userMarker;
              }
            } catch (err) {
              console.warn("Error adding/moving rider marker:", err);
            }
          } catch (err) {
            console.warn("Map flyTo/update error:", err);
          }
        };

        const onError = (err) => {
          console.warn("Geolocation watch error:", err);
        };

        // Start watching position and store the watchId so we can clear it later
        try {
          const watchId = navigator.geolocation.watchPosition(
            onPosition,
            onError,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
          mapRef.current._geoWatchId = watchId;
        } catch (err) {
          console.warn("Failed to start geolocation watch:", err);
        }
      } else {
        console.warn("Geolocation not available in this browser.");
      }
    });

    return () => {
      // Clear geolocation watcher if active
      try {
        if (mapRef.current && mapRef.current._geoWatchId != null) {
          navigator.geolocation.clearWatch(mapRef.current._geoWatchId);
        }
      } catch (err) {
        // ignore
      }

      mapRef.current && mapRef.current.remove();
    };
  }, []);

  // Colocar markers cuando mapa y marks estén listos
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // Remove previous non-user markers to avoid duplicates
    try {
      if (!mapRef.current.markers) mapRef.current.markers = [];
      mapRef.current.markers.forEach((m) => m.remove());
      mapRef.current.markers = [];
    } catch (err) {
      console.warn("Error clearing old markers:", err);
    }

    marks.forEach((mark) => {
      const lat = parseFloat(mark.lat);
      const long = parseFloat(mark.long);

      if (!isNaN(lat) && !isNaN(long)) {
        // If it's a shop, use a custom shop icon; otherwise use the default pin
        if (mark.type_mark === "shop") {
          try {
            const el = document.createElement("div");
            el.className = "shop-marker";
            // Determine shop id: prefer mark.shop if present (populated or id),
            // otherwise fall back to mark.user which previously held the store id
            const shopId =
              mark.shop && mark.shop._id
                ? String(mark.shop._id)
                : mark.shop
                ? String(mark.shop)
                : mark.user && mark.user._id
                ? String(mark.user._id)
                : String(mark.user);
            const count = lotCounts[shopId] || 0;

            el.innerHTML = `<span class="material-symbols-outlined">store</span><span class="shop-count">${count}</span>`;

            // Add click handler directly to the element
            el.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/store/${shopId}/lots`);
            });

            el.style.cursor = "pointer";
            el.style.zIndex = "1000";
            el.style.pointerEvents = "auto";

            const shopMarker = new mapboxgl.Marker({
              element: el,
              anchor: "center",
            })
              .setLngLat([long, lat])
              .addTo(mapRef.current);

            mapRef.current.markers.push(shopMarker);
          } catch (err) {
            console.warn(
              "Error adding shop marker, falling back to default:",
              err
            );
            const fallback = new mapboxgl.Marker({
              color: MAPBOX_CONFIG.markerColor,
            })
              .setLngLat([long, lat])
              .addTo(mapRef.current);
            mapRef.current.markers.push(fallback);
          }
        } else {
          const m = new mapboxgl.Marker({ color: MAPBOX_CONFIG.markerColor })
            .setLngLat([long, lat])
            .addTo(mapRef.current);
          mapRef.current.markers.push(m);
        }
      }
    });
  }, [marks, mapLoaded]);

  return (
    <div className="flex flex-col w-full h-dvh bg-white relative overflow-hidden">
      {/* Contenedor del mapa */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full relative" />

      {/* Botón flotante para crear mark en ubicación actual (solo raider) */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleCreateHomelesMark}
          title="Crear marca en mi ubicación"
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
        >
          <span className="material-symbols-outlined">add_location</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-white border-t border-gray-200 z-1000">
        {/* Map Tab */}
        <button
          onClick={() => setActiveTab("map")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer p-2 transition-colors ${
            activeTab === "map" ? "text-emerald-500" : "text-gray-400"
          }`}
        >
          <span className="material-symbols-outlined text-2xl">map</span>
          <span className="text-xs font-medium">Map</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => {
            setActiveTab("profile");
            navigate("/rider-profile");
          }}
          className={`flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer p-2 transition-colors ${
            activeTab === "profile" ? "text-emerald-500" : "text-gray-400"
          }`}
        >
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </footer>

      <style>
        {`
          #mapbox-container {
            touch-action: none;
          }
          .rider-marker span {
            font-size: 28px;
            color: #1e40af;
            /* Add a subtle white stroke for visibility on dark maps */
            text-shadow: 0 0 2px rgba(255,255,255,0.8);
            display: inline-block;
            transform: translateY(0);
          }
          .rider-marker {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: transparent;
          }
          .rider-img {
            width: 36px;
            height: 36px;
            object-fit: contain;
            display: block;
          }
          .shop-marker span {
            font-size: 24px;
            color: #f59e0b; /* amber for shop */
            text-shadow: 0 0 2px rgba(0,0,0,0.6);
            display: inline-block;
          }
          .shop-marker {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: rgba(255,255,255,0.06);
            border-radius: 8px;
          }
          .shop-count {
            display: inline-block;
            min-width: 18px;
            height: 18px;
            line-height: 18px;
            background: #ef4444;
            color: white;
            font-size: 12px;
            border-radius: 999px;
            text-align: center;
            margin-left: 6px;
            padding: 0 4px;
          }
        `}
      </style>
    </div>
  );
}
