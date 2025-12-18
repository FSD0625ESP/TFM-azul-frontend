/**
 * Funciones auxiliares para autenticación
 */

import axios from "axios";
import { buildApiUrl } from "./apiConfig";

/**
 * Sube una foto de perfil para un usuario/tienda
 * @param {string} entityId - ID del usuario o tienda
 * @param {string} entityType - 'users' o 'stores'
 * @param {File} photo - Archivo de foto
 * @param {string} token - Token de autenticación
 * @returns {Promise} Respuesta de la petición
 */
export const uploadPhoto = async (entityId, entityType, photo, token) => {
  const formData = new FormData();
  formData.append("photo", photo);

  const photoUrl = buildApiUrl(`/${entityType}/${entityId}/photo`);

  return axios.patch(photoUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Realiza login y devuelve el token
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @param {string} entityType - 'users' o 'stores'
 * @returns {Promise<string>} Token de autenticación
 */
export const loginAndGetToken = async (email, password, entityType) => {
  const loginUrl = buildApiUrl(`/${entityType}/login`);
  const response = await axios.post(loginUrl, { email, password });
  return response.data.token;
};

/**
 * Obtiene información de autenticación del localStorage
 * @returns {{ user: object|null, store: object|null, admin: object|null, token: string|null }}
 */
export const getAuthFromStorage = () => {
  return {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    store: localStorage.getItem("store")
      ? JSON.parse(localStorage.getItem("store"))
      : null,
    admin: localStorage.getItem("admin")
      ? JSON.parse(localStorage.getItem("admin"))
      : null,
    token: localStorage.getItem("token"),
  };
};

/**
 * Limpia la información de autenticación del localStorage
 */
export const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("store");
  localStorage.removeItem("admin");

  // Disparar evento personalizado para notificar el cambio
  window.dispatchEvent(new Event("auth-change"));
};

/**
 * Guarda información de autenticación en localStorage
 * @param {string} token - Token de autenticación
 * @param {object} entity - Usuario, tienda o admin
 * @param {string} entityType - 'rider', 'store' o 'admin'
 */
export const saveAuthToStorage = (token, entity, entityType) => {
  // Mapear 'rider' a 'user' para mantener consistencia con el backend
  const storageKey = entityType === "rider" ? "user" : entityType;

  localStorage.setItem("token", token);
  localStorage.setItem(storageKey, JSON.stringify(entity));

  // Disparar evento personalizado para notificar el cambio
  window.dispatchEvent(new Event("auth-change"));
};
