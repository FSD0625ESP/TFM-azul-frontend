/**
 * Componente reutilizable para mostrar detalles de información
 */

import React from "react";

/**
 * Tarjeta de información con icono
 */
export const InfoCard = ({ icon, label, value, actionButton }) => {
  return (
    <div className="flex gap-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-center h-10 w-10 min-w-[40px] rounded-lg bg-gray-100 dark:bg-gray-700">
        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
          {icon}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
        <p className="text-base font-medium text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
      {actionButton && actionButton}
    </div>
  );
};
