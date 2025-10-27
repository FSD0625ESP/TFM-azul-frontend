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
  repeatPassword,
  setRepeatPassword,
  loading,
  handleRegister,
  inputStyle,
}) => {
  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
