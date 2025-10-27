import React from "react";

const StoreForm = ({
  shopName,
  setShopName,
  shopType,
  setShopType,
  address,
  setAddress,
  searchAddress,
  suggestions,
  handleSelectAddress,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  repeatPassword,
  setRepeatPassword,
  loading,
  handleRegister,
  inputStyle,
}) => {
  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      {/* Store Name */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          storefront
        </span>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Store name"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Store Type */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          category
        </span>
        <input
          type="text"
          value={shopType}
          onChange={(e) => setShopType(e.target.value)}
          placeholder="Store type"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Address */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
          location_on
        </span>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            searchAddress(e.target.value);
          }}
          placeholder="Address"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />

        {/* Address suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-gray-300 rounded-b-lg max-h-50 overflow-y-auto z-20 shadow-md">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSelectAddress(suggestion)}
                className={`px-4 py-3 cursor-pointer text-gray-900 text-sm transition-colors hover:bg-gray-100 ${
                  index < suggestions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                {suggestion.place_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          mail
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Phone */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          phone
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          lock
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Repeat Password */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          lock
        </span>
        <input
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          placeholder="Repeat password"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 py-3 px-4 rounded-lg border-none bg-emerald-500 text-white text-base font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
      >
        {loading ? "Creating store..." : "Create store"}
      </button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-emerald-500 no-underline text-sm hover:underline"
        >
          Sign In
        </a>
      </p>
    </form>
  );
};

export default StoreForm;
