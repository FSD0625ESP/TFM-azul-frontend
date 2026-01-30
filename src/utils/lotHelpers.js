import axios from "axios";
import { toast } from "react-toastify";
import { buildApiUrl } from "./apiConfig";

/**
 * Obtiene todos los lotes del servidor
 * @returns {Promise<Array>} Array de lotes
 */
export const fetchAllLots = async () => {
  try {
    const response = await axios.get(buildApiUrl("/lots"));
    return response.data || [];
  } catch (error) {
    console.error("Error fetching lots:", error);
    throw error;
  }
};

/**
 * Filtra los lotes de una tienda específica
 * @param {Array} lots - Todos los lotes
 * @param {string} storeId - ID de la tienda
 * @returns {Array} Lotes de la tienda
 */
export const filterLotsByStore = (lots, storeId) => {
  return lots.filter((lot) => {
    const lotShopId = lot.shop?._id || lot.shop?.id || lot.shop;
    return String(lotShopId) === String(storeId);
  });
};

/**
 * Filtra los lotes reservados por un usuario específico
 * @param {Array} lots - Todos los lotes
 * @param {string} userId - ID del usuario
 * @returns {Array} Lotes reservados por el usuario
 */
export const filterLotsByRider = (lots, userId) => {
  return lots.filter((lot) => {
    if (!lot.reserved) return false;
    const lotRiderId =
      typeof lot.rider === "object" ? lot.rider?._id : lot.rider;
    return String(lotRiderId) === String(userId);
  });
};

/**
 * Elimina un lote
 * @param {string} lotId - ID del lote a eliminar
 * @returns {Promise<void>}
 */
export const deleteLot = async (lotId) => {
  try {
    await axios.delete(buildApiUrl(`/lots/${lotId}`));
    toast.success("Lot deleted successfully");
  } catch (error) {
    console.error("Error deleting lot:", error);
    toast.error("Error deleting lot");
    throw error;
  }
};

/**
 * Reserva un lote
 * @param {string} lotId - ID del lote a reservar
 * @returns {Promise<Object>} Lote actualizado
 */
export const reserveLot = async (lotId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Necesitas iniciar sesión para reservar");
      throw new Error("No authentication token");
    }

    const response = await axios.post(
      buildApiUrl(`/lots/${lotId}/reserve`),
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (response?.data?.lot) {
      toast.success("Lot reserved successfully!");
      return response.data.lot;
    }
    throw new Error("Invalid response");
  } catch (error) {
    console.error("Error reserving lot:", error);
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Error reserving lot");
    }
    throw error;
  }
};

/**
 * Cancela la reserva de un lote
 * @param {string} lotId - ID del lote
 * @returns {Promise<Object>} Lote actualizado
 */
export const cancelReservation = async (lotId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No estás autenticado");
      throw new Error("No authentication token");
    }

    const response = await axios.post(
      buildApiUrl(`/lots/${lotId}/cancel`),
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (response?.data?.lot) {
      toast.success("Reservation cancelled successfully");
      return response.data.lot;
    }
    throw new Error("Invalid response");
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    toast.error("Error cancelling reservation");
    throw error;
  }
};

/**
 * Obtiene la ubicación del usuario con reintentos
 * @param {number} maxAttempts - Número máximo de intentos
 * @param {Object} options - Opciones de geolocalización
 * @returns {Promise<GeolocationPosition>}
 */
export const getPositionWithRetries = async (maxAttempts = 3, options = {}) => {
  let attempts = 0;
  let position = null;

  while (attempts < maxAttempts && !position) {
    try {
      position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => reject(err),
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0,
            ...options,
          },
        );
      });
    } catch (err) {
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 800));
      }
    }
  }
  return position;
};

/**
 * Verifica si el rider está cerca de la tienda para recoger el lote
 * @param {string} lotId - ID del lote
 * @param {boolean} showToasts - Mostrar notificaciones
 * @returns {Promise<Object>} { allowed: boolean, distance: number }
 */
export const checkDistanceForPickup = async (lotId, showToasts = true) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      if (showToasts) toast.error("You are not authenticated");
      return { allowed: false };
    }

    const position = await getPositionWithRetries(2);
    if (!position) {
      if (showToasts)
        toast.error(
          "Could not get location. Enable GPS and allow permissions.",
        );
      return { allowed: false };
    }

    const { latitude, longitude } = position.coords;

    const response = await axios.post(
      buildApiUrl(`/lots/${lotId}/check-distance`),
      { riderLat: latitude, riderLng: longitude },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const { allowed, distance } = response.data;

    if (showToasts) {
      if (allowed) {
        toast.success(`Estás cerca de la tienda (${distance?.toFixed(0)}m)`);
      } else {
        toast.error(
          `Debes estar a menos de 100m de la tienda. Distancia actual: ${distance?.toFixed(
            0,
          )}m`,
        );
      }
    }

    return { allowed, distance };
  } catch (error) {
    console.error("Error checking distance:", error);
    if (showToasts) toast.error("Error verificando la distancia");
    return { allowed: false };
  }
};

/**
 * Marca un lote como entregado
 * @param {string} lotId - ID del lote
 * @returns {Promise<Object>} Lote actualizado
 */
export const markAsDelivered = async (lotId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No estás autenticado");
      throw new Error("No authentication token");
    }

    const distanceCheck = await checkDistanceForPickup(lotId, true);
    if (!distanceCheck.allowed) {
      throw new Error("Not within delivery range");
    }

    const response = await axios.post(
      buildApiUrl(`/lots/${lotId}/deliver`),
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (response?.data?.lot) {
      toast.success("Lote marcado como entregado");
      return response.data.lot;
    }
    throw new Error("Invalid response");
  } catch (error) {
    console.error("Error marking as delivered:", error);
    if (error.message !== "Not within delivery range") {
      toast.error("Error al marcar como entregado");
    }
    throw error;
  }
};

/**
 * Obtiene el estado de un lote (disponible, reservado, recogido, entregado)
 * @param {Object} lot - Lote
 * @returns {Object} { status: string, label: string, color: string }
 */
export const getLotStatus = (lot) => {
  if (lot.delivered) {
    return {
      status: "delivered",
      label: "Entregado",
      color: "bg-emerald-100 text-emerald-700",
    };
  }
  if (lot.pickedUp) {
    return {
      status: "picked_up",
      label: "Recogido",
      color: "bg-purple-100 text-purple-700",
    };
  }
  if (lot.reserved) {
    return {
      status: "reserved",
      label: "Reservado",
      color: "bg-blue-100 text-blue-700",
    };
  }
  return {
    status: "available",
    label: "Disponible",
    color: "bg-green-100 text-green-700",
  };
};
