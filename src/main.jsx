import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { WSProvider } from "./context/WebSocketContext.jsx"; // 👈 Importa tu provider

// Obtener usuario (rider o store) del localStorage y normalizar para WS
const rawUser = localStorage.getItem("user") || localStorage.getItem("store");
let user = null;
if (rawUser) {
  try {
    const parsed = JSON.parse(rawUser);
    // Añadir role para que WSProvider sepa si es 'rider' o 'store'
    const isStore = !!localStorage.getItem("store");
    user = { ...parsed, role: isStore ? "store" : "rider" };
  } catch (e) {
    user = null;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WSProvider user={user}>
      {" "}
      {/* 👈 Aquí envolvemos App */}
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </WSProvider>
  </StrictMode>
);
