"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useNavigate } from "react-router-dom";

export default function MapboxMobilePage() {
  const mapContainerRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🔹 Obtener usuario de localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Si no hay usuario, redirigir
    }
  }, [navigate]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Token seguro desde .env
    mapboxgl.accessToken =
      import.meta.env.VITE_MAPBOX_TOKEN ||
      "pk.eyJ1IjoiYWxleGlzcG9saXRlY25pY3MiLCJhIjoiY21ndjZodXZsMDJ0NjJvc2dyNGd5MGpiZiJ9.IuBv2n2W9_9iDKcINK3Skw";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-3.7038, 40.4168], // Madrid
      zoom: 12,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    new mapboxgl.Marker({ color: "#3b82f6" })
      .setLngLat([-3.7038, 40.4168])
      .addTo(map);

    return () => map.remove();
  }, []);

  return (
    <div className="flex flex-col w-screen h-[100dvh] bg-gray-50 relative overflow-hidden mobile-safe-area">
      {/* Header fijo */}
      <header className="absolute top-0 left-0 w-full z-10 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-base font-semibold text-gray-800">Map</h1>

        {/* Icono + nombre del usuario */}
        <Link
          to="/profile"
          className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mb-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          {/* Nombre del usuario debajo del icono */}
          {user && (
            <span className="text-xs font-medium text-gray-600 truncate max-w-[80px] text-center">
              {user.name}
            </span>
          )}
        </Link>
      </header>

      {/* Mapa ocupa toda la pantalla */}
      <div
        ref={mapContainerRef}
        id="mapbox-container"
        className="absolute inset-0 w-full h-full"
      />

      <style>
        {`
          .mobile-safe-area {
            padding-bottom: env(safe-area-inset-bottom);
            padding-top: env(safe-area-inset-top);
          }
          #mapbox-container {
            touch-action: none; /* Evita scroll accidental */
          }
          .touch-manipulation {
            touch-action: manipulation;
          }
        `}
      </style>
    </div>
  );
}
