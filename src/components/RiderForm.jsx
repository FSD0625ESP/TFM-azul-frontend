import React from "react";

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
  showPassword,
  setShowPassword,
  repeatPassword,
  setRepeatPassword,
  showRepeatPassword,
  setShowRepeatPassword,
  photo,
  setPhoto,
  photoPreview,
  setPhotoPreview,
  loading,
  handleRegister,
  inputStyle,
}) => {
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      {/* Profile Photo */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-2">
          <img
            src={photoPreview || "https://via.placeholder.com/96"}
            alt="Profile preview"
            className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
          />
          <label
            htmlFor="photo-input"
            className="absolute bottom-0 right-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 text-white cursor-pointer shadow-md hover:bg-emerald-600"
          >
            <span className="material-symbols-outlined text-sm">
              add_a_photo
            </span>
          </label>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500">Optional: Add profile photo</p>
      </div>

      {/* First Name */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          person
        </span>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Last Name */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          badge
        </span>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
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
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">
            {showPassword ? "visibility" : "visibility_off"}
          </span>
        </button>
      </div>

      {/* Repeat Password */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          lock
        </span>
        <input
          type={showRepeatPassword ? "text" : "password"}
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          placeholder="Repeat password"
          className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={() => setShowRepeatPassword(!showRepeatPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">
            {showRepeatPassword ? "visibility" : "visibility_off"}
          </span>
        </button>
      </div>

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

export default RiderForm;
