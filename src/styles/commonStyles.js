// ===== COLORES =====
export const COLORS = {
  primary: "#123B7E",
  primaryHover: "#0d2a5c",
  success: "#60BE1A",
  error: "#dc2626",
  white: "#ffffff",
  black: "#000000",
};

// ===== ESTILOS DE INPUTS =====
export const textFieldSx = {
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    height: "48px",
    backgroundColor: "white",
    borderRadius: "9999px",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "transparent" },
    "&.Mui-focused fieldset": { borderColor: "transparent" },
  },
  "& .MuiInputBase-input": { color: "black" },
};

// ===== ESTILOS DE BOTONES =====
export const buttonSx = {
  height: "48px",
  borderRadius: "9999px",
  backgroundColor: COLORS.primary,
  color: "white",
  fontSize: "16px",
  fontWeight: "500",
  textTransform: "none",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": { backgroundColor: COLORS.primaryHover },
  "&:disabled": { opacity: 0.7, cursor: "not-allowed" },
};

export const buttonStyleInline = {
  height: "48px",
  borderRadius: "9999px",
  backgroundColor: COLORS.primary,
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  width: "100%",
  transition: "all 0.3s ease",
  marginBottom: "12px",
};

// ===== ESTILOS DE CONTENEDORES =====
export const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "16px",
  backgroundColor: COLORS.success,
};

// ===== ESTILOS DE ALERTAS =====
export const alertSuccessStyle = {
  alert: "alert-success",
  classNames: "mb-4 text-white bg-green-600 border-none rounded-2xl",
};

export const alertErrorStyle = {
  alert: "alert-error",
  classNames: "mb-4 text-white bg-red-600 border-none rounded-2xl",
};

// ===== FUNCIÓN AUXILIAR PARA HOVER DE BOTONES =====
export const buttonHoverHandler = (e) => {
  e.target.style.opacity = e.type === "mouseenter" ? "0.85" : "1";
};
