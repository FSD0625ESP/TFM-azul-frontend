import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminHeader, AdminStatsCard } from "../components/AdminComponents";
import { buildApiUrl } from "../utils/apiConfig";

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
          axios.get(buildApiUrl("/admin/users"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(buildApiUrl("/admin/stores"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(buildApiUrl("/admin/lots"), {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        title="Admin Panel"
        subtitle={admin?.email}
        onLogout={handleLogout}
      />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AdminStatsCard
            icon="group"
            label="Total Users"
            value={stats.users}
            color="blue"
            onClick={() => navigate("/admin/users")}
          />
          <AdminStatsCard
            icon="storefront"
            label="Total Stores"
            value={stats.stores}
            color="emerald"
            onClick={() => navigate("/admin/stores")}
          />
          <AdminStatsCard
            icon="inventory_2"
            label="Total Lots"
            value={stats.lots}
            color="purple"
            onClick={() => navigate("/admin/lots")}
          />
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
