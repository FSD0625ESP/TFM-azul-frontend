import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import LoginNew from "./pages/LoginNew";
import RegisterNew from "./pages/RegisterNew";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import RiderProfile from "./pages/RiderProfile";
import StoreProfile from "./pages/StoreProfile";
import MainScreen from "./pages/MainScreen";
import LotsPage from "./pages/LotsPage";
import StoreLotsPage from "./pages/StoreLotsPage";
import ReservedLotsPage from "./pages/ReservedLotsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import AdminLots from "./pages/AdminLots";
import {
  ProtectedRoute,
  PublicRoute,
  RiderOnlyRoute,
  StoreOnlyRoute,
  AdminOnlyRoute,
} from "./components/ProtectedRoutes";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute element={<Home />} />} />
        <Route
          path="/register"
          element={<PublicRoute element={<RegisterNew />} />}
        />
        <Route path="/login" element={<PublicRoute element={<LoginNew />} />} />

        {/* Password Recovery Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Change Password - authenticated users only */}
        <Route
          path="/change-password"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />

        {/* Rider-only routes */}
        <Route
          path="/mainscreen"
          element={<RiderOnlyRoute element={<MainScreen />} />}
        />
        <Route
          path="/rider-profile"
          element={<RiderOnlyRoute element={<RiderProfile />} />}
        />
        <Route
          path="/reserved-lots"
          element={<RiderOnlyRoute element={<ReservedLotsPage />} />}
        />
        <Route
          path="/store/:storeId/lots"
          element={<RiderOnlyRoute element={<StoreLotsPage />} />}
        />

        {/* Store-only routes */}
        <Route
          path="/store-profile"
          element={<StoreOnlyRoute element={<StoreProfile />} />}
        />
        <Route
          path="/lots"
          element={<StoreOnlyRoute element={<LotsPage />} />}
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={<AdminOnlyRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/admin/users"
          element={<AdminOnlyRoute element={<AdminUsers />} />}
        />
        <Route
          path="/admin/stores"
          element={<AdminOnlyRoute element={<AdminStores />} />}
        />
        <Route
          path="/admin/lots"
          element={<AdminOnlyRoute element={<AdminLots />} />}
        />

        {/* Fallback - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
