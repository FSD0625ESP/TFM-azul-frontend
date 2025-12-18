import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * AdminHeader - Encabezado compartido para todas las páginas de administración
 * @param {string} title - Título de la página
 * @param {string} subtitle - Subtítulo opcional
 * @param {boolean} showBack - Mostrar botón de retroceso
 * @param {Function} onLogout - Callback para cerrar sesión
 */
export const AdminHeader = ({
  title,
  subtitle,
  showBack = false,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-700">
                arrow_back
              </span>
            </button>
          )}
          <div className={showBack ? "" : "flex items-center gap-3"}>
            {!showBack && (
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600">
                  admin_panel_settings
                </span>
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 bg-transparent border-none text-xs font-medium text-red-600 cursor-pointer hover:text-red-700 transition-colors px-2"
              title="Logout"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

/**
 * AdminSidebar - Barra lateral de navegación para admin
 * @param {string} currentPage - Página actual ('dashboard' | 'users' | 'stores' | 'lots')
 */
export const AdminSidebar = ({ currentPage = "dashboard" }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      icon: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      id: "users",
      icon: "group",
      label: "Users",
      path: "/admin/users",
    },
    {
      id: "stores",
      icon: "store",
      label: "Stores",
      path: "/admin/stores",
    },
    {
      id: "lots",
      icon: "inventory_2",
      label: "Lots",
      path: "/admin/lots",
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full flex justify-around border-t border-gray-300 bg-white/80 backdrop-blur p-2 gap-2 md:static md:w-64 md:flex-col md:border-t-0 md:border-r md:h-screen md:pt-4">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className={`flex md:flex-row flex-col items-center justify-center gap-2 flex-1 md:flex-none rounded-lg p-2 md:px-4 md:py-3 transition-colors border-none cursor-pointer ${
            currentPage === item.id
              ? "bg-emerald-500/10 text-emerald-600 font-bold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span className="material-symbols-outlined text-xl md:text-base">
            {item.icon}
          </span>
          <span className="text-xs md:text-sm">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

/**
 * AdminStatsCard - Tarjeta de estadística para dashboard
 * @param {string} icon - Icono de Material Symbols
 * @param {string} label - Etiqueta de la estadística
 * @param {number} value - Valor numérico
 * @param {string} color - Color del tema ('emerald' | 'blue' | 'purple' | 'orange')
 * @param {Function} onClick - Callback al hacer clic (opcional)
 */
export const AdminStatsCard = ({
  icon,
  label,
  value,
  color = "emerald",
  onClick,
}) => {
  const colorClasses = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses[color]}`}
      >
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

/**
 * AdminTable - Tabla genérica para mostrar datos en páginas de admin
 * @param {Array} columns - Configuración de columnas [{ key, label, render }]
 * @param {Array} data - Datos a mostrar
 * @param {Function} onRowClick - Callback al hacer clic en una fila (opcional)
 * @param {boolean} loading - Estado de carga
 */
export const AdminTable = ({ columns, data, onRowClick, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">
          inbox
        </span>
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={row._id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
