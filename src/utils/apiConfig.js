/**
 * API Configuration
 * Centraliza la configuración de URL de la API para evitar duplicación
 */

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Construye la URL completa para un endpoint de la API
 * @param {string} path - Ruta del endpoint (ej: '/users/register')
 * @returns {string} URL completa
 */
export const buildApiUrl = (path) => {
  // Asegurar que la ruta empiece con /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
};

/**
 * Obtiene la URL base del WebSocket según el entorno
 * @returns {string} URL del WebSocket
 */
export const getWebSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  if (apiUrl.includes("localhost")) {
    return "ws://localhost:4000";
  }

  // Si es producción, usa wss:// y extrae el dominio
  const baseUrl = apiUrl.replace("/api", "").replace("https://", "");
  return `wss://${baseUrl}`;
};
