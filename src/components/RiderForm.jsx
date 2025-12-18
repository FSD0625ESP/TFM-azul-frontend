import React from "react";
import { Link } from "react-router-dom";
import PhotoInput from "./PhotoInput";
import { FormInput } from "./FormInput";

const RiderForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
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
      {/* Profile Photo */}
      <PhotoInput
        photo={photo}
        setPhoto={setPhoto}
        photoPreview={photoPreview}
        setPhotoPreview={setPhotoPreview}
        label="Optional: Add profile photo"
        inputId="photo-input"
      />

      {/* First Name */}
      <FormInput
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First name"
        icon="person"
      />

      {/* Last Name */}
      <FormInput
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last name"
        icon="badge"
      />

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
        {loading ? "Creating account..." : "Create account"}
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

export default RiderForm;
