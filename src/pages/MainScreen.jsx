"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MAPBOX_CONFIG from "../config/mapboxConfig";
import { API_BASE_URL } from "../services/authService";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100dvh",
        backgroundColor: "#f6f8f7",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      {/* Contenedor del mapa */}
      <div
        ref={mapContainerRef}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      />

      {/* Bottom Navigation */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "64px",
          backgroundColor: "#ffffff",
          borderTop: "1px solid #dce5df",
          fontFamily: "'Work Sans', sans-serif",
          zIndex: 1000,
        }}
      >
        {/* Map Tab */}
        <button
          onClick={() => setActiveTab("map")}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: activeTab === "map" ? "#1dc962" : "#9ca3af",
            transition: "color 0.3s",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "24px" }}
          >
            map
          </span>
          <span style={{ fontSize: "12px", fontWeight: "500" }}>Map</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => {
            setActiveTab("profile");
            navigate("/rider-profile");
          }}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: activeTab === "profile" ? "#1dc962" : "#9ca3af",
            transition: "color 0.3s",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "24px" }}
          >
            person
          </span>
          <span style={{ fontSize: "12px", fontWeight: "500" }}>Profile</span>
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
