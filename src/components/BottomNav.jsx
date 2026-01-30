/**
 * Componente de navegación inferior reutilizable para toda la aplicación
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Item de navegación
 */
const NavItem = ({ path, icon, label, isActive = false, onClick }) => {
  const activeClasses =
    "flex-col items-center justify-center gap-1 flex-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 p-2 text-emerald-500 dark:text-emerald-400 text-xs font-bold cursor-pointer transition-colors";
  const inactiveClasses =
    "flex-col items-center justify-center gap-1 flex-1 rounded-lg p-2 text-gray-400 dark:text-gray-500 text-xs hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer";

  return (
    <button
      onClick={onClick}
      className={`flex ${isActive ? activeClasses : inactiveClasses} bg-transparent border-none`}
    >
      <span className="material-symbols-outlined text-2xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

/**
 * Navegación inferior para Riders
 * Detecta automáticamente la página activa usando useLocation
 */
export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: "/mainscreen",
      icon: "map",
      label: "Map",
    },
    {
      path: "/reserved-lots",
      icon: "bookmark",
      label: "Reserved",
    },
    {
      path: "/rider-profile",
      icon: "person",
      label: "Profile",
    },
  ];

  // Determinar cuál item está activo basado en la ruta actual
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 gap-2 z-40">
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          path={item.path}
          icon={item.icon}
          label={item.label}
          isActive={isActive(item.path)}
          onClick={() => navigate(item.path)}
        />
      ))}
    </nav>
  );
};

/**
 * Navegación inferior para Stores
 * Detecta automáticamente la página activa usando useLocation
 */
export const StoreBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: "/lots",
      icon: "list_alt",
      label: "Lots",
    },
    {
      path: "/store-profile",
      icon: "person",
      label: "Profile",
    },
  ];

  // Determinar cuál item está activo basado en la ruta actual
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 gap-2 z-40">
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          path={item.path}
          icon={item.icon}
          label={item.label}
          isActive={isActive(item.path)}
          onClick={() => navigate(item.path)}
        />
      ))}
    </nav>
  );
};
