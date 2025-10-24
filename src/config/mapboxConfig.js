/**
 * Configuración centralizada de Mapbox
 */

const MAPBOX_CONFIG = {
  accessToken:
    import.meta.env.VITE_MAPBOX_TOKEN ||
    "pk.eyJ1IjoiYWxleGlzcG9saXRlY25pY3MiLCJhIjoiY21ndjZodXZsMDJ0NjJvc2dyNGd5MGpiZiJ9.IuBv2n2W9_9iDKcINK3Skw",
  defaultStyle: "mapbox://styles/mapbox/dark-v11",
  defaultCenter: [2.15899, 41.38879], // Barcelona
  defaultZoom: 12,
  markerColor: "#3b82f6",
};

export default MAPBOX_CONFIG;
