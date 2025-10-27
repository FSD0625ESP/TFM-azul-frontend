"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MAPBOX_CONFIG from "../config/mapboxConfig";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function MainScreen() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

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

      // If geolocation is available, request the current position and fly there.
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Fly to the device location with a closer zoom for a better default focus
            try {
              mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });

              // Show a rider icon at the user's location instead of the default marker
              try {
                // Remove previous rider marker if exists
                if (mapRef.current.userMarker) {
                  mapRef.current.userMarker.remove();
                }

                const el = document.createElement("div");
                el.className = "rider-marker";
                el.innerHTML =
                  '<span class="material-symbols-outlined">person_pin</span>';

                const userMarker = new mapboxgl.Marker({
                  element: el,
                  anchor: "center",
                })
                  .setLngLat([longitude, latitude])
                  .addTo(mapRef.current);

                mapRef.current.userMarker = userMarker;
              } catch (err) {
                console.warn("Error adding rider marker:", err);
              }
            } catch (err) {
              // If anything goes wrong with map ref, just log and keep fallback
              console.warn("Map flyTo error:", err);
            }
          },
          (err) => {
            // Permission denied or other geolocation error — keep fallback center
            console.warn("Geolocation error or permission denied:", err);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        console.warn("Geolocation not available in this browser.");
      }
    });

    return () => mapRef.current && mapRef.current.remove();
  }, []);

  // Colocar markers cuando mapa y marks estén listos
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    marks.forEach((mark) => {
      const lat = parseFloat(mark.lat);
      const long = parseFloat(mark.long);

      if (!isNaN(lat) && !isNaN(long)) {
        new mapboxgl.Marker({ color: MAPBOX_CONFIG.markerColor })
          .setLngLat([long, lat])
          .addTo(mapRef.current);
      }
    });
  }, [marks, mapLoaded]);

  return (
    <div className="flex flex-col w-full h-dvh bg-white relative overflow-hidden">
      {/* Contenedor del mapa */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full relative" />

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
        `}
      </style>
    </div>
  );
}
