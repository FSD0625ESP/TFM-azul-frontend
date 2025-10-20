import axios from "axios";

// Configurar la URL base del backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Servicio de registro
export const registerUser = async (userData) => {
  try {
    const userType = sessionStorage.getItem("userType");

    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phoneNumber ? parseInt(userData.phoneNumber) : null,
      photo: "",
      user_type: userType,
    };

    const response = await api.post("/usuarios/register", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Servicio de login
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/usuarios/login", {
      email,
      password,
    });
    // Guardar el token en localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Servicio para registrar tienda
export const registerShop = async (shopData, userId) => {
  try {
    const response = await api.post("/shops/register", {
      user: userId,
      name: shopData.shopName,
      address: shopData.streetAddress,
      category: shopData.shopType,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const registerShopAndMark = async (shopData, userId) => {
  try {
    const response = await api.post(`/createMark/createMark/${userId}`, {
      shopName: shopData.shopName,
      shopType: shopData.shopType,
      streetAddress: shopData.streetAddress,
      lat: shopData.lat,
      long: shopData.long,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;
