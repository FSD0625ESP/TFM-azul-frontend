import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    lots: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [usersRes, storesRes, lotsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/admin/stores`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/admin/lots`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          users: usersRes.data.length,
          stores: storesRes.data.length,
          lots: lotsRes.data.length,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Error loading statistics");
        setLoading(false);
      }
    };

    if (admin) fetchStats();
  }, [admin]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600">
                admin_panel_settings
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">{admin?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/change-password")}
              className="flex items-center gap-1 bg-transparent border-none text-xs font-medium text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors px-2"
              title="Change Password"
            >
              <span className="material-symbols-outlined text-base">
                lock_reset
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent border-none text-sm font-medium text-red-600 cursor-pointer hover:text-red-700 transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Users Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 text-2xl">
                  group
                </span>
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.users}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Users
            </h3>
            <p className="text-xs text-gray-400">Registered riders</p>
          </div>

          {/* Stores Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-2xl">
                  storefront
                </span>
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.stores}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Stores
            </h3>
            <p className="text-xs text-gray-400">Partner stores</p>
          </div>

          {/* Lots Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600 text-2xl">
                  inventory_2
                </span>
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.lots}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Lots
            </h3>
            <p className="text-xs text-gray-400">Food lots created</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manage Users */}
          <button
            onClick={() => navigate("/admin/users")}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer text-center"
          >
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-blue-600 text-4xl">
                manage_accounts
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Manage Users
            </h3>
            <p className="text-sm text-gray-600">
              Create, view and delete riders
            </p>
          </button>

          {/* Manage Stores */}
          <button
            onClick={() => navigate("/admin/stores")}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer text-center"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-emerald-600 text-4xl">
                store
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Manage Stores
            </h3>
            <p className="text-sm text-gray-600">
              Create, view and delete stores
            </p>
          </button>

          {/* View Lots */}
          <button
            onClick={() => navigate("/admin/lots")}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer text-center"
          >
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-purple-600 text-4xl">
                view_list
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">View Lots</h3>
            <p className="text-sm text-gray-600">
              Monitor all food lots and reservations
            </p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
