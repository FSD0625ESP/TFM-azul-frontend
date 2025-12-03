import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    type: "",
    phone: "",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Error loading stores");
      setLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();

    if (
      !newStore.name ||
      !newStore.email ||
      !newStore.password ||
      !newStore.address ||
      !newStore.type
    ) {
      toast.error("All fields except phone are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/admin/stores`, newStore, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Store created successfully");
      setShowCreateModal(false);
      setNewStore({
        name: "",
        email: "",
        password: "",
        address: "",
        type: "",
        phone: "",
      });
      fetchStores();
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error(error.response?.data?.message || "Error creating store");
    }
  };

  const handleDeleteStore = async (storeId, storeName) => {
    if (!confirm(`Are you sure you want to delete store "${storeName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Store deleted successfully");
      fetchStores();
    } catch (error) {
      console.error("Error deleting store:", error);
      toast.error("Error deleting store");
    }
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
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">Manage Stores</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Create Store</span>
          </button>
        </div>
      </header>

      {/* Stores List */}
      <main className="p-6 max-w-7xl mx-auto">
        {stores.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">
              storefront
            </span>
            <p className="text-gray-500 text-sm">No stores yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Address
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr
                    key={store._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {store.photo ? (
                          <img
                            src={store.photo}
                            alt={store.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-600">
                              storefront
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900">
                          {store.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{store.type}</td>
                    <td className="p-4 text-gray-600">{store.email}</td>
                    <td className="p-4 text-gray-600 text-sm">
                      {store.address}
                    </td>
                    <td className="p-4 text-gray-600">
                      {store.phone || "N/A"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteStore(store._id, store.name)}
                        className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                        <span className="text-sm">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create Store Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Create New Store
            </h2>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newStore.name}
                  onChange={(e) =>
                    setNewStore({ ...newStore, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="Store name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <input
                  type="text"
                  value={newStore.type}
                  onChange={(e) =>
                    setNewStore({ ...newStore, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="Restaurant, Bakery, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={newStore.address}
                  onChange={(e) =>
                    setNewStore({ ...newStore, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="123 Main St, City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newStore.email}
                  onChange={(e) =>
                    setNewStore({ ...newStore, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="store@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={newStore.password}
                  onChange={(e) =>
                    setNewStore({ ...newStore, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newStore.phone}
                  onChange={(e) =>
                    setNewStore({ ...newStore, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="+34 123 456 789"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewStore({
                      name: "",
                      email: "",
                      password: "",
                      address: "",
                      type: "",
                      phone: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;
