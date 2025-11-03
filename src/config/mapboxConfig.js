/**
 * Configuración centralizada de Mapbox
 */

const MAPBOX_CONFIG = {
  accessToken:
    import.meta.env.VITE_MAPBOX_TOKEN ||
    "pk.eyJ1IjoiYWxleGlzcG9saXRlY25pY3MiLCJhIjoiY21ndjZodXZsMDJ0NjJvc2dyNGd5MGpiZiJ9.IuBv2n2W9_9iDKcINK3Skw",
  defaultStyle: "mapbox://styles/mapbox/streets-v12",
  defaultCenter: [2.15899, 41.38879], // Barcelona
  // A slightly closer default zoom; will be overridden by device geolocation when available
  defaultZoom: 15,
  markerColor: "#3b82f6",
  projection: "mercator",
};

export default MAPBOX_CONFIG;
