/**
 * Custom hook para búsqueda de direcciones con Mapbox
 */

import { useState } from "react";
import MapboxClient from "@mapbox/mapbox-sdk/services/geocoding";
import { MAPBOX_CONFIG } from "../utils/constants";

const mapboxClient = MapboxClient({
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
});

/**
 * Hook para gestionar la búsqueda de direcciones con Mapbox
 * @returns {Object} Estado y funciones para búsqueda de direcciones
 */
export const useAddressSearch = () => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  /**
   * Busca direcciones con Mapbox Geocoding
   * @param {string} query - Término de búsqueda
   */
  const searchAddress = async (query) => {
    if (query.length < MAPBOX_CONFIG.MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await mapboxClient
        .forwardGeocode({
          query,
          autocomplete: true,
          limit: MAPBOX_CONFIG.AUTOCOMPLETE_LIMIT,
        })
        .send();

      setSuggestions(response.body.features);
    } catch (err) {
      console.error("Mapbox error:", err);
      setSuggestions([]);
    }
  };

  /**
   * Maneja la selección de una dirección de las sugerencias
   * @param {Object} feature - Feature de Mapbox seleccionado
   */
  const handleSelectAddress = (feature) => {
    setAddress(feature.place_name);
    setSelectedCoordinates({
      lat: feature.center[1],
      lng: feature.center[0],
    });
    setSuggestions([]);
  };

  /**
   * Resetea el estado de la búsqueda
   */
  const resetSearch = () => {
    setAddress("");
    setSuggestions([]);
    setSelectedCoordinates(null);
  };

  return {
    address,
    setAddress,
    suggestions,
    selectedCoordinates,
    searchAddress,
    handleSelectAddress,
    resetSearch,
  };
};
