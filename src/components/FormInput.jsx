/**
 * Componentes de input reutilizables para formularios
 */

import React from "react";

/**
 * Input de texto con icono
 */
export const InputWithIcon = ({
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  className = "",
}) => {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500 ${className}`}
      />
    </div>
  );
};

/**
 * Campo de entrada genérico (para mantener compatibilidad con formularios existentes)
 */
export const FormInput = ({ type, value, onChange, placeholder, icon }) => {
  return (
    <InputWithIcon
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      icon={icon}
    />
  );
};
