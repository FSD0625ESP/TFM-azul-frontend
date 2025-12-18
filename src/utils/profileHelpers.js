/**
 * Utilidades para gestión de perfiles (rider y store)
 */

import axios from "axios";
import { buildApiUrl } from "./apiConfig";
import { validateImageFile } from "./validation";
import { toast } from "react-toastify";

/**
 * Sube una foto de perfil para un usuario o tienda
 * @param {string} entityId - ID del usuario o tienda
 * @param {string} entityType - 'users' o 'stores'
 * @param {File} file - Archivo de imagen
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Entidad actualizada
 */
export const uploadProfilePhoto = async (entityId, entityType, file, token) => {
  // Validar archivo
  const validation = validateImageFile(file);
  if (!validation.valid) {
    toast.error(validation.error);
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append("photo", file);

  const response = await axios.patch(
    buildApiUrl(`/${entityType}/${entityId}/photo`),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data[entityType === "users" ? "user" : "store"];
};

/**
 * Actualiza la entidad en localStorage
 * @param {string} key - 'user' o 'store'
 * @param {Object} data - Datos actualizados
 */
export const updateStoredEntity = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Obtiene la entidad del localStorage
 * @param {string} key - 'user' o 'store'
 * @returns {Object|null} Datos de la entidad
 */
export const getStoredEntity = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Confirma la recogida de un lote escaneando QR
 * @param {string} storeId - ID de la tienda (del QR)
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const confirmPickup = async (storeId, token) => {
  const response = await axios.post(
    buildApiUrl(`/lots/confirm-pickup/${encodeURIComponent(storeId)}`),
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
