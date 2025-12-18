/**
 * Modal reutilizable para crear usuarios/tiendas en admin
 */

import React from "react";
import { FormInput } from "./FormInput";

/**
 * Modal de creación para panel de admin
 */
export const AdminCreateModal = ({
  show,
  onClose,
  onSubmit,
  title,
  fields,
  formData,
  onChange,
}) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {fields.map((field) => (
            <FormInput
              key={field.name}
              label={field.label}
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={onChange}
              placeholder={field.placeholder}
              required={field.required}
            />
          ))}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
