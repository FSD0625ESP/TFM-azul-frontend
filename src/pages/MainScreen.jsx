"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MAPBOX_CONFIG from "../config/mapboxConfig";
import { API_BASE_URL } from "../services/authService";

export default function MapboxMobilePage() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Obtener usuario de localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Solo Riders pueden acceder al mapa
      if (userData.user_type !== "rider") {
        navigate("/profile");
        return;
      }
      setUser(userData);
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

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_CONFIG.defaultStyle,
      center: MAPBOX_CONFIG.defaultCenter,
      zoom: MAPBOX_CONFIG.defaultZoom,
      attributionControl: false,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    mapRef.current.on("load", () => setMapLoaded(true));

    return () => mapRef.current.remove();
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

  const handleGoBack = () => {
    navigate("/profile");
  };

  return (
    <div className="flex flex-col w-screen h-[100dvh] bg-gray-50 relative overflow-hidden mobile-safe-area">
      <header className="absolute top-0 left-0 w-full z-10 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-base font-semibold text-gray-800">Map</h1>

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
          {user && (
            <span className="text-xs font-medium text-gray-600 truncate max-w-[80px] text-center">
              {user.name}
            </span>
          )}
        </Link>
      </header>

      {/* Contenedor del mapa */}
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
            touch-action: none;
          }
          .touch-manipulation {
            touch-action: manipulation;
          }
        `}
      </style>
    </div>
  );
}
