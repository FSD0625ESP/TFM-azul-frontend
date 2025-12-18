import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminData } from "../hooks/useAdminData";
import { AdminCreateModal } from "../components/AdminCreateModal";
import { ROUTES } from "../utils/constants";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { data: users, loading, create, remove } = useAdminData("users");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Name, email and password are required");
      return;
    }

    const success = await create(newUser);
    if (success) {
      setShowCreateModal(false);
      setNewUser({ name: "", email: "", password: "", phone: "" });
    }
  };

  const userFields = [
    { name: "name", label: "Name", placeholder: "John Doe", required: true },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "john@example.com",
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
            <h1 className="text-lg font-bold text-gray-900">Manage Users</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Create User</span>
          </button>
        </div>
      </header>

      {/* Users List */}
      <main className="p-6 max-w-7xl mx-auto">
        {users.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">
              group
            </span>
            <p className="text-gray-500 text-sm">No users yet</p>
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
                    Email
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
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.photo ? (
                          <img
                            src={user.photo}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600">
                              person
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.phone || "N/A"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => remove(user._id, user.name)}
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

      {/* Create User Modal */}
      <AdminCreateModal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewUser({ name: "", email: "", password: "", phone: "" });
        }}
        onSubmit={handleCreateUser}
        title="Create New User"
        fields={userFields}
        formData={newUser}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default AdminUsers;
