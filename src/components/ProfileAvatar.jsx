/**
 * Componente de avatar de perfil con funcionalidad de subida de foto
 */

import React from "react";

/**
 * Avatar con opción de cambiar foto
 */
export const ProfileAvatar = ({
  photoUrl,
  name,
  uploading,
  onPhotoChange,
  icon = "person",
  size = "large",
}) => {
  const sizeClasses = size === "large" ? "h-24 w-24" : "h-16 w-16";
  const iconSize = size === "large" ? "text-5xl" : "text-3xl";

  return (
    <div className="relative group">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className={`${sizeClasses} rounded-full border-4 border-white object-cover shadow-md`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md`}
        >
          <span className={`material-symbols-outlined text-white ${iconSize}`}>
            {icon}
          </span>
        </div>
      )}
      <label
        htmlFor="photo-upload"
        className={`absolute inset-0 flex items-center justify-center ${sizeClasses} rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}
      >
        {uploading ? (
          <span className="material-symbols-outlined text-white text-3xl animate-spin">
            sync
          </span>
        ) : (
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-white text-2xl">
              photo_camera
            </span>
            <span className="text-white text-xs mt-1">
              {photoUrl ? "Change" : "Add"}
            </span>
          </div>
        )}
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={onPhotoChange}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};
