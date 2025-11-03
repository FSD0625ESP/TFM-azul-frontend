import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import LoginNew from "./pages/LoginNew";
import RegisterNew from "./pages/RegisterNew";
import RiderProfile from "./pages/RiderProfile";
import StoreProfile from "./pages/StoreProfile";
import MainScreen from "./pages/MainScreen";
import LotsPage from "./pages/LotsPage";
import StoreLotsPage from "./pages/StoreLotsPage";
import ReservedLotsPage from "./pages/ReservedLotsPage";

// Protected Route for authenticated users only
const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/" />;
};

// Protected Route for Riders only
const RiderOnlyRoute = ({ element, userType }) => {
  if (userType === "rider") {
    return element;
  } else if (userType === "store") {
    // If a store tries to access a rider route, redirect to store profile
    return <Navigate to="/store-profile" />;
  }
  return <Navigate to="/" />;
};

// Protected Route for Stores only
const StoreOnlyRoute = ({ element, userType }) => {
  if (userType === "store") {
    return element;
  } else if (userType === "rider") {
    // If a rider tries to access a store route, redirect to rider profile
    return <Navigate to="/rider-profile" />;
  }
  return <Navigate to="/" />;
};

// Public Route - redirects to appropriate dashboard if already authenticated
const PublicRoute = ({ element, isAuthenticated, userType }) => {
  if (!isAuthenticated) {
    return element;
  }
  // Redirect to appropriate dashboard based on user type
  return userType === "rider" ? (
    <Navigate to="/mainscreen" />
  ) : (
    <Navigate to="/store-profile" />
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'rider' or 'store'
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = () => {
    const user = localStorage.getItem("user");
    const store = localStorage.getItem("store");
    const token = localStorage.getItem("token");

    if (token && user) {
      setIsAuthenticated(true);
      setUserType("rider");
    } else if (token && store) {
      setIsAuthenticated(true);
      setUserType("store");
    } else {
      setIsAuthenticated(false);
      setUserType(null);
    }
  };

  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus();
    setIsLoading(false);

    // Listen for storage changes (logout or login from another tab/window)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check auth status periodically in case localStorage changes from same tab
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes - accessible only without session */}
        <Route
          path="/"
          element={
            <PublicRoute
              element={<Home />}
              isAuthenticated={isAuthenticated}
              userType={userType}
            />
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute
              element={<RegisterNew />}
              isAuthenticated={isAuthenticated}
              userType={userType}
            />
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute
              element={<LoginNew />}
              isAuthenticated={isAuthenticated}
              userType={userType}
            />
          }
        />

        {/* Protected Routes - accessible only with session */}
        {/* Rider-only routes */}
        <Route
          path="/mainscreen"
          element={
            <ProtectedRoute
              element={
                <RiderOnlyRoute element={<MainScreen />} userType={userType} />
              }
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/rider-profile"
          element={
            <ProtectedRoute
              element={
                <RiderOnlyRoute
                  element={<RiderProfile />}
                  userType={userType}
                />
              }
              isAuthenticated={isAuthenticated}
            />
          }
        />

        {/* Reserved Lots - Rider only route */}
        <Route
          path="/reserved-lots"
          element={
            <ProtectedRoute
              element={
                <RiderOnlyRoute
                  element={<ReservedLotsPage />}
                  userType={userType}
                />
              }
              isAuthenticated={isAuthenticated}
            />
          }
        />

        {/* Store-only routes */}
        <Route
          path="/store-profile"
          element={
            <ProtectedRoute
              element={
                <StoreOnlyRoute
                  element={<StoreProfile />}
                  userType={userType}
                />
              }
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/lots"
          element={
            <ProtectedRoute
              element={
                <StoreOnlyRoute element={<LotsPage />} userType={userType} />
              }
              isAuthenticated={isAuthenticated}
            />
          }
        />

        {/* Store Lots Page - accessible by riders to view lots from a specific store */}
        <Route
          path="/store/:storeId/lots"
          element={
            <ProtectedRoute
              element={
                <RiderOnlyRoute
                  element={<StoreLotsPage />}
                  userType={userType}
                />
              }
              isAuthenticated={isAuthenticated}
            />
          }
        />

        {/* New route without id in URL - storeId passed via location.state or sessionStorage */}
        <Route
          path="/store/lots"
          element={
            <ProtectedRoute
              element={
                <RiderOnlyRoute
                  element={<StoreLotsPage />}
                  userType={userType}
                />
              }
              isAuthenticated={isAuthenticated}
            />
          }
        />

        {/* New route without id in URL - storeId passed via location.state or sessionStorage */}
        <Route
          path="/store/lots"
          element={
            <ProtectedRoute
              element={
                <RiderOnlyRoute
                  element={<StoreLotsPage />}
                  userType={userType}
                />
              }
              isAuthenticated={isAuthenticated}
            />
          }
        />

        {/* Fallback - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
