import React from "react";

/**
 * Componente para mostrar mensajes de éxito o error
 */
const FormAlert = ({ type = "success", message }) => {
  if (!message) return null;

  const alertClass =
    type === "success"
      ? "alert alert-success mb-4 text-white bg-green-600 border-none"
      : "alert alert-error mb-4 text-white bg-red-600 border-none";

  return (
    <div className={alertClass} role="alert">
      <span>{message}</span>
    </div>
  );
};

export default FormAlert;
