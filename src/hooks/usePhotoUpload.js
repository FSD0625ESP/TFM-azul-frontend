/**
 * Custom hook para manejar la subida de fotos
 */

import { useState } from "react";
import { validateImageFile } from "../utils/validation";

/**
 * Hook para gestionar la selección y preview de fotos
 * @returns {Object} Estado y funciones para manejar fotos
 */
export const usePhotoUpload = () => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  /**
   * Maneja el cambio de archivo de foto
   * @param {Event} e - Evento del input file
   * @returns {boolean} true si la foto es válida
   */
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return false;

    const validation = validateImageFile(file);

    if (!validation.valid) {
      alert(validation.error);
      return false;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    return true;
  };

  /**
   * Resetea el estado de la foto
   */
  const resetPhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(null);
    setPhotoPreview("");
  };

  return {
    photo,
    photoPreview,
    handlePhotoChange,
    resetPhoto,
    setPhoto,
    setPhotoPreview,
  };
};
