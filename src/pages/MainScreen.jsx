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

// Asegurar que siempre termina con /api
const getApiUrl = (endpoint) => {
  const base = API_BASE_URL.endsWith("/api")
    ? API_BASE_URL
    : `${API_BASE_URL}/api`;
  return `${base}${endpoint}`;
};

export default function MainScreen() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [openChat, setOpenChat] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState([]);
  const [lotCounts, setLotCounts] = useState({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("map");
  const [userLocation, setUserLocation] = useState(null); // ✅ estado de ubicación
  const [activeDestination, setActiveDestination] = useState(null);

  const handleCreateHomelesMark = async () => {
    try {
      const userId = user?.id || user?._id || null;
      if (!user || !userId) {
        toast.error("Usuario no autenticado");
        return;
      }
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        toast.error("Geolocalización no disponible en este navegador.");
        return;
      }

      const getPosition = () =>
        new Promise((resolve, reject) => {
          try {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos),
              (err) => reject(err),
              { enableHighAccuracy: true, timeout: 30000 },
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
        if (err && err.code === 1) {
          toast.error(
            "Permiso de ubicación denegado. Activa los permisos de ubicación para la app y vuelve a intentarlo.",
          );
          return;
        }
        if (err && err.code === 3) {
          try {
            const last = mapRef.current && mapRef.current.userMarker;
            if (last && typeof last.getLngLat === "function") {
              const ll = last.getLngLat();
              position = { coords: { latitude: ll.lat, longitude: ll.lng } };
            } else {
              toast.error(
                "No se pudo obtener la ubicación (timeout) y no hay posición previa.",
              );
              return;
            }
          } catch {
            toast.error("No se pudo obtener la ubicación. Comprueba el GPS.");
            return;
          }
        } else {
          toast.error(
            "Error al obtener la ubicación: " +
              (err.message || "Unknown error"),
          );
          return;
        }
      }

      const { latitude, longitude } = position.coords;
      const payload = {
        lat: latitude,
        long: longitude,
        type_mark: "homeless",
      };

      const response = await axios.post(
        `${API_BASE_URL}/createMark/createMark/${userId}`,
        payload,
      );

      if (response?.data?.mark) {
        const createdMark = response.data.mark;
        new mapboxgl.Marker({ color: "#ef4444" })
          .setLngLat([
            parseFloat(createdMark.long),
            parseFloat(createdMark.lat),
          ])
          .addTo(mapRef.current);
        setMarks((prev) => [...prev, createdMark]);
        toast.success("Marca creada en tu ubicación.");
      } else {
        toast.error("No se pudo crear la marca. Intenta de nuevo.");
      }
    } catch (err) {
      toast.error("Error creando la marca: " + (err.message || err));
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get(getApiUrl("/marks"));
        setMarks(response.data);
      } catch (err) {
        console.error("Error fetching marks:", err);
      }
    };
    fetchMarks();
  }, []);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await axios.get(getApiUrl("/lots"));
        const lots = res.data || [];
        const counts = {};
        lots.forEach((lot) => {
          if (!lot.reserved) {
            const shopId = lot.shop?._id
              ? String(lot.shop._id)
              : String(lot.shop);
            counts[shopId] = (counts[shopId] || 0) + 1;
          }
        });
        setLotCounts(counts);
      } catch (err) {
        console.error("Error fetching lots:", err);
      }
    };
    fetchLots();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_CONFIG.defaultStyle,
      center: MAPBOX_CONFIG.defaultCenter,
      zoom: MAPBOX_CONFIG.defaultZoom,
      projection: MAPBOX_CONFIG.projection,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    (async () => {
      try {
        await import("https://cdn.jsdelivr.net/npm/@mapbox/mapbox-gl-directions@4.1.1/dist/mapbox-gl-directions.js");
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdn.jsdelivr.net/npm/@mapbox/mapbox-gl-directions@4.1.1/dist/mapbox-gl-directions.css";
        document.head.appendChild(link);
        if (!mapRef.current.directions) {
          const directions = new window.MapboxDirections({
            accessToken: MAPBOX_CONFIG.accessToken,
            unit: "metric",
            profile: "mapbox/driving",
            controls: { inputs: false, instructions: false },
            interactive: false,
          });
          mapRef.current.addControl(directions, "top-left");
          mapRef.current.directions = directions;
        }
      } catch (err) {
        console.error("Error cargando MapboxDirections:", err);
      }
    })();

    mapRef.current.on("load", () => {
      setMapLoaded(true);
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setUserLocation({ lat: latitude, lng: longitude }); // ✅ actualizar estado

            if (!mapRef.current._hasInitialFly) {
              mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
              mapRef.current._hasInitialFly = true;
            }
            if (mapRef.current.directions) {
              mapRef.current.directions.setOrigin([longitude, latitude]);
            }

            if (!mapRef.current.userMarker) {
              const el = document.createElement("div");
              el.innerHTML = `<img src="${deliveryIcon}" class="rider-img" alt="rider" />`;
              el.style.pointerEvents = "none";
              const marker = new mapboxgl.Marker({ element: el })
                .setLngLat([longitude, latitude])
                .addTo(mapRef.current);
              mapRef.current.userMarker = marker;
            } else {
              mapRef.current.userMarker.setLngLat([longitude, latitude]);
            }
          },
          (err) => console.warn("Geo error:", err),
          { enableHighAccuracy: true },
        );
      }
    });

    return () => {
      if (mapRef.current) {
        if (mapRef.current.directions) {
          try {
            mapRef.current.removeControl(mapRef.current.directions);
          } catch {}
          mapRef.current.directions = null;
        }
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    if (!mapRef.current.markers) mapRef.current.markers = [];
    mapRef.current.markers.forEach((m) => m.remove());
    mapRef.current.markers = [];

    marks.forEach((mark) => {
      const lat = parseFloat(mark.lat);
      const long = parseFloat(mark.long);
      if (isNaN(lat) || isNaN(long)) return;

      if (mark.type_mark === "shop") {
        try {
          const el = document.createElement("div");
          el.className = "shop-marker";
          const shopId = mark.shop?._id
            ? String(mark.shop._id)
            : mark.shop
              ? String(mark.shop)
              : mark.user?._id
                ? String(mark.user._id)
                : String(mark.user);
          const count = lotCounts[shopId] || 0;
          if (count === 0) return;

          el.innerHTML = `<span class="material-symbols-outlined">store</span><span class="shop-count">${count}</span>`;
          el.style.cursor = "pointer";
          el.style.pointerEvents = "auto";
          el.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/store/${shopId}/lots`);
          });

          const shopMarker = new mapboxgl.Marker({
            element: el,
            anchor: "center",
          })
            .setLngLat([long, lat])
            .addTo(mapRef.current);
          mapRef.current.markers.push(shopMarker);
        } catch {
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
    });
  }, [marks, mapLoaded, lotCounts]);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

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
          className={`flex-1 flex flex-col items-center justify-center gap-2 bg-transparent border-none cursor-pointer px-3 py-3 transition-colors ${
            activeTab === "map" ? "text-emerald-500" : "text-gray-400"
          }`}
        >
          <span className="material-symbols-outlined text-2xl">map</span>
          <span className="text-xs font-medium">Map</span>
        </button>

        {/* Lista lateral con nombres de tiendas y lotes */}
        <div className="fixed top-5 left-4 z-50 max-h-[40vh] w-45 overflow-y-auto bg-white/90 rounded-lg shadow-lg p-2">
          {/* Puntos de recogida (tiendas) */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-black">
              Collection Points
            </h3>

            <ul>
              {marks
                .filter((mark) => mark.type_mark === "shop")
                .map((mark, idx) => {
                  const lat = parseFloat(mark.lat);
                  const long = parseFloat(mark.long);
                  if (isNaN(lat) || isNaN(long)) return null;

                  const shopId =
                    mark.shop && mark.shop._id
                      ? String(mark.shop._id)
                      : mark.shop
                        ? String(mark.shop)
                        : mark.user && mark.user._id
                          ? String(mark.user._id)
                          : String(mark.user);

                  const lotCount = lotCounts[shopId] || 0;
                  if (lotCount === 0) return null;

                  const shopName = mark.name || mark.shop?.name || "Shop";

                  let distanceKm = null;
                  if (userLocation) {
                    distanceKm = getDistanceFromLatLonInKm(
                      userLocation.lat,
                      userLocation.lng,
                      lat,
                      long,
                    ).toFixed(1);
                  }

                  const isActive =
                    activeDestination &&
                    activeDestination.lat === lat &&
                    activeDestination.long === long;

                  return (
                    <li
                      key={idx}
                      className={`p-2 mb-1 rounded border cursor-pointer flex justify-between items-center transition-all duration-300
    ${
      isActive
        ? "bg-red-600 text-white border-red-700 shadow-md"
        : "bg-white text-black border-gray-300 hover:bg-red-800 hover:text-white"
    }
  `}
                      onClick={() => {
                        if (
                          !mapRef.current ||
                          !mapRef.current.directions ||
                          !userLocation
                        )
                          return;

                        const dest = { lat, long };

                        // Si clicas estando activo -> desactiva
                        if (isActive) {
                          mapRef.current.directions.removeRoutes();
                          setActiveDestination(null);
                          return;
                        }

                        // Activar nueva ruta
                        mapRef.current.directions.setOrigin([
                          userLocation.lng,
                          userLocation.lat,
                        ]);
                        mapRef.current.directions.setDestination([long, lat]);

                        mapRef.current.flyTo({
                          center: [long, lat],
                          zoom: 16,
                        });

                        setActiveDestination(dest);
                      }}
                    >
                      <span>
                        🏪 {shopName}
                        <br />
                        Lots: {lotCount}
                        <br />
                        Distance:{" "}
                        {distanceKm ? `${distanceKm} km` : "Desconocida"}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* Puntos de entrega (homeless) */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-black">
              Delivery Points
            </h3>
            <ul>
              {marks
                .filter((mark) => mark.type_mark === "homeless")
                .map((mark, idx) => {
                  const lat = parseFloat(mark.lat);
                  const long = parseFloat(mark.long);
                  if (isNaN(lat) || isNaN(long)) return null;

                  let distanceKm = null;
                  if (userLocation) {
                    distanceKm = getDistanceFromLatLonInKm(
                      userLocation.lat,
                      userLocation.lng,
                      lat,
                      long,
                    ).toFixed(1);
                  }

                  return (
                    <li
                      key={idx}
                      className={`p-2 mb-1 rounded border cursor-pointer flex justify-between items-center transition-all duration-300
              ${
                activeDestination &&
                activeDestination.lat === lat &&
                activeDestination.long === long
                  ? "bg-red-600 text-white border-red-700 shadow-md" // ACTIVO
                  : "bg-white text-black border-gray-300 hover:bg-red-800 hover:text-white" // NORMAL
              }
            `}
                      onClick={() => {
                        if (
                          !mapRef.current ||
                          !mapRef.current.directions ||
                          !userLocation
                        )
                          return;

                        const dest = { lat, long };

                        // Si haces click en el mismo → DESACTIVA
                        if (
                          activeDestination &&
                          activeDestination.lat === lat &&
                          activeDestination.long === long
                        ) {
                          mapRef.current.directions.removeRoutes();
                          setActiveDestination(null);
                          return;
                        }

                        // Activar ruta
                        mapRef.current.directions.setOrigin([
                          userLocation.lng,
                          userLocation.lat,
                        ]);
                        mapRef.current.directions.setDestination([long, lat]);

                        mapRef.current.flyTo({
                          center: [long, lat],
                          zoom: 16,
                        });

                        setActiveDestination(dest);
                      }}
                    >
                      <span>
                        📍 Delivery {distanceKm ? `- ${distanceKm} km` : ""}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>

        {/* Reserved Lots Tab */}
        <button
          onClick={() => {
            setActiveTab("reserved");
            navigate("/reserved-lots");
          }}
          className={`flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer p-2 transition-colors ${
            activeTab === "reserved" ? "text-emerald-500" : "text-gray-400"
          }`}
        >
          <span className="material-symbols-outlined text-2xl">bookmark</span>
          <span className="text-xs font-medium">Reserved</span>
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
            color: #f59e0b;
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
