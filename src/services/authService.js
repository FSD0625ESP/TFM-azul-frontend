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
    const response = await api.post("/usuarios/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phoneNumber ? parseInt(userData.phoneNumber) : null,
      photo: "",
      user_type: null,
    });
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

export default api;
