/**
 * Componente reutilizable para subir foto de perfil
 */

import React from "react";
import { usePhotoUpload } from "../hooks/usePhotoUpload";
import { PLACEHOLDER_IMAGE } from "../utils/constants";

/**
 * Input de foto con preview
 * @param {Object} props
 * @param {File} props.photo - Archivo de foto actual
 * @param {function} props.setPhoto - Función para actualizar la foto
 * @param {string} props.photoPreview - URL del preview de la foto
 * @param {function} props.setPhotoPreview - Función para actualizar el preview
 * @param {string} props.label - Texto del label
 * @param {string} props.inputId - ID único para el input
 */
const PhotoInput = ({
  photo,
  setPhoto,
  photoPreview,
  setPhotoPreview,
  label = "Optional: Add profile photo",
  inputId = "photo-input",
}) => {
  const { handlePhotoChange } = usePhotoUpload();

  const onPhotoChange = (e) => {
    const success = handlePhotoChange(e);
    if (success && e.target.files?.[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="relative mb-2">
        <img
          src={photoPreview || PLACEHOLDER_IMAGE}
          alt="Profile preview"
          className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
        />
        <label
          htmlFor={inputId}
          className="absolute bottom-0 right-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 text-white cursor-pointer shadow-md hover:bg-emerald-600"
        >
          <span className="material-symbols-outlined text-sm">add_a_photo</span>
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={onPhotoChange}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
};

export default PhotoInput;
