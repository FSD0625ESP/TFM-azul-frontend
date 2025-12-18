/**
 * Constantes globales de la aplicación
 * Centraliza valores reutilizables para evitar duplicación
 */

// URLs de imágenes placeholder
export const PLACEHOLDER_IMAGE = "https://via.placeholder.com/96";

// Mensajes de validación de formularios
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: "Please fill in all required fields",
  PASSWORDS_MISMATCH: "Passwords do not match",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_IMAGE: "Please select an image file",
  IMAGE_TOO_LARGE: "Image size must be less than 5MB",
  REGISTRATION_SUCCESS: "Registration successful!",
  LOGIN_SUCCESS: "Login successful!",
  GENERIC_ERROR: "An error occurred. Please try again",
};

// Límites de archivos
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB en bytes
};

// Tipos de usuario
export const USER_TYPES = {
  RIDER: "rider",
  STORE: "store",
  ADMIN: "admin",
  SHOP: "shop", // Alias de store usado en algunos lugares
};

// Rutas de navegación
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  RIDER_PROFILE: "/rider-profile",
  STORE_PROFILE: "/store-profile",
  MAIN_SCREEN: "/mainscreen",
  ADMIN_DASHBOARD: "/admin/dashboard",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",
};

// Configuración de Mapbox
export const MAPBOX_CONFIG = {
  MIN_QUERY_LENGTH: 3,
  AUTOCOMPLETE_LIMIT: 5,
};
