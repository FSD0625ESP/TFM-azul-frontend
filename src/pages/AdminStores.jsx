import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminData } from "../hooks/useAdminData";
import { AdminCreateModal } from "../components/AdminCreateModal";
import { ROUTES } from "../utils/constants";

const AdminStores = () => {
  const navigate = useNavigate();
  const { data: stores, loading, create, remove } = useAdminData("stores");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    type: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStore((prev) => ({ ...prev, [name]: value }));
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

    const success = await create(newStore);
    if (success) {
      setShowCreateModal(false);
      setNewStore({
        name: "",
        email: "",
        password: "",
        address: "",
        type: "",
        phone: "",
      });
    }
  };

  const storeFields = [
    { name: "name", label: "Name", placeholder: "Store name", required: true },
    {
      name: "type",
      label: "Type",
      placeholder: "Restaurant, Bakery, etc.",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      placeholder: "123 Main St, City",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "store@example.com",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••",
      required: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+34 123 456 789",
    },
  ];

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
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
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
                        onClick={() => remove(store._id, store.name)}
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
      <AdminCreateModal
        show={showCreateModal}
        onClose={() => {
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
        onSubmit={handleCreateStore}
        title="Create New Store"
        fields={storeFields}
        formData={newStore}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default AdminStores;
