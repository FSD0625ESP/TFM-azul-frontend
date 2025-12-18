/**
 * Funciones de validación reutilizables
 */

import { VALIDATION_MESSAGES, FILE_LIMITS } from "./constants";

/**
 * Valida que un email tenga formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que las contraseñas coincidan
 * @param {string} password - Contraseña
 * @param {string} repeatPassword - Contraseña repetida
 * @returns {boolean} true si coinciden
 */
export const passwordsMatch = (password, repeatPassword) => {
  return password === repeatPassword && password.length > 0;
};

/**
 * Valida que un archivo sea una imagen válida
 * @param {File} file - Archivo a validar
 * @returns {{ valid: boolean, error?: string }} Resultado de la validación
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (!file.type.startsWith("image/")) {
    return { valid: false, error: VALIDATION_MESSAGES.INVALID_IMAGE };
  }

  if (file.size > FILE_LIMITS.MAX_IMAGE_SIZE) {
    return { valid: false, error: VALIDATION_MESSAGES.IMAGE_TOO_LARGE };
  }

  return { valid: true };
};

/**
 * Valida campos requeridos de un formulario
 * @param {Object} fields - Objeto con campos a validar
 * @returns {boolean} true si todos los campos tienen valor
 */
export const validateRequiredFields = (fields) => {
  return Object.values(fields).every((value) => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  });
};
