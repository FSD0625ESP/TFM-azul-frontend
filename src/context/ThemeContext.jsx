import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Cargar tema inicial desde localStorage
    const user = localStorage.getItem("user");
    const store = localStorage.getItem("store");

    console.log("🔍 Loading initial theme from localStorage");
    if (user) {
      const userData = JSON.parse(user);
      console.log("👤 User data:", userData);
      console.log("🎨 User theme:", userData.theme || "light");
      return userData.theme || "light";
    } else if (store) {
      const storeData = JSON.parse(store);
      console.log("🏪 Store data:", storeData);
      console.log("🎨 Store theme:", storeData.theme || "light");
      return storeData.theme || "light";
    }
    console.log("🎨 No user/store found, defaulting to light");
    return "light";
  });

  useEffect(() => {
    // Aplicar el tema al documento
    console.log("🎨 Applying theme:", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      console.log("✅ Dark class added to html");
    } else {
      document.documentElement.classList.remove("dark");
      console.log("✅ Dark class removed from html");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const updateTheme = (newTheme) => {
    console.log("🔄 Updating theme to:", newTheme);
    setTheme(newTheme);

    // Actualizar localStorage
    const user = localStorage.getItem("user");
    const store = localStorage.getItem("store");

    if (user) {
      const userData = JSON.parse(user);
      userData.theme = newTheme;
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("💾 User theme saved to localStorage");
    } else if (store) {
      const storeData = JSON.parse(store);
      storeData.theme = newTheme;
      localStorage.setItem("store", JSON.stringify(storeData));
      console.log("💾 Store theme saved to localStorage");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
