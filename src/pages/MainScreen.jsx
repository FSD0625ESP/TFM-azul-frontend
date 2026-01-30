"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MAPBOX_CONFIG from "../config/mapboxConfig";
import deliveryIcon from "../assets/delivery.png";
import { BottomNav } from "../components/BottomNav";
import { useTheme } from "../context/ThemeContext";

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
  const { theme } = useTheme();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [openChat, setOpenChat] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState([]);
  const [lots, setLots] = useState([]);
  const [lotCounts, setLotCounts] = useState({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("map");
  const [userLocation, setUserLocation] = useState(null); // ✅ estado de ubicación
  const [activeDestination, setActiveDestination] = useState(() => {
    // Restaurar destino activo desde localStorage
    const saved = localStorage.getItem("activeDestination");
    return saved ? JSON.parse(saved) : null;
  });
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [startY, setStartY] = useState(0);
  const [selectedTab, setSelectedTab] = useState("shops"); // "shops" or "delivery"

  const handleCreateHomelesMark = async () => {
    try {
      const userId = user?.id || user?._id || null;
      if (!user || !userId) {
        toast.error("User not authenticated");
        return;
      }
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        toast.error("Geolocation not available in this browser.");
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
            "Location permission denied. Enable location permissions for the app and try again.",
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
                "Could not get location (timeout) and no previous position.",
              );
              return;
            }
          } catch {
            toast.error("Could not get location. Check GPS.");
            return;
          }
        } else {
          toast.error(
            "Error getting location: " + (err.message || "Unknown error"),
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
        new mapboxgl.Marker({ color: "#60a5fa" })
          .setLngLat([
            parseFloat(createdMark.long),
            parseFloat(createdMark.lat),
          ])
          .addTo(mapRef.current);
        setMarks((prev) => [...prev, createdMark]);
        toast.success("Marker created at your location..");
      } else {
        toast.error("The Marker could not be created. Please try again.");
      }
    } catch (err) {
      toast.error("Error creating marker: " + (err.message || err));
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
        console.log("Marks response:", response.data);
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
        const lotsData = res.data || [];
        // Filtrar solo lotes no reservados para mostrar en el bottom sheet
        const availableLots = lotsData.filter((lot) => !lot.reserved);
        setLots(availableLots);

        // Calcular lotCounts para los marcadores del mapa
        // Contar TODOS los lotes (reservados y disponibles) para que las tiendas no desaparezcan
        const counts = {};
        lotsData.forEach((lot) => {
          const shopId = lot.shop?._id
            ? String(lot.shop._id)
            : String(lot.shop);
          counts[shopId] = (counts[shopId] || 0) + 1;
        });
        setLotCounts(counts);

        console.log("Available lots:", availableLots);
        console.log("Total lot counts (including reserved):", counts);
      } catch (err) {
        console.error("Error fetching lots:", err);
      }
    };
    fetchLots();
  }, []);

  // Ya no necesitamos el useEffect de crear ruta automáticamente
  // La ruta se crea directamente cuando el usuario hace click en un lote

  // Restaurar la ruta si hay un destino activo guardado
  useEffect(() => {
    if (
      !mapLoaded ||
      !mapRef.current?.directions ||
      !userLocation ||
      !activeDestination
    )
      return;

    // Recrear la ruta
    mapRef.current.directions.setOrigin([userLocation.lng, userLocation.lat]);
    mapRef.current.directions.setDestination([
      activeDestination.long,
      activeDestination.lat,
    ]);
    console.log("Ruta restaurada desde localStorage");
  }, [mapLoaded, userLocation]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:
        theme === "dark" ? MAPBOX_CONFIG.darkStyle : MAPBOX_CONFIG.lightStyle,
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

            // Crear o actualizar el marcador de usuario
            if (!mapRef.current.userMarker) {
              const el = document.createElement("div");
              el.innerHTML = `<img src="${deliveryIcon}" class="rider-img" alt="rider" />`;
              el.style.pointerEvents = "none";
              const marker = new mapboxgl.Marker({ element: el })
                .setLngLat([longitude, latitude])
                .addTo(mapRef.current);
              mapRef.current.userMarker = marker;
              console.log("User marker created at:", [longitude, latitude]);
            } else {
              mapRef.current.userMarker.setLngLat([longitude, latitude]);
              // Asegurar que el marcador esté visible en el mapa
              if (!mapRef.current.userMarker._element.parentNode) {
                mapRef.current.userMarker.addTo(mapRef.current);
                console.log("User marker re-added to map");
              }
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

  // Cambiar estilo del mapa cuando cambia el tema
  useEffect(() => {
    if (mapRef.current) {
      const newStyle =
        theme === "dark" ? MAPBOX_CONFIG.darkStyle : MAPBOX_CONFIG.lightStyle;
      mapRef.current.setStyle(newStyle);
    }
  }, [theme]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    if (!mapRef.current.markers) mapRef.current.markers = [];

    // Solo eliminar marcadores de tiendas y delivery points, NO el marcador de usuario
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

          // No mostrar tienda si no tiene lotes
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
        const m = new mapboxgl.Marker({ color: "#60a5fa" })
          .setLngLat([long, lat])
          .addTo(mapRef.current);
        mapRef.current.markers.push(m);
      }
    });
  }, [marks, mapLoaded, lotCounts, navigate]);

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
    <div className="flex flex-col w-full h-dvh bg-white dark:bg-gray-900 relative overflow-hidden pb-16">
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

      {/* Bottom Sheet Deslizable */}
      <div
        className={`fixed left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out z-40 ${
          sheetExpanded ? "bottom-16 h-[70vh]" : "bottom-16 h-28"
        }`}
        onTouchStart={(e) => setStartY(e.touches[0].clientY)}
        onTouchEnd={(e) => {
          const endY = e.changedTouches[0].clientY;
          const diff = startY - endY;
          if (Math.abs(diff) > 50) {
            setSheetExpanded(diff > 0);
          }
        }}
      >
        {/* Handle para arrastrar */}
        <button
          onClick={() => setSheetExpanded(!sheetExpanded)}
          className="w-full flex justify-center pt-3 pb-2"
        >
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </button>

        {/* Tabs */}
        <div className="flex gap-2 px-4 mb-3">
          <button
            onClick={() => setSelectedTab("shops")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
              selectedTab === "shops"
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Collection Points
          </button>
          <button
            onClick={() => setSelectedTab("delivery")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
              selectedTab === "delivery"
                ? "bg-red-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Delivery Points
          </button>
        </div>

        {/* Contenido */}
        <div className="px-4 h-full overflow-hidden flex flex-col pb-4">
          {selectedTab === "shops" ? (
            // SHOPS
            !sheetExpanded ? (
              // Vista colapsada: solo el más cercano
              <div className="pb-4">
                {(() => {
                  // Combinar lotes con marks para obtener ubicación
                  const lotsWithLocation = lots
                    .map((lot) => {
                      const shopId = lot.shop?._id
                        ? String(lot.shop._id)
                        : String(lot.shop);
                      const mark = marks.find(
                        (m) =>
                          m.type_mark === "shop" &&
                          String(m.user?._id || m.user) === shopId,
                      );

                      if (!mark) return null;

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
                        );
                      }

                      return {
                        lot,
                        mark,
                        lat,
                        long,
                        distanceKm,
                      };
                    })
                    .filter(Boolean)
                    .sort(
                      (a, b) =>
                        (a.distanceKm || Infinity) - (b.distanceKm || Infinity),
                    );

                  const closest = lotsWithLocation[0];

                  if (!closest) {
                    return (
                      <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-sm">
                        No lots available
                      </div>
                    );
                  }

                  const isActive =
                    activeDestination &&
                    activeDestination.lat === closest.lat &&
                    activeDestination.long === closest.long;

                  return (
                    <div
                      onClick={() => {
                        if (
                          !mapRef.current ||
                          !mapRef.current.directions ||
                          !userLocation
                        )
                          return;

                        const dest = { lat: closest.lat, long: closest.long };

                        if (isActive) {
                          mapRef.current.directions.removeRoutes();
                          setActiveDestination(null);
                          localStorage.removeItem("activeDestination");
                          toast.info("Route deleted");
                          return;
                        }

                        mapRef.current.directions.setOrigin([
                          userLocation.lng,
                          userLocation.lat,
                        ]);
                        mapRef.current.directions.setDestination([
                          closest.long,
                          closest.lat,
                        ]);
                        mapRef.current.flyTo({
                          center: [closest.long, closest.lat],
                          zoom: 16,
                        });
                        setActiveDestination(dest);
                        localStorage.setItem(
                          "activeDestination",
                          JSON.stringify(dest),
                        );
                        toast.success("Route created successfully!");
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {closest.lot.image ? (
                          <img
                            src={closest.lot.image}
                            alt={closest.lot.name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-300">
                              restaurant
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                            {closest.lot.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {closest.distanceKm
                              ? `${closest.distanceKm.toFixed(1)} km away`
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              // Vista expandida: todos los lotes
              <div className="flex-1 overflow-y-auto pb-4 space-y-2">
                {lots.map((lot, idx) => {
                  const shopId = lot.shop?._id
                    ? String(lot.shop._id)
                    : String(lot.shop);
                  const mark = marks.find(
                    (m) =>
                      m.type_mark === "shop" &&
                      String(m.user?._id || m.user) === shopId,
                  );

                  if (!mark) return null;

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

                  const isActive =
                    activeDestination &&
                    activeDestination.lat === lat &&
                    activeDestination.long === long;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (
                          !mapRef.current ||
                          !mapRef.current.directions ||
                          !userLocation
                        )
                          return;

                        const dest = { lat, long };

                        if (isActive) {
                          mapRef.current.directions.removeRoutes();
                          setActiveDestination(null);
                          localStorage.removeItem("activeDestination");
                          toast.info("Ruta eliminada");
                          return;
                        }

                        // Crear la ruta
                        mapRef.current.directions.setOrigin([
                          userLocation.lng,
                          userLocation.lat,
                        ]);
                        mapRef.current.directions.setDestination([long, lat]);
                        mapRef.current.flyTo({
                          center: [long, lat],
                          zoom: 15,
                        });
                        setActiveDestination(dest);
                        localStorage.setItem(
                          "activeDestination",
                          JSON.stringify(dest),
                        );
                        toast.success(
                          "Route created! Go to the store to reserve the bundle.",
                        );
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {lot.image ? (
                          <img
                            src={lot.image}
                            alt={lot.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-300">
                              restaurant
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                            {lot.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {distanceKm ? `${distanceKm} km` : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            // DELIVERY POINTS (homeless)
            <div className="flex-1 overflow-y-auto pb-4 space-y-2">
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

                  const isActive =
                    activeDestination &&
                    activeDestination.lat === lat &&
                    activeDestination.long === long;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (
                          !mapRef.current ||
                          !mapRef.current.directions ||
                          !userLocation
                        )
                          return;

                        const dest = { lat, long };

                        if (isActive) {
                          mapRef.current.directions.removeRoutes();
                          setActiveDestination(null);
                          localStorage.removeItem("activeDestination");
                          toast.info("Ruta eliminada");
                          return;
                        }

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
                        localStorage.setItem(
                          "activeDestination",
                          JSON.stringify(dest),
                        );
                        toast.success("¡Ruta creada!");
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? "bg-red-50 dark:bg-red-900/30 border-red-400"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                            person_pin_circle
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                            Delivery Point
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {distanceKm ? `${distanceKm} km away` : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

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
            background: #60a5fa;
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
