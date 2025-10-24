import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RiderProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col pb-20 pt-4">
        {/* Profile Image and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img
              src={user.photo || "https://via.placeholder.com/96"}
              alt="User profile"
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
            />
            <button className="absolute bottom-0 right-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 text-white border-none cursor-pointer shadow-md hover:bg-emerald-600">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
        </div>

        {/* User Details */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Email */}
          <div className="flex gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center h-10 w-10 min-w-[40px] rounded-lg bg-gray-100">
              <span className="material-symbols-outlined text-gray-500">
                mail
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="text-base font-medium text-gray-900">
                {user.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center h-10 w-10 min-w-[40px] rounded-lg bg-gray-100">
              <span className="material-symbols-outlined text-gray-500">
                phone
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Phone</p>
              <p className="text-base font-medium text-gray-900">
                {user.phone ? `+${user.phone}` : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-transparent border-none text-base font-medium text-red-600 cursor-pointer hover:text-red-700 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 flex justify-around border-t border-gray-200 bg-white/80 backdrop-blur-sm p-2 gap-2">
        {/* Map */}
        <a
          href="/mainscreen"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg p-2 no-underline text-gray-400 text-xs hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">map</span>
          <span>Map</span>
        </a>

        {/* Profile (Active) */}
        <a
          href="#"
          className="flex flex-col items-center justify-center gap-1 flex-1 rounded-lg bg-emerald-50 p-2 no-underline text-emerald-500 text-xs font-bold"
        >
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
};

export default RiderProfile;
