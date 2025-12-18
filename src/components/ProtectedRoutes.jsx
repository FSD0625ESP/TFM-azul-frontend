/**
 * Componentes de rutas protegidas para controlar acceso
 */

import { Navigate } from "react-router-dom";
import { ROUTES, USER_TYPES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";

/**
 * Ruta protegida - solo accesible con autenticación
 */
export const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated ? element : <Navigate to={ROUTES.HOME} replace />;
};

/**
 * Ruta pública - redirige al dashboard si ya está autenticado
 */
export const PublicRoute = ({ element }) => {
  const { isAuthenticated, userType, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return element;
  }

  // Redirigir al dashboard apropiado según el tipo de usuario
  if (userType === USER_TYPES.ADMIN) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return userType === USER_TYPES.RIDER ? (
    <Navigate to={ROUTES.MAIN_SCREEN} replace />
  ) : (
    <Navigate to={ROUTES.STORE_PROFILE} replace />
  );
};

/**
 * Ruta solo para Riders
 */
export const RiderOnlyRoute = ({ element }) => {
  const { isAuthenticated, userType, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (userType === USER_TYPES.RIDER) {
    return element;
  }

  if (userType === USER_TYPES.STORE) {
    return <Navigate to={ROUTES.STORE_PROFILE} replace />;
  }

  return <Navigate to={ROUTES.HOME} replace />;
};

/**
 * Ruta solo para Stores
 */
export const StoreOnlyRoute = ({ element }) => {
  const { isAuthenticated, userType, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (userType === USER_TYPES.STORE) {
    console.log("✅ StoreOnlyRoute: Store authenticated, showing element");
    return element;
  }

  if (userType === USER_TYPES.RIDER) {
    return <Navigate to={ROUTES.RIDER_PROFILE} replace />;
  }

  return <Navigate to={ROUTES.HOME} replace />;
};

/**
 * Ruta solo para Admin
 */
export const AdminOnlyRoute = ({ element }) => {
  const { isAuthenticated, userType, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (userType === USER_TYPES.ADMIN) {
    return element;
  }

  return <Navigate to={ROUTES.HOME} replace />;
};
