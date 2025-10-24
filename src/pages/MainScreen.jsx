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
        `}
      </style>
    </div>
  );
}
