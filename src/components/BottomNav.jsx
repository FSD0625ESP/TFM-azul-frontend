/**
 * Componente de navegación inferior reutilizable
 */

import React from "react";

/**
 * Item de navegación
 */
const NavItem = ({ href, icon, label, isActive = false }) => {
  const activeClasses =
    "flex-col items-center justify-center gap-1 flex-1 rounded-lg bg-emerald-50 p-2 no-underline text-emerald-500 text-xs font-bold";
  const inactiveClasses =
    "flex-col items-center justify-center gap-1 flex-1 rounded-lg p-2 no-underline text-gray-400 text-xs hover:text-gray-600 transition-colors";

  return (
    <a
      href={href}
      className={`flex ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span>{label}</span>
    </a>
  );
};

/**
 * Navegación inferior
 */
export const BottomNav = ({ items }) => {
  return (
    <nav className="fixed bottom-0 w-full flex justify-around border-t border-gray-300 bg-white/80 backdrop-blur p-2 gap-2">
      {items.map((item, index) => (
        <NavItem
          key={index}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isActive={item.active || false}
        />
      ))}
    </nav>
  );
};
