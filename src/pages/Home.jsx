import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-home.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Header with Logo */}
      <header className="w-full px-4 pt-8 pb-4 flex justify-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-500 text-4xl">
            local_mall
          </span>
          <span className="font-bold text-2xl text-gray-800">SoulBites</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-1">
        {/* Hero Image */}
        <div
          className="flex-1 min-h-80 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        ></div>

        {/* Content Section */}
        <div className="bg-white rounded-t-3xl -mt-8 pt-8 pb-5 flex-shrink-0">
          {/* Headline */}
          <h1 className="text-4xl font-bold leading-tight text-gray-900 text-center pb-3 px-6 m-0">
            Connecting hearts, one plate at a time.
          </h1>

          {/* Description */}
          <p className="text-base font-normal leading-relaxed text-gray-600 text-center pb-6 pt-1 px-6 m-0">
            Join our community of stores, riders and volunteers to rescue
            delicious food and bring it to those who need it most in your city.
          </p>

          {/* Buttons */}
          <div className="flex justify-center px-4 py-3">
            <div className="flex gap-3 max-w-md flex-col w-full">
              <button
                onClick={() => navigate("/register")}
                className="h-12 rounded-xl px-5 py-3 bg-emerald-500 text-gray-900 font-bold text-base cursor-pointer transition-colors hover:bg-emerald-600 active:bg-emerald-700"
              >
                Create an account
              </button>
              <button
                onClick={() => navigate("/login")}
                className="h-12 rounded-xl px-5 py-3 bg-transparent text-gray-800 border-2 border-gray-800 font-bold text-base cursor-pointer transition-colors hover:bg-gray-100 active:bg-gray-200"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="h-5"></div>
        </div>
      </main>
    </div>
  );
};

export default Home;
