import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Obtener el Shop ID basándose en el User ID
export const getShopByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/shops/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shop by user:", error);
    throw error;
  }
};

// Crear un nuevo lote (plato)
export const createLot = async (shopId, name, description, pickupDeadline) => {
  try {
    const response = await axios.post(`${API_URL}/lots/create`, {
      shopId,
      name,
      description,
      pickupDeadline,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating lot:", error);
    throw error.response?.data || error;
  }
};

// Obtener todos los lotes
export const getAllLots = async () => {
  try {
    const response = await axios.get(`${API_URL}/lots`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lots:", error);
    throw error.response?.data || error;
  }
};

// Obtener lotes de una tienda específica
export const getShopLots = async (shopId) => {
  try {
    const response = await axios.get(`${API_URL}/lots`);
    // Filtrar lotes por el ID de la tienda (shop puede ser un objeto o string)
    return response.data.filter((lot) => {
      const lotShopId = typeof lot.shop === "object" ? lot.shop._id : lot.shop;
      return lotShopId === shopId;
    });
  } catch (error) {
    console.error("Error fetching shop lots:", error);
    throw error.response?.data || error;
  }
};

// Eliminar un lote
export const deleteLot = async (lotId) => {
  try {
    const response = await axios.delete(`${API_URL}/lots/${lotId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lot:", error);
    throw error.response?.data || error;
  }
};
