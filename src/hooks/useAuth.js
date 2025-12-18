/**
 * Custom hook para manejar la lógica de autenticación
 */

import { useState, useEffect, useCallback } from "react";
import { getAuthFromStorage, clearAuthStorage } from "../utils/authHelpers";

/**
 * Hook para gestionar el estado de autenticación
 * @returns {Object} Estado y funciones de autenticación
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'rider', 'store', or 'admin'
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Verifica el estado de autenticación actual
   */
  const checkAuthStatus = useCallback(() => {
    const { user, store, admin, token } = getAuthFromStorage();

    if (token && admin) {
      setIsAuthenticated(true);
      setUserType("admin");
      setCurrentUser(admin);
    } else if (token && user) {
      setIsAuthenticated(true);
      setUserType("rider");
      setCurrentUser(user);
    } else if (token && store) {
      setIsAuthenticated(true);
      setUserType("store");
      setCurrentUser(store);
    } else {
      setIsAuthenticated(false);
      setUserType(null);
      setCurrentUser(null);
    }

    setIsLoading(false);
  }, []);

  /**
   * Cierra la sesión del usuario
   */
  const logout = () => {
    clearAuthStorage();
    setIsAuthenticated(false);
    setUserType(null);
    setCurrentUser(null);
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Escuchar cambios en localStorage (login/logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Solo re-verificar si cambiaron las claves de auth
      if (
        e.key === "token" ||
        e.key === "user" ||
        e.key === "store" ||
        e.key === "admin" ||
        e.key === null
      ) {
        checkAuthStatus();
      }
    };

    const handleAuthChange = () => {
      checkAuthStatus();
    };

    // Para cambios desde otras pestañas
    window.addEventListener("storage", handleStorageChange);

    // Para cambios en la misma pestaña (evento personalizado)
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [checkAuthStatus]);

  return {
    isAuthenticated,
    userType,
    currentUser,
    isLoading,
    checkAuthStatus,
    logout,
    setIsAuthenticated,
    setUserType,
    setCurrentUser,
  };
};
