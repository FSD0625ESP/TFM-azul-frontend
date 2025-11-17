import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { WSProvider } from "./context/WebSocketContext.jsx"; // 👈 Importa tu provider

// Obtener usuario del localStorage
const user = JSON.parse(localStorage.getItem("user") || "{}");

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
