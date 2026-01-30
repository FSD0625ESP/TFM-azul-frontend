import React from "react";
import { Link } from "react-router-dom";
import PhotoInput from "./PhotoInput";
import { FormInput } from "./FormInput";

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
  photo,
  setPhoto,
  photoPreview,
  setPhotoPreview,
  loading,
  handleRegister,
}) => {
  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      {/* Store Logo */}
      <PhotoInput
        photo={photo}
        setPhoto={setPhoto}
        photoPreview={photoPreview}
        setPhotoPreview={setPhotoPreview}
        label="Optional: Add store logo"
        inputId="photo-input-store"
      />

      {/* Store Name */}
      <FormInput
        type="text"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        placeholder="Store name"
        icon="storefront"
      />

      {/* Store Type */}
      <FormInput
        type="text"
        value={shopType}
        onChange={(e) => setShopType(e.target.value)}
        placeholder="Store type"
        icon="category"
      />

      {/* Address */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
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
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
        />

        {/* Address suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-t-0 border-gray-300 dark:border-gray-600 rounded-b-lg max-h-50 overflow-y-auto z-20 shadow-md">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSelectAddress(suggestion)}
                className={`px-4 py-3 cursor-pointer text-gray-900 dark:text-gray-200 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  index < suggestions.length - 1
                    ? "border-b border-gray-100 dark:border-gray-700"
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
      <FormInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        icon="mail"
      />

      {/* Phone */}
      <FormInput
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        icon="phone"
      />

      {/* Password */}
      <FormInput
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        icon="lock"
      />

      {/* Repeat Password */}
      <FormInput
        type="password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        placeholder="Repeat password"
        icon="lock"
      />

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
        <Link
          to="/login"
          className="text-emerald-500 no-underline text-sm hover:underline"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default StoreForm;
